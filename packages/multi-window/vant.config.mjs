export default {
  name: 'multi-window',
  build: {
    srcDir: 'src',
    tagPrefix: '',
    namedExport: true,
    skipInstall: ['lazyload'],
    packageManager: 'pnpm',
    extensions: {
      esm: '.mjs',
    },
    vetur: {

    },
    css: {
      removeSourceFile: true,
    },
  },
}
