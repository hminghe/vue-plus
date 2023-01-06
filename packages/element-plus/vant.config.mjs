export default {
  name: 'element-plus',
  build: {
    srcDir: 'src',
    tagPrefix: 'vp-',
    namedExport: true,
    skipInstall: ['lazyload'],
    packageManager: 'pnpm',
    extensions: {
      esm: '.mjs',
    },
    vetur: {
      tagPrefix: 'vp-',
    },
    css: {
      removeSourceFile: true,
    },
  },
}
