# package-exports-test

This tests how different bundlers handle the package.json:

```json
{
  "type": "module",
  "main": "main.js",
  "module": "module.js",
  "browser": {
    "./browser.js": "./browser-override.js"
  },
  "exports": {
    ".": {
      "browser": "./browser.js",
      "require": "./require.js"
    }
  }
}
```

## Result

| esbuild  | rollup              | vite                | webpack             |
| -------- | ------------------- | ------------------- | ------------------- |
| browser.js | browser-override.js | browser-override.js | browser-override.js |
