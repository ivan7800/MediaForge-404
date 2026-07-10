$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$port = 8080

function Test-PortAvailable([int]$candidate) {
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $candidate)
        $listener.Start()
        $listener.Stop()
        return $true
    } catch { return $false }
}

while ($port -le 8090 -and -not (Test-PortAvailable $port)) { $port++ }
if ($port -gt 8090) {
    Write-Host 'No hay un puerto libre entre 8080 y 8090.' -ForegroundColor Red
    Read-Host 'Pulsa Intro para cerrar'
    exit 1
}

$url = "http://localhost:$port"
Start-Process $url
if (Get-Command py -ErrorAction SilentlyContinue) {
    py -m http.server $port --bind 127.0.0.1
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    python -m http.server $port --bind 127.0.0.1
} else {
    Write-Host 'MediaForge 404 necesita Python o debe publicarse en GitHub Pages.' -ForegroundColor Yellow
    Read-Host 'Pulsa Intro para cerrar'
}
