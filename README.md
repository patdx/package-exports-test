# package-exports-test

This tests how different bundlers handle the package.json:

```json
{
  "type": "module",
  "main": "legacy.js",
  "module": "legacy.js",
  "browser": {
    "./index.js": "./browser-override.js"
  },
  "exports": {
    ".": {
      "browser": "./index.js",
      "require": "./require.js"
    }
  }
}
```

## Result

| esbuild  | rollup              | vite                | webpack             |
| -------- | ------------------- | ------------------- | ------------------- |
| index.js | browser-override.js | browser-override.js | browser-override.js |
