# SPLIT / RUN — iPhone PWA

This project is configured for GitHub Pages.

## Deploy

1. Put the contents of this folder in your GitHub repository.
2. In GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Push/commit the files.
4. Open the repository's **Actions** tab and wait for **Deploy SPLIT RUN to GitHub Pages** to finish.
5. Open the Pages URL on your iPhone in Safari.
6. Tap **Share → Add to Home Screen**.

The GitHub Actions workflow automatically sets the Vite base path to the repository name, so project-page URLs work correctly.

The PWA manifest, service worker, and icons live in `public/`, which Vite copies into the production `dist/` folder.

App data is stored locally in each browser/device using localStorage. It does not automatically sync between the Windows app and iPhone.
