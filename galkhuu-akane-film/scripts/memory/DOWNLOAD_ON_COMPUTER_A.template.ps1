<#
  GALKHUU & AKANE - WEDDING PLAYBACK SETUP FOR COMPUTER A  (7 November 2026)

  Needs only Windows PowerShell 5.1+ and VLC. No Node, Remotion, GPU or source code.

  USAGE (right-click > "Run with PowerShell", or in a PowerShell window):
    powershell -ExecutionPolicy Bypass -File .\DOWNLOAD_ON_COMPUTER_A.ps1
        -> downloads the published files from GitHub into Desktop\WEDDING_PLAYBACK and verifies them

    powershell -ExecutionPolicy Bypass -File .\DOWNLOAD_ON_COMPUTER_A.ps1 -OfflineSource "E:\DELIVERY_Galkhuu_Akane_20261107"
        -> OFFLINE: copies from a USB stick / folder instead of downloading (also brings the
           LOCAL-ONLY music versions, which are NOT on GitHub). Missing files are downloaded.

    ... -BackupTo "E:\"        -> afterwards copies the verified WEDDING_PLAYBACK folder to a USB stick and re-verifies it
    ... -Destination "D:\WEDDING_PLAYBACK"   -> different target folder

  Run this BEFORE the event. Never stream from GitHub during the ceremony.
#>
param(
  [string]$Destination = (Join-Path ([Environment]::GetFolderPath('Desktop')) 'WEDDING_PLAYBACK'),
  [string]$OfflineSource = '',
  [string]$BackupTo = ''
)
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch {}

$ReleaseBase = '__RELEASE_BASE__'

# name -> SHA-256 (published on GitHub release)
$Public = [ordered]@{
__PUBLIC_HASHES__
}
# name -> SHA-256 (LOCAL ONLY - music versions; never published, copy from USB with -OfflineSource)
$LocalOnly = [ordered]@{
__LOCAL_HASHES__
}
# expected media facts: name -> width, height, seconds, hasAudio
$Media = @{
__MEDIA__
}

function Say($msg, $color = 'Gray') { Write-Host $msg -ForegroundColor $color }
function Hash($path) { (Get-FileHash -Algorithm SHA256 -LiteralPath $path).Hash.ToLower() }

function Find-Offline($name) {
  if (-not $OfflineSource -or -not (Test-Path -LiteralPath $OfflineSource)) { return $null }
  $hit = Get-ChildItem -LiteralPath $OfflineSource -Recurse -File -Filter $name -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($hit) { return $hit.FullName } else { return $null }
}

function Get-RemoteFile($name, $target) {
  $url = "$ReleaseBase/$name"
  $curl = Get-Command curl.exe -ErrorAction SilentlyContinue
  if ($curl) {
    & $curl.Source -L --fail --retry 3 --retry-delay 3 -s -S -o $target $url
    if ($LASTEXITCODE -ne 0) { throw "download failed: $url" }
  } else {
    Invoke-WebRequest -Uri $url -OutFile $target -UseBasicParsing
  }
}

function Ensure-File($name, $expected, [bool]$canDownload) {
  $target = Join-Path $Destination $name
  if ((Test-Path -LiteralPath $target) -and ((Hash $target) -eq $expected)) { Say "  OK (already present)  $name" 'Green'; return $true }
  $src = Find-Offline $name
  if ($src) {
    Copy-Item -LiteralPath $src -Destination $target -Force
    if ((Hash $target) -eq $expected) { Say "  OK (copied offline)   $name" 'Green'; return $true }
    Say "  checksum mismatch on offline copy of $name" 'Yellow'
  }
  if (-not $canDownload) { Say "  --  skipped (optional) $name  (local-only extra, not needed for playback)"; return $false }
  for ($i = 1; $i -le 2; $i++) {
    try {
      Say "  downloading ...        $name"
      Get-RemoteFile $name $target
      if ((Hash $target) -eq $expected) { Say "  OK (downloaded)       $name" 'Green'; return $true }
      Say "  checksum mismatch (attempt $i) $name" 'Yellow'
    } catch { Say "  error (attempt $i): $($_.Exception.Message)" 'Yellow' }
  }
  Say "  FAILED                $name" 'Red'; return $false
}

