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
}

// Empreinte : chemins exacts du moteur et de l'analyseur de références.
const modulesEmpreinte = {
  '@empreinte/core': path.join(moteurEmpreinte, 'src/index.ts'),
  '@empreinte/bible-references': path.resolve(
    __dirname,
    '../../../packages/bible-references/src/referenceParser.js'
  ),
}
const resolutionParDefaut = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (modulesEmpreinte[moduleName]) {
    return { type: 'sourceFile', filePath: modulesEmpreinte[moduleName] }
  }
  return resolutionParDefaut
    ? resolutionParDefaut(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform)
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
