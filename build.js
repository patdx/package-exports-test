import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import common from '@rollup/plugin-commonjs';
import * as esbuild from 'esbuild';
import webpack from 'webpack';
import { promisify } from 'node:util';
import { resolve } from 'path';
import * as vite from 'vite';

const bundle = await rollup({
  input: './src/main.js',
  plugins: [
    nodeResolve({
      preferBuiltins: true,
      exportConditions: ['worker', 'solid'],
      browser: true,
    }),
    common(),
  ],
});
// or write the bundle to disk
await bundle.write({ format: 'esm', dir: './out/rollup' });

// closes the bundle
await bundle.close();

// esbuild

await esbuild.build({
  entryPoints: ['./src/main.js'],
  bundle: true,
  outdir: './out/esbuild',
  format: 'esm',
  conditions: ['worker', 'browser'],
});

// webpack

const compiler = webpack({
  target: 'web',
  entry: './src/main.js',
  output: {
    path: resolve('./out/webpack'),
  },
});

await promisify(compiler.run.bind(compiler))();

// vite

await vite.build({
  root: resolve('./src'),
  build: {
    ssr: true,
    rollupOptions: {
      input: './src/main.js',
      output: {
        dir: './out/vite',
      },
    },
  },
  ssr: {
    target: 'webworker',
    noExternal: true,
  },
});
