// This script expects to be run via `yarn build:deno`.
//
// Although this script generates code for use in Deno, this script itself is
// written for Node so that contributors do not need to install Deno to build.
//
// @ts-check

import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync, copyFileSync } from 'fs';
import { dirname } from 'path';

// Node's path.join() normalize explicitly-relative paths like "./index.ts" to
// paths like "index.ts" which don't work as relative ES imports, so we do this.
const join = (/** @type string[] */ ...parts) => parts.join('/').replace(/\/\//g, '/');

const projectRoot = process.cwd();
const nodeSrcRoot = join(projectRoot, 'src');
const denoLibRoot = join(projectRoot, 'deno', 'lib');

// Baca versi dari package.json
const packageJsonPath = join(projectRoot, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const packageVersion = packageJson.version || '0.0.1';

const skipList = [
  join(projectRoot, '__tests__', 'object-in-es5-env.test.ts'),
  join(projectRoot, '__tests__', 'language-server.test.ts'),
  join(projectRoot, '__tests__', 'language-server.source.ts')
];

const walkAndBuild = (/** @type string */ dir) => {
  for (const entry of readdirSync(join(nodeSrcRoot, dir), {
    withFileTypes: true,
    encoding: 'utf-8'
  })) {
    if (entry.isDirectory()) {
      walkAndBuild(join(dir, entry.name));
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      const nodePath = join(nodeSrcRoot, dir, entry.name);
      const denoPath = join(denoLibRoot, dir, entry.name);

      if (skipList.includes(nodePath)) {
        // console.log(`Skipping ${nodePath}`);
        continue;
      }

      const nodeSource = readFileSync(nodePath, { encoding: 'utf-8' });

      const denoSource = nodeSource.replace(/^(?:import|export)[\s\S]*?from\s*['"]([^'"]*)['"];$/gm, (line, target) => {
        if (target === '@jest/globals') {
          return `import { expect } from "https://deno.land/x/expect@v0.2.6/mod.ts";\nconst test = Deno.test;`;
        }

        const targetNodePath = join(dirname(nodePath), target);
        const targetNodePathIfFile = targetNodePath + '.ts';
        const targetNodePathIfDir = join(targetNodePath, 'index.ts');

        try {
          if (statSync(targetNodePathIfFile)?.isFile()) {
            return line.replace(target, target + '.ts');
          }
        } catch (error) {
          if (error?.code !== 'ENOENT') {
            throw error;
          }
        }

        try {
          if (statSync(targetNodePathIfDir)?.isFile()) {
            return line.replace(target, join(target, 'index.ts'));
          }
        } catch (error) {
          if (error?.code !== 'ENOENT') {
            throw error;
          }
        }

        // console.warn(`Skipping non-resolvable import:\n  ${line}`);
        return line;
      });

      mkdirSync(dirname(denoPath), { recursive: true });
      writeFileSync(denoPath, denoSource, { encoding: 'utf-8' });
    }
  }
};

// Proses konversi kode ke Deno
walkAndBuild('');

writeFileSync(join(denoLibRoot, 'mod.ts'), `export * from "./index.ts";\nexport { x as default } from "./index.ts";\n`, {
  encoding: 'utf-8'
});

// **Write deno.json file**
const denoJsonContent = JSON.stringify({
  name: "@cretex/dynamic",
  version: packageVersion,
  license: "MIT",
  exports: "./mod.ts"
}, null, 2); // Indentasi 2 spasi untuk format yang rapi

writeFileSync(join(denoLibRoot, 'deno.json'), denoJsonContent, { encoding: 'utf-8' });

// **cp LICENSE to ./deno/lib**
const licensePath = join(projectRoot, 'LICENSE');
const licenseDest = join(denoLibRoot, 'LICENSE');

try {
  copyFileSync(licensePath, licenseDest);
  console.log("LICENSE file copied successfully.");
} catch (error) {
  console.warn("LICENSE file not found. Skipping copy.");
}

console.log('File index.ts, deno.json, dan LICENSE berhasil diperbarui!');
