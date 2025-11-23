# react-readonly-guard

**react-readonly-guard** is a lightweight Git-aware tool that prevents accidental edits to critical files in your codebase. By adding simple markers like `/** @readonly */` and `/** @unlock */`, developers get intentional, safe editing workflows — all enforced automatically through Git hooks.

This helps teams avoid breaking core components, shared UI libraries, configs, theme files, or system logic that must not be changed without careful intention.

Protect important files with comments. Enforce commit-time readonly rules automatically.

## Features

- Blocks commits that modify existing files which are marked `@readonly` unless `@unlock` is present.
- Allows creating new files that contain `@readonly` (so you can add markers in a migration commit).
- Allows adding `@unlock` to make edits, and allows removing `@unlock` in the next commit.
- Auto-installs Husky if missing and injects the hook into `.husky/pre-commit`.
- Written in TypeScript, ships compiled CommonJS runtime in `lib/` for zero-config usage.

🔒 Readonly mode — prevent accidental edits

🔓 Unlock mode — allow intentional editing

🆕 Supports new files — readonly on new files still commits

🎯 Works everywhere — CLI, VSCode Source Control, JetBrains, GitKraken

⚙️ Automatic setup — Husky pre-commit hook installs automatically

📦 Zero configuration — works out of the box

🧩 TypeScript code, Node-compatible CLI

🛡 Safeguards your codebase with minimal developer friction

## Install

```bash
# npm
npm install --save-dev react-readonly-guard
# pnpm
pnpm add -D react-readonly-guard
# yarn
yarn add -D react-readonly-guard
```

The package runs a `postinstall`-style installer that will ensure Husky is installed (if Husky isn’t installed) in your project and will inject a pre-commit hook that runs the readonly check.
PS: No manual setup required.

## Behavior

The guard enforces these rules for **existing files** (files that exist in HEAD):

- If the file had `@readonly` in HEAD and the staged version still has `@readonly` but **no** `@unlock`, the commit is blocked.
- If the staged version contains `@unlock`, the commit is allowed.
- If the old version had `@unlock` and the staged does not, the commit is allowed (you can remove unlock after changes).
- New files (not present in HEAD) are allowed even if they contain `@readonly`.

## Usage

After install, the hook is injected automatically. Then include any of the below in your component

LOCKING:

```bash
/**
*@readonly
*/
```

or
`/** @readonly */`

You can automatically add it using CLI with:

`npx react-readonly-guard lock path/example-file.tsx`

UNLOCKING:

```bash
/**
*@unlock
*/
```

or
`/** @unlock */`

You can automatically add it using CLI with:

`npx react-readonly-guard unlock path/example-file.tsx`

Commit as usual:

```bash
git add <files>
git commit -m "Your message"
```

Result:
If you edit a readonly file without unlocking, the commit will fail:

```bash
❌ Cannot commit changes to readonly files (add @unlock to modify):
- src/components/Button.tsx
```

To bypass for a one-off commit (not recommended), use:

```bash
git commit -m "..." --no-verify
```

## License

MIT
