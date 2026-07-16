$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $projectRoot 'assets\app-icon.png'

if (-not (Test-Path $sourcePath)) {
    throw "Missing source icon: $sourcePath"
}

function New-Canvas([int]$width, [int]$height, [System.Drawing.Color]$background) {
    $bitmap = New-Object System.Drawing.Bitmap $width, $height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear($background)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    return @{ Bitmap = $bitmap; Graphics = $graphics }
}

function Save-SquareIcon([System.Drawing.Image]$source, [string]$path, [int]$size, [bool]$round) {
    $canvas = New-Canvas $size $size ([System.Drawing.Color]::Transparent)
    if ($round) {
        $clip = New-Object System.Drawing.Drawing2D.GraphicsPath
        $clip.AddEllipse(0, 0, $size, $size)
        $canvas.Graphics.SetClip($clip)
    }
    $canvas.Graphics.DrawImage($source, 0, 0, $size, $size)
    $canvas.Bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $canvas.Graphics.Dispose()
    $canvas.Bitmap.Dispose()
}

function Save-Splash([System.Drawing.Image]$source, [string]$path, [int]$width, [int]$height) {
    $canvas = New-Canvas $width $height ([System.Drawing.Color]::FromArgb(251, 251, 253))
    $iconSize = [int]([Math]::Min($width, $height) * 0.24)
    $x = [int](($width - $iconSize) / 2)
    $y = [int](($height - $iconSize) / 2)
    $radius = [int]($iconSize * 0.22)
    $diameter = $radius * 2
    $clip = New-Object System.Drawing.Drawing2D.GraphicsPath
    $clip.AddArc($x, $y, $diameter, $diameter, 180, 90)
    $clip.AddArc($x + $iconSize - $diameter, $y, $diameter, $diameter, 270, 90)
    $clip.AddArc($x + $iconSize - $diameter, $y + $iconSize - $diameter, $diameter, $diameter, 0, 90)
    $clip.AddArc($x, $y + $iconSize - $diameter, $diameter, $diameter, 90, 90)
    $clip.CloseFigure()
    $canvas.Graphics.SetClip($clip)
    $canvas.Graphics.DrawImage($source, $x, $y, $iconSize, $iconSize)
    $canvas.Bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $canvas.Graphics.Dispose()
    $canvas.Bitmap.Dispose()
}

$source = [System.Drawing.Bitmap]::FromFile($sourcePath)

Save-SquareIcon $source (Join-Path $projectRoot 'public\icon-192.png') 192 $false
Save-SquareIcon $source (Join-Path $projectRoot 'public\icon-512.png') 512 $false

$densities = @{
    'mdpi' = @{ Icon = 48; Foreground = 108 }
    'hdpi' = @{ Icon = 72; Foreground = 162 }
    'xhdpi' = @{ Icon = 96; Foreground = 216 }
    'xxhdpi' = @{ Icon = 144; Foreground = 324 }
    'xxxhdpi' = @{ Icon = 192; Foreground = 432 }
}

foreach ($density in $densities.Keys) {
    $directory = Join-Path $projectRoot "android\app\src\main\res\mipmap-$density"
    $iconSize = $densities[$density].Icon
    Save-SquareIcon $source (Join-Path $directory 'ic_launcher.png') $iconSize $false
    Save-SquareIcon $source (Join-Path $directory 'ic_launcher_round.png') $iconSize $true
    Save-SquareIcon $source (Join-Path $directory 'ic_launcher_foreground.png') $densities[$density].Foreground $false
}

$splashFiles = Get-ChildItem (Join-Path $projectRoot 'android\app\src\main\res') -Recurse -Filter 'splash.png'
foreach ($splashFile in $splashFiles) {
    $existing = [System.Drawing.Image]::FromFile($splashFile.FullName)
    $width = $existing.Width
    $height = $existing.Height
    $existing.Dispose()
    Save-Splash $source $splashFile.FullName $width $height
}

$source.Dispose()
Write-Host 'Generated Android and PWA brand assets.'
