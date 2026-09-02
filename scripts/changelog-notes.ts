const EUsage = 'usage: bun scripts/changelog-notes.ts <version>'

const version = Bun.argv[2]
if (!version) {
  console.error(EUsage)
  process.exit(1)
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const text = await Bun.file('CHANGELOG.md').text()
const header = new RegExp(`^## \\[${escapeRegExp(version)}\\][^\\n]*\\n`, 'm')
const start = text.search(header)
if (start < 0) {
  console.error(`CHANGELOG.md has no ## [${version}] section`)
  process.exit(1)
}

const after = text.slice(start)
const title = after.match(/^## [^\n]+\n/)
const bodyStart = title ? title[0].length : 0
const rest = after.slice(bodyStart)
const nextHeading = rest.search(/\n## /)
const nextLinkRef = rest.search(/\n\[/)
const cuts = [nextHeading, nextLinkRef].filter((index) => index >= 0)
const next = cuts.length === 0 ? -1 : Math.min(...cuts)
const body = (next < 0 ? rest : rest.slice(0, next)).trim()
if (!body) {
  console.error(`CHANGELOG.md section [${version}] is empty`)
  process.exit(1)
}

process.stdout.write(`${body}\n`)
