// #!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

function findGitRoot(startDir) {
  let dir = startDir
  while (dir !== '/') {
    if (fs.existsSync(path.join(dir, '.git'))) return dir
    dir = path.dirname(dir)
  }
  return null
}

const cwd = process.cwd()
const gitRoot = findGitRoot(cwd)

if (!gitRoot) {
  console.log('react-readonly-guard: No git repo. Skipping.')
  process.exit(0)
}

const huskyDir = path.join(gitRoot, '.husky')
if (!fs.existsSync(huskyDir)) {
  execSync('npx husky-init', { cwd: gitRoot, stdio: 'inherit' })
}

const hookPath = path.join(huskyDir, 'pre-commit')
const guardCmd = `npx react-readonly-guard "$@"`

if (!fs.existsSync(hookPath)) {
  fs.writeFileSync(hookPath, '#!/bin/sh\n. "$(dirname "$0")/_/husky.sh"\n')
}

const content = fs.readFileSync(hookPath, 'utf8')
if (!content.includes('react-readonly-guard')) {
  fs.appendFileSync(hookPath, `\n${guardCmd}\n`)
}

fs.chmodSync(hookPath, 0o755)
console.log('react-readonly-guard installed ✓')
