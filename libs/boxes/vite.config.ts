/// <reference types='vitest' />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'node:path';
import fs from 'node:fs';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import generatePackageJson from 'rollup-plugin-generate-package-json';

const __dirname = import.meta.dirname;
const srcDir = path.resolve(__dirname, 'src');
const entries = fs
  .readdirSync(srcDir, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isDirectory() &&
      fs.existsSync(path.join(srcDir, entry.name, 'index.ts')),
  )
  .map((entry) => entry.name)
  .reduce((cur, next) => {
    return {
      ...cur,
      [next]: path.join(srcDir, next, 'index.ts'),
    };
  }, {});

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/boxes',
  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin([
      '*.md',
      {
        input: 'src',
        glob: 'custom-elements.json',
        output: '.',
      },
      {
        input: 'src/types',
        glob: '**/*',
        output: 'types',
      },
    ]),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
      pathsToAliases: false,
    }),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //   plugins: () => [ nxViteTsPaths() ],
  // },
  // Configuration for building your library.
  // See: https://vite.dev/guide/build.html#library-mode
  build: {
    outDir: '../../dist/libs/boxes',
    emptyOutDir: true,
    reportCompressedSize: true,
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: entries,
      name: 'boxes',
      formats: ['es' as const],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: [],
      plugins: [
        generatePackageJson({
          inputFolder: __dirname,
          baseContents: (pkg: any) => ({
            ...pkg,
            exports: Object.keys(entries).reduce(
              (acc: any, entry: string) => {
                acc[`./${entry}`] = {
                  types: `./${entry}/index.d.ts`,
                  default: `./${entry}.js`,
                };
                return acc;
              },
              {
                ...(pkg.exports ?? {}),
                './package.json': {
                  default: './package.json',
                },
              },
            ),
          }),
        }),
      ],
    },
  },
}));
