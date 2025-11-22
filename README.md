# react-readonly-guard

**react-readonly-guard** is a small package that installs a Husky pre-commit hook to prevent commits to files marked with `/** @readonly */` unless the file also contains `/** @unlock */` or other allowed conditions (e.g. new file creation or intentional unlock removal).

## Features
- Blocks commits that modify existing files which are marked `@readonly` unless `@unlock` is present.
- Allows creating new files that contain `@readonly` (so you can add markers in a migration commit).
- Allows adding `@unlock` to make edits, and allows removing `@unlock` in the next commit.
- Auto-installs Husky if missing and injects the hook into `.husky/pre-commit`.
- Written in TypeScript, ships compiled CommonJS runtime in `lib/` for zero-config usage.

## Install (dev dependency)
```bash
# npm
npm install --save-dev react-readonly-guard
# pnpm
pnpm add -D react-readonly-guard
# yarn
yarn add -D react-readonly-guard
```

The package runs a `postinstall`-style installer (via the `bin` entry) that will ensure Husky is installed in your project and will inject a pre-commit hook that runs the readonly check.

## Behavior
The guard enforces these rules for **existing files** (files that exist in HEAD):
- If the file had `@readonly` in HEAD and the staged version still has `@readonly` but **no** `@unlock`, the commit is blocked.
- If the staged version contains `@unlock`, the commit is allowed.
- If the old version had `@unlock` and the staged does not, the commit is allowed (you can remove unlock after changes).
- New files (not present in HEAD) are allowed even if they contain `@readonly`.

## Usage
After install, the hook is injected automatically. Commit as usual:
```bash
git add <files>
git commit -m "Your message"
```

To bypass for a one-off commit (not recommended), use:
```bash
git commit -m "..." --no-verify
```

## Advanced
If you prefer to not auto-install Husky, you can run:
```bash
npx husky install
# then add the guard command into .husky/pre-commit:
node node_modules/react-readonly-guard/lib/check-readonly.cjs $(git diff --cached --name-only)
```

## License
MIT
