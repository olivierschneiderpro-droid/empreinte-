require('./scripts/generate-theme-css.cjs')
const { getSentryExpoConfig } = require('@sentry/react-native/metro')

const { withUniwindConfig } = require('uniwind/metro')

const path = require('path')

const config = getSentryExpoConfig(__dirname)

// Empreinte : le moteur vit dans packages/core, à la racine du dépôt.
const moteurEmpreinte = path.resolve(__dirname, '../../../packages/core')
config.watchFolders = [
  ...(config.watchFolders ?? []),
  moteurEmpreinte,
  path.resolve(__dirname, '../../../packages/bible-references'),
]

config.resolver = {
  ...config.resolver,
  assetExts: [
    ...config.resolver.assetExts,
    'db',
    'sqlite',
    'mp3',
    'ttf',
    'otf',
    'png',
    'jpg',
    'jpeg',
    'json',
    'txt',
    'html',
    'lottie',
  ],
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    '@empreinte/core': path.join(moteurEmpreinte, 'src'),
    '@empreinte/bible-references': path.resolve(__dirname, '../../../packages/bible-references/src/referenceParser.js'),
  },
}

config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      inlineRequires: true,
    },
  }),
}

module.exports = withUniwindConfig(config, {
  cssEntryFile: './global.css',
  dtsFile: './src/uniwind-types.d.ts',
  extraThemes: ['default', 'sepia', 'nature', 'sunset', 'black', 'mauve', 'night'],
})
