# Black-screen fix

The Electron build uses `file://` to load the Vite production files. Vite must therefore emit relative asset URLs. This project now includes `vite.config.js` with `base: './'` and the React Vite plugin.

After replacing your old project with this version:

```powershell
npm install
npm run desktop
```

Then run the newly generated EXE from `release`.
