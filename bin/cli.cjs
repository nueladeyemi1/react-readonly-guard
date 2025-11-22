// #!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const cmd = process.argv[2]
const arg = process.argv[3]

function unlockFile(file) {
  const content = fs.readFileSync(file, 'utf8')
  const updated = content.replace('@readonly', '@unlock')
  fs.writeFileSync(file, updated)
  console.log(`Unlocked ${file}`)
}

function lockFile(file) {
  const content = fs.readFileSync(file, 'utf8')
  fs.writeFileSync(file, `/** @readonly */\n${content}`)
  console.log(`Readonly applied to ${file}`)
}

switch (cmd) {
  case 'unlock':
    unlockFile(arg)
    break
  case 'lock':
    lockFile(arg)
    break
  default:
    console.log('react-readonly-guard CLI')
}
