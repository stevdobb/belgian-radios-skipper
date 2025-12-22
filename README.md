# belgian-radio

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

## GitHub Pages Deployment

Deze repository is geconfigureerd voor GitHub Pages.

### Deployment stappen:

1. **Push naar GitHub**
   ```
   git push origin main
   ```

2. **Build en deploy naar GitHub Pages**
   ```
   npm run deploy
   ```

Of handmatig:
   ```
   npm run build
   git add docs -f
   git commit -m "build: GitHub Pages deployment"
   git push
   ```

3. **GitHub Pages configureren**
   - Ga naar repository Settings → Pages
   - Select "Deploy from a branch"
   - Branch: `main`
   - Folder: `/docs`
   - Click "Save"

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
