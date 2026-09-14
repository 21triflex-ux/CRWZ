# SPLIT RUN — Windows Desktop App

This project is packaged with Electron so it can run as a normal Windows desktop application.

## Build the Windows app

1. Install Node.js LTS from https://nodejs.org/
2. Open Command Prompt in this folder.
3. Run:

   npm install

4. Build the Windows applications:

   npm run desktop

The output will be in the `release` folder. The portable `.exe` can be double-clicked and does not require a terminal.

## Installer

To build a normal Windows installer instead:

   npm run desktop:installer

That creates an installer in `release` and can create a desktop shortcut.

## Development

   npm run dev

For Electron testing after a production build:

   npm run build
   npm run electron

User data is stored by the app using browser localStorage, as in the original standalone version.
