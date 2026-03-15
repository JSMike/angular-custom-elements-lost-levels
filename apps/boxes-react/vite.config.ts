/// <reference types='vitest' />
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

const boxesSourceRoot = path.resolve(import.meta.dirname, '../../libs/boxes/src');

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/boxes-react',
  server: {
    port: 4300,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  resolve: {
    alias: [
      {
        find: /^@\/boxes\/(.+)$/,
        replacement: path.join(boxesSourceRoot, '$1'),
      },
    ],
  },
  plugins: [
    react({
      tsDecorators: true,
      useAtYourOwnRisk_mutateSwcOptions(options) {
        if (options.jsc && options.jsc.transform) {
          options.jsc.transform.useDefineForClassFields = false;
        }
      },
    }),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //   plugins: () => [ nxViteTsPaths() ],
  // },
  build: {
    outDir: '../../dist/apps/boxes-react',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