function Check-Media($name) {
  $path = Join-Path $Destination $name
  if (-not (Test-Path -LiteralPath $path)) { return $null }
  $exp = $Media[$name]
  $w = $null; $h = $null; $sec = $null; $audio = $null
  $ffprobe = Get-Command ffprobe -ErrorAction SilentlyContinue
  if ($ffprobe) {
    $v = & $ffprobe.Source -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 $path
    $w, $h = ($v -split ',')[0..1] | ForEach-Object { [int]$_ }
    $sec = [double](& $ffprobe.Source -v error -show_entries format=duration -of csv=p=0 $path)
    $audio = [bool](& $ffprobe.Source -v error -select_streams a -show_entries stream=codec_name -of csv=p=0 $path)
  } else {
    $shell = New-Object -ComObject Shell.Application
    $item = $shell.Namespace((Split-Path $path)).ParseName((Split-Path $path -Leaf))
    $w = [int]$item.ExtendedProperty('System.Video.FrameWidth')
    $h = [int]$item.ExtendedProperty('System.Video.FrameHeight')
    $d = $item.ExtendedProperty('System.Media.Duration'); if ($d) { $sec = [double]$d / 1e7 }
    $ch = $item.ExtendedProperty('System.Audio.ChannelCount'); $audio = [bool]$ch
  }
  $ok = ($w -eq $exp[0]) -and ($h -eq $exp[1]) -and ([math]::Abs($sec - $exp[2]) -lt 1.0) -and ($audio -eq $exp[3])
  $msg = "  {0,-48} {1}x{2}  {3:N1}s  audio={4}" -f $name, $w, $h, $sec, $(if ($audio) { 'yes' } else { 'no' })
  if ($ok) { Say "$msg  PASS" 'Green' } else { Say "$msg  FAIL (expected $($exp[0])x$($exp[1]) $($exp[2])s audio=$($exp[3]))" 'Red' }
  return $ok
}

function Find-VLC {
  foreach ($p in @("$env:ProgramFiles\VideoLAN\VLC\vlc.exe", "${env:ProgramFiles(x86)}\VideoLAN\VLC\vlc.exe")) { if ($p -and (Test-Path $p)) { return $p } }
  return $null
}

function Write-Launchers {
  $hasMusic = Test-Path (Join-Path $Destination 'Galkhuu_Akane_FINAL_154_132_1080p.mp4')
  $film = if ($hasMusic) { 'Galkhuu_Akane_FINAL_154_132_1080p.mp4' } else { 'Galkhuu_Akane_MemoryFilm_1080p_SILENT.mp4' }
  $vlcFind = "@echo off`r`nset VLC=%ProgramFiles%\VideoLAN\VLC\vlc.exe`r`nif not exist ""%VLC%"" set VLC=%ProgramFiles(x86)%\VideoLAN\VLC\vlc.exe`r`ncd /d ""%~dp0""`r`n"
  $L = [ordered]@{
    '1_WELCOME_SCREEN.cmd'      = "start """" ""%VLC%"" --fullscreen --no-video-title-show --no-osd --image-duration=-1 ""Galkhuu_Akane_Welcome_Screen.png"""
    '2_GUEST_ARRIVAL_LOOP.cmd'  = "start """" ""%VLC%"" --fullscreen --no-video-title-show --no-osd --loop ""Galkhuu_Akane_Waiting_Loop_1080p.mp4"""
    '3_MEMORY_FILM.cmd'         = "start """" ""%VLC%"" --fullscreen --no-video-title-show --no-osd --play-and-pause ""$film"""
    '3b_MEMORY_FILM_SILENT.cmd' = "start """" ""%VLC%"" --fullscreen --no-video-title-show --no-osd --play-and-pause ""Galkhuu_Akane_MemoryFilm_1080p_SILENT.mp4"""
    '4_CLOSING_SCREEN.cmd'      = "start """" ""%VLC%"" --fullscreen --no-video-title-show --no-osd --image-duration=-1 ""Galkhuu_Akane_Closing_Screen.png"""
    '9_FALLBACK_STILL.cmd'      = "start """" ""%VLC%"" --fullscreen --no-video-title-show --no-osd --image-duration=-1 ""Galkhuu_Akane_Fallback_Still.png"""
  }
  foreach ($k in $L.Keys) { [IO.File]::WriteAllText((Join-Path $Destination $k), $vlcFind + $L[$k] + "`r`n", [Text.Encoding]::ASCII) }
  return $film
}

