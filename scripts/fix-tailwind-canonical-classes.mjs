import { promises as fs } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const targets = process.argv.slice(2);
const defaultTargets = ['src', 'index.html'];
const fileExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.html', '.css', '.mdx']);
const ignoredDirectories = new Set(['.git', '.idea', '.vscode', 'dist', 'node_modules', 'tmp']);

const canonicalVarClassPattern =
  /([A-Za-z0-9:_/-]+)-\[(?:var\()?(--[A-Za-z0-9_-]+)\)?\]/g;

async function collectFiles(targetPath, files = []) {
  const absolutePath = path.resolve(projectRoot, targetPath);

  let stats;
  try {
    stats = await fs.stat(absolutePath);
  } catch {
    return files;
  }

  if (stats.isDirectory()) {
    const entries = await fs.readdir(absolutePath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
        continue;
      }

      await collectFiles(path.join(absolutePath, entry.name), files);
    }
    return files;
  }

  if (fileExtensions.has(path.extname(absolutePath))) {
    files.push(absolutePath);
  }

  return files;
}

async function main() {
  const files = [];
  for (const target of targets.length > 0 ? targets : defaultTargets) {
    await collectFiles(target, files);
  }

  let changedFiles = 0;
  let replacementCount = 0;

  for (const file of files) {
    const source = await fs.readFile(file, 'utf8');
    const matches = Array.from(source.matchAll(canonicalVarClassPattern));
    if (matches.length === 0) {
      continue;
    }

    const updated = source.replace(
      canonicalVarClassPattern,
      (_, utility, variableName) => `${utility}-(${variableName})`,
    );

    if (updated === source) {
      continue;
    }

    await fs.writeFile(file, updated, 'utf8');
    changedFiles += 1;
    replacementCount += matches.length;
  }

  if (changedFiles === 0) {
    console.log('No Tailwind canonical class rewrites were needed.');
    return;
  }

  console.log(
    `Rewrote ${replacementCount} Tailwind class${replacementCount === 1 ? '' : 'es'} in ${changedFiles} file${changedFiles === 1 ? '' : 's'}.`,
  );
}

await main();
