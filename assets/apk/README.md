# APK Files

This directory contains the compiled APK files for the Bazar List App.

## Available APK Files

- **BazarList.apk** - Latest version of the Bazar List App

## How to Install

1. Download the APK file from this directory
2. Enable "Install from Unknown Sources" in your Android settings:
   - Go to Settings > Security > Unknown Sources
   - Or Settings > Apps > Special app access > Install unknown apps
3. Install the APK file on your device

## Version Information

- **App Name**: Bazar List (বাজারের লিস্ট)
- **File Size**: ~100MB
- **Platform**: Android

## Building APK

To build a new APK using EAS Build:

```bash
# For internal testing (APK format)
eas build --platform android --profile internal

# For production (AAB format)
eas build --platform android --profile production
```

The built APK will be available for download from the EAS Build dashboard. 