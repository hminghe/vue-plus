import { dirname, join } from 'path'
import type { Plugin } from 'vite'
import fs from 'fs-extra'
import fg from 'fast-glob'
import { highlight } from '../utils/highlight'

// const DIR_SRC = resolve(__dirname, '../..')

export function MarkdownTransform(): Plugin {
  // const DIR_TYPES = resolve(__dirname, '../../../types/packages')
  // const hasTypes = fs.existsSync(DIR_TYPES)

  // if (!hasTypes) {
  //   console.warn('No types dist found, run `npm run build:types` first.')
  // }

  return {
    name: 'vueplus-md-transform',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.match(/\.md\b/)) {
        return null
      }

      console.log('id', id)

      if (/index.md$/.test(id)) {
        const dir = join(dirname(id), 'demo')
        if (fs.existsSync(dir)) {
          const files = await fg('*', {
            onlyFiles: true,
            cwd: dir,
            ignore: [
              '_*',
              'dist',
              'node_modules',
            ],
          })

          const importComponents: string[] = []

          const descStartExp = '---\n'
          const descEndExp = '\n---'
          for (const file of files) {
            const content = fs.readFileSync(join(dir, file)).toString().replace(/\r\n/g, '\n')
            const descStart = content.indexOf(descStartExp)
            if (descStart === -1) {
              continue
            }
            const descEnd = content.indexOf(descEndExp)
            const desc = content.substring(descStart + 3, descEnd)

            const source = `${content.substring(0, descStart)}\n${content.substring(descEnd + descEndExp.length)}`.trim()

            const componentName = `Demo${file.charAt(0).toLocaleUpperCase()}${file.slice(1).replace(/\.|\-/g, '')}`

            importComponents.push(`import ${componentName} from './demo/${file}'`)

            // code += `${desc}\n\n<Demo :demo="${componentName}" source="${encodeURIComponent(highlight(source, 'vue'))}" />\n\n`
          }

          if (importComponents.length) {
            if (code.includes('</script>')) {
              code = code.replace('</script>', `\n${importComponents.join('\n')}\n</script>`)
            } else {
              code = `<script setup>\n${importComponents.join('\n')}\n</script>\n\n${code}`
            }
          }
        }
      }

      // console.log('code', code)

      return code
    },
  }
}
