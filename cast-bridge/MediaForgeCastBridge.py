#!/usr/bin/env python3
"""MediaForge Cast Bridge: serve one local media file to devices on the LAN.

No third-party packages are required. The server exposes only the selected file,
uses a random URL token, supports HTTP byte ranges, and stops with Ctrl+C.
"""
from __future__ import annotations

import argparse
import html
import http.server
import mimetypes
import os
import secrets
import socket
import subprocess
import sys
import threading
import urllib.parse
import webbrowser
from pathlib import Path
from typing import Optional

CHUNK_SIZE = 1024 * 1024


def local_ip() -> str:
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        sock.connect(("8.8.8.8", 80))
        return sock.getsockname()[0]
    except OSError:
        return "127.0.0.1"
    finally:
        sock.close()


def copy_to_clipboard(text: str) -> None:
    if os.name != "nt":
        return
    try:
        subprocess.run(["clip"], input=text, text=True, check=False, creationflags=0x08000000)
    except OSError:
        pass


class BridgeServer(http.server.ThreadingHTTPServer):
    daemon_threads = True
    allow_reuse_address = True

    def __init__(self, address, handler, media_file: Path, token: str):
        super().__init__(address, handler)
        self.media_file = media_file
        self.token = token
        self.public_name = urllib.parse.quote(media_file.name)

    @property
    def media_path(self) -> str:
        return f"/media/{self.token}/{self.public_name}"


class BridgeHandler(http.server.BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    server_version = "MediaForgeCastBridge/1.0"

    def log_message(self, fmt: str, *args) -> None:
        print(f"[Cast Bridge] {self.address_string()} - {fmt % args}")

    def _cors_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Range, Content-Type")
        self.send_header("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges")
        self.send_header("Access-Control-Allow-Private-Network", "true")
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self._cors_headers()
        self.end_headers()

    def do_HEAD(self) -> None:
        self._serve_media(send_body=False)

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/":
            self._serve_status_page()
            return
        if parsed.path == "/status":
            body = b'{"ok":true,"service":"MediaForge Cast Bridge"}'
            self.send_response(200)
            self._cors_headers()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        self._serve_media(send_body=True)

    def _serve_status_page(self) -> None:
        file_name = html.escape(self.server.media_file.name)
        url = html.escape(self.server.media_path)
        body = f"""<!doctype html><html lang='es'><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>MediaForge Cast Bridge</title><style>body{{font-family:system-ui;background:#050a12;color:#e7f4ff;max-width:760px;margin:8vh auto;padding:24px}}main{{background:#0b1523;border:1px solid #243a50;border-radius:20px;padding:24px}}code{{display:block;overflow-wrap:anywhere;background:#02070d;padding:12px;border-radius:10px;color:#61eadb}}small{{color:#9db0c3}}</style><main><h1>MediaForge Cast Bridge</h1><p>Sirviendo únicamente:</p><strong>{file_name}</strong><p>Ruta protegida:</p><code>{url}</code><p><small>Mantén esta ventana abierta. Pulsa Ctrl+C en la consola para detener el servidor.</small></p></main></html>""".encode("utf-8")
        self.send_response(200)
        self._cors_headers()
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _serve_media(self, send_body: bool) -> None:
        parsed_path = urllib.parse.urlparse(self.path).path
        if parsed_path != self.server.media_path:
            self.send_error(404, "Recurso no disponible")
            return

        path = self.server.media_file
        try:
            size = path.stat().st_size
        except OSError:
            self.send_error(404, "El archivo ya no está disponible")
            return

        start, end = 0, size - 1
        range_header = self.headers.get("Range")
        partial = False
        if range_header:
            try:
                unit, value = range_header.strip().split("=", 1)
                if unit.lower() != "bytes" or "," in value:
                    raise ValueError
                first, last = value.split("-", 1)
                if first:
                    start = int(first)
                    end = int(last) if last else end
                else:
                    suffix = int(last)
                    start = max(0, size - suffix)
                end = min(end, size - 1)
                if start < 0 or start > end:
                    raise ValueError
                partial = True
            except ValueError:
                self.send_response(416)
                self._cors_headers()
                self.send_header("Content-Range", f"bytes */{size}")
                self.end_headers()
                return

        length = end - start + 1
        content_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        self.send_response(206 if partial else 200)
        self._cors_headers()
        self.send_header("Content-Type", content_type)
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Length", str(length))
        if partial:
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.end_headers()
        if not send_body:
            return

        try:
            with path.open("rb") as stream:
                stream.seek(start)
                remaining = length
                while remaining > 0:
                    chunk = stream.read(min(CHUNK_SIZE, remaining))
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    remaining -= len(chunk)
        except (BrokenPipeError, ConnectionResetError):
            pass


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Sirve un archivo multimedia local para Google Cast.")
    parser.add_argument("file", type=Path, help="Archivo de vídeo o audio")
    parser.add_argument("--port", type=int, default=8787, help="Puerto de escucha (8787 por defecto)")
    parser.add_argument("--no-browser", action="store_true", help="No abrir la página de estado")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    media_file = args.file.expanduser().resolve()
    if not media_file.is_file():
        print(f"ERROR: no existe el archivo: {media_file}", file=sys.stderr)
        return 2
    if not 1024 <= args.port <= 65535:
        print("ERROR: el puerto debe estar entre 1024 y 65535", file=sys.stderr)
        return 2

    token = secrets.token_urlsafe(12)
    try:
        server = BridgeServer(("0.0.0.0", args.port), BridgeHandler, media_file, token)
    except OSError as exc:
        print(f"ERROR: no se pudo abrir el puerto {args.port}: {exc}", file=sys.stderr)
        return 3

    ip = local_ip()
    media_url = f"http://{ip}:{args.port}{server.media_path}"
    local_url = f"http://127.0.0.1:{args.port}/"
    copy_to_clipboard(media_url)

    print("\nMediaForge Cast Bridge 1.0")
    print("=" * 34)
    print(f"Archivo : {media_file.name}")
    print(f"URL Cast: {media_url}")
    print("\nLa URL se ha copiado al portapapeles en Windows.")
    print("Pégala en MediaForge → Transmitir.")
    print("Mantén esta ventana abierta. Ctrl+C para detener.\n")

    if not args.no_browser:
        threading.Timer(0.7, lambda: webbrowser.open(local_url)).start()
    try:
        server.serve_forever(poll_interval=0.3)
    except KeyboardInterrupt:
        print("\nDeteniendo Cast Bridge…")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