# ---------------------------------------------------------------------------------------------
Say "`n=== Galkhuu & Akane - wedding playback setup ===" 'Cyan'
Say "Target folder: $Destination"
New-Item -ItemType Directory -Force -Path $Destination | Out-Null

Say "`n[1/4] Published files (GitHub release) - SHA-256 verified" 'Cyan'
$allOk = $true
foreach ($k in $Public.Keys) { if (-not (Ensure-File $k $Public[$k] $true)) { $allOk = $false } }

Say "`n[2/4] Optional local-only extras (USB / -OfflineSource; not needed for playback)" 'Cyan'
$musicOk = $true
foreach ($k in $LocalOnly.Keys) { if (-not (Ensure-File $k $LocalOnly[$k] $false)) { $musicOk = $false } }

Say "`n[3/4] Video/audio stream check" 'Cyan'
foreach ($k in $Media.Keys) { $r = Check-Media $k; if ($r -eq $false) { $allOk = $false } }

$film = Write-Launchers
Get-ChildItem -LiteralPath $Destination -File | Where-Object { $_.Extension -in '.mp4', '.png', '.m4a' } |
  ForEach-Object { "{0}  {1}" -f (Hash $_.FullName), $_.Name } | Set-Content -Encoding ASCII (Join-Path $Destination 'SHA256SUMS_VERIFIED.txt')

if ($BackupTo) {
  Say "`n[4/4] Offline backup copy -> $BackupTo" 'Cyan'
  $bk = Join-Path $BackupTo 'WEDDING_PLAYBACK'
  New-Item -ItemType Directory -Force -Path $bk | Out-Null
  robocopy $Destination $bk /E /NFL /NDL /NJH /NJS /NP | Out-Null
  $bad = Get-ChildItem -LiteralPath $Destination -File | Where-Object { (Hash $_.FullName) -ne (Hash (Join-Path $bk $_.Name)) }
  if ($bad) { Say "  BACKUP VERIFY FAILED: $($bad.Name -join ', ')" 'Red'; $allOk = $false } else { Say "  backup verified (all checksums match)" 'Green' }
} else { Say "`n[4/4] Offline backup: skipped (add -BackupTo E:\ to copy everything to a USB stick)" }

$vlc = Find-VLC
Say "`n=== RESULT ===" 'Cyan'
if ($allOk) { Say "PLAYBACK FILES READY: YES" 'Green' } else { Say "PLAYBACK FILES READY: NO - see FAILED lines above" 'Red' }
$hasFilm = Test-Path (Join-Path $Destination 'Galkhuu_Akane_FINAL_154_132_1080p.mp4')
Say $(if ($hasFilm) { "Memory film with music: present ($film)" } else { "Memory film with music: NOT present -> 3_MEMORY_FILM.cmd plays the SILENT version. Re-run with internet, or with -OfflineSource from the USB copy." }) $(if ($hasFilm) { 'Green' } else { 'Yellow' })
Say $(if ($vlc) { "VLC: $vlc" } else { "VLC NOT FOUND - install VLC (videolan.org) before the event." }) $(if ($vlc) { 'Green' } else { 'Red' })
Say @"

HOW TO PLAY (double-click in $Destination, on the HALL display - extended screen):
  1_WELCOME_SCREEN.cmd       welcome card (static)            - Esc / Ctrl+Q to close
  2_GUEST_ARRIVAL_LOOP.cmd   60 s floral loop, repeats
  3_MEMORY_FILM.cmd          4:14 memory film; stops on the names (no black screen)
  3b_MEMORY_FILM_SILENT.cmd  same film without audio (backup)
  4_CLOSING_SCREEN.cmd       thank-you card (static)
  9_FALLBACK_STILL.cmd       emergency card if anything fails
  In VLC: F = fullscreen on/off, Space = pause, Ctrl+Q = quit.
  Zoom: Share Screen > the hall display > tick "Share sound" + "Optimize for video clip".
"@
if (-not $allOk) { exit 1 }
