import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import withLitSSR from '@lit-labs/nextjs';
import { composePlugins, withNx } from '@nx/next';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const boxesSourcePath = path.resolve(__dirname, '../../libs/boxes/src');
const inlineScssRule = {
  test: /\.scss$/i,
  resourceQuery: /inline/,
  type: 'asset/source',
  use: [
    {
      loader: require.resolve('sass-loader'),
    },
  ],
};

const nextConfig = {
  nx: {},
  reactStrictMode: true,
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@/boxes': boxesSourcePath,
    };

    const cssRuleSet = config.module.rules.find(
      (rule) => typeof rule === 'object' && Array.isArray(rule.oneOf),
    );

    if (cssRuleSet) {
      cssRuleSet.oneOf.unshift(inlineScssRule);
    } else {
      config.module.rules.unshift(inlineScssRule);
    }

    return config;
  },
};

export default composePlugins(withNx, withLitSSR())(nextConfig);
