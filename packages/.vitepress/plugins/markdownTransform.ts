import { dirname, join, resolve } from 'path'
import type { Plugin } from 'vite'
import fs from 'fs-extra'
import fg from 'fast-glob'
import { highlight } from '../utils/highlight'

const DIR_SRC = resolve(__dirname, '../..')

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

            code += `${desc}\n\n<Demo :demo="${componentName}" source="${encodeURIComponent(highlight(source, 'vue'))}" />\n\n`
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

      return code
    },
  }
}

const GITHUB_BLOB_URL = 'https://github.com/vueuse/vueuse/blob/main/packages'

export async function getFunctionMarkdown(pkg: string, name: string) {
  const URL = `${GITHUB_BLOB_URL}/${pkg}/${name}`

  const dirname = join(DIR_SRC, pkg, name)
  const demoPath = ['demo.vue', 'demo.client.vue'].find(i => fs.existsSync(join(dirname, i)))
  const types = await getTypeDefinition(pkg, name)

  let typingSection = ''

  if (types) {
    const code = `\`\`\`typescript\n${types.trim()}\n\`\`\``
    typingSection = types.length > 1000
      ? `
## Type Declarations

<details>
<summary op50 italic>Show Type Declarations</summary>

${code}

</details>
`
      : `\n## Type Declarations\n\n${code}`
  }

  const links = ([
    ['Source', `${URL}/index.ts`],
    demoPath ? ['Demo', `${URL}/${demoPath}`] : undefined,
    ['Docs', `${URL}/index.md`],
  ])
    .filter(i => i)
    .map(i => `[${i![0]}](${i![1]})`).join(' • ')

  const sourceSection = `## Source\n\n${links}\n`
  const ContributorsSection = `
## Contributors

<Contributors fn="${name}" />
  `
  const changelogSection = `
## Changelog

<Changelog fn="${name}" />
`

  const demoSection = demoPath
    ? demoPath.endsWith('.client.vue')
      ? `
<script setup>
import { defineAsyncComponent } from 'vue'
const Demo = defineAsyncComponent(() => import('./${demoPath}'))
</script>

## Demo

<DemoContainer>
<p class="demo-source-link"><a href="${URL}/${demoPath}" target="_blank">source</a></p>
<ClientOnly>
  <Suspense>
    <Demo/>
    <template #fallback>
      Loading demo...
    </template>
  </Suspense>
</ClientOnly>
</DemoContainer>
`
      : `
<script setup>
import Demo from \'./${demoPath}\'
</script>

## Demo

<DemoContainer>
<p class="demo-source-link"><a href="${URL}/${demoPath}" target="_blank">source</a></p>
<Demo/>
</DemoContainer>
`
    : ''
  const packageNote = packages.find(p => p.name === pkg)!.addon
    ? `Available in the <a href="/${pkg}/README">@vueuse/${pkg}</a> add-on.\n`
    : ''

  const footer = `${typingSection}\n\n${sourceSection}\n${ContributorsSection}\n${changelogSection}\n`

  const header = demoSection + packageNote

  return {
    footer,
    header,
  }
}
