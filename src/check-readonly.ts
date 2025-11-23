import fs from 'fs'
import { execSync } from 'child_process'

export function checkReadonly(stagedFiles: string[]) {
  const readonlyFiles = stagedFiles.filter((file) => {
    let oldContent = ''
    let existedBefore = true

    try {
      oldContent = execSync(`git show HEAD:"${file}"`).toString()
    } catch {
      existedBefore = false // new file → allowed
    }

    const newContent = fs.readFileSync(file, 'utf8')

    const oldReadonly = oldContent.includes('@readonly')
    const oldUnlock = oldContent.includes('@unlock')

    const newReadonly = newContent.includes('@readonly')
    const newUnlock = newContent.includes('@unlock')

    if (!oldReadonly) return false

    if (!oldUnlock && newUnlock) return false

    if (oldUnlock && !newUnlock) return true

    if (oldReadonly && !oldUnlock && !newUnlock) return true

    return false
  })

  if (readonlyFiles.length) {
    console.error('❌ Cannot commit changes to readonly files:')
    console.error(readonlyFiles.join('\n'))
    process.exit(1)
  }
}
