#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const cmd = process.argv[2]
const arg = process.argv[3]

// ---------------- LOCK / UNLOCK FUNCTIONS ----------------

function lockFile(file) {
  if (!fs.existsSync(file)) {
    console.error('File not found:', file)
    process.exit(1)
  }

  const content = fs.readFileSync(file, 'utf8')

  if (content.includes('@readonly')) {
    console.log(`Already readonly: ${file}`)
    return
  }

  const updated = `/** @readonly */\n${content}`
  fs.writeFileSync(file, updated)
  console.log(`🔒 Locked (readonly): ${file}`)
}

function unlockFile(file) {
  if (!fs.existsSync(file)) {
    console.error('File not found:', file)
    process.exit(1)
  }

  const content = fs.readFileSync(file, 'utf8')

  if (content.includes('@unlock')) {
    console.log(`Already unlocked: ${file}`)
    return
  }

  const updated = content.replace('@readonly', '@unlock')
  fs.writeFileSync(file, updated)
  console.log(`🔓 Unlocked: ${file}`)
}

// ---------------- READONLY CHECK FOR COMMIT ----------------

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      stdio: 'pipe',
    }).toString()
    return output.split('\n').filter(Boolean)
  } catch (err) {
    console.error('Failed to get staged files:', err.message)
    process.exit(1)
  }
}

function isReadonlyViolation(file) {
  let oldContent = ''
  let existedBefore = true

  try {
    oldContent = execSync(`git show HEAD:"${file}"`, {
      stdio: 'pipe',
    }).toString()
  } catch {
    existedBefore = false // file is NEW → allowed
  }

  const newContent = fs.readFileSync(file, 'utf8')

  const oldReadonly = oldContent.includes('@readonly')
  const oldUnlock = oldContent.includes('@unlock')

  const newReadonly = newContent.includes('@readonly')
  const newUnlock = newContent.includes('@unlock')

  // If file was not readonly → free to edit
  if (!oldReadonly) return false

  // If unlock added → allow editing
  if (!oldUnlock && newUnlock) return false

  // ❌ If unlock was removed → block
  if (oldUnlock && !newUnlock) return true

  // If still readonly and still no unlock → block
  if (oldReadonly && !oldUnlock && !newUnlock) return true

  return false
}

function runReadonlyCheck() {
  const staged = getStagedFiles()
  const violations = staged.filter((file) => isReadonlyViolation(file))

  if (violations.length > 0) {
    console.error('❌ Cannot commit changes to readonly files:')
    violations.forEach((v) => console.error(' - ' + v))
    console.error('\nAdd @unlock to modify a readonly file.')
    process.exit(1)
  }

  console.log('✅ Readonly check passed')
  process.exit(0)
}

// ---------------- COMMAND ROUTER ----------------

if (cmd === 'lock') {
  lockFile(arg)
} else if (cmd === 'unlock') {
  unlockFile(arg)
} else {
  runReadonlyCheck()
}
