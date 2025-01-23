import fs from 'fs/promises';
import path from 'node:path';
import chalk from 'chalk';
import log from './log';

const raw = String.raw;
const addContent = raw`
import { cnx } from './cnx';
import { cvx } from './cvx';
import { ocx } from './ocx';
import { cn, merge } from './merge';
import { px, rem, em, createConverter } from './converters';

import type { cnxValues } from './cnx';
import type { cvxRecord, cvxResult, cvxProps, cvxKeys } from './cvx';
import type { ocxAcc, ocxMap, ocxObj } from './ocx';
import type { inferType } from './types';

import * as tw from 'tailwind-merge';

const twMerge = tw.twMerge;
const twJoin = tw.twJoin;

export { cnx, cvx, ocx, cn, merge, px, rem, em, createConverter, twMerge, twJoin, tw };

export type { cvxRecord, cvxResult, cvxProps, cvxKeys, cnxValues, ocxAcc, ocxMap, ocxObj, inferType };

export { cretex as default, cretex as x };`;

async function rewriteNamespace() {
  try {
    const baseFolder = 'src';
    const indexFile = path.join(baseFolder, 'index.ts');

    const outputDir = path.dirname(indexFile);
    await fs.mkdir(outputDir, { recursive: true });

    const content = await fs.readFile(indexFile, 'utf8');

    const namespaceRegex = /namespace cretex\s*{([\s\S]*?)}\n*export { cretex as default, cretex as x };/g;
    const matches = content.match(namespaceRegex);

    const files = (await fs.readdir(baseFolder)).filter(file => file !== 'index.ts' && file.endsWith('.ts'));

    const namespaces: string[] = [];

    for (const file of files) {
      const filePath = path.join(baseFolder, file);
      const fileContent = await fs.readFile(filePath, 'utf8');

      const contentWithoutImports = fileContent.replace(/import[\s\S]*?from\s+['"][^'"]+['"];/g, '');

      log.build('write', chalk.greenBright('FILE'), chalk.bold(filePath));

      if (contentWithoutImports.trim()) {
        namespaces.push(`// File: ${file}\n${contentWithoutImports.trim().replace(/\n{1,}/g, '\n')}`);
      } else {
        log.warn(`File kosong atau hanya berisi import: ${file}`);
      }
    }

    let updatedContent = matches ? content.replace(namespaceRegex, '') : content;

    updatedContent += `\n\nnamespace cretex {\n${namespaces.join('\n')}\n}\n\nexport { cretex as default, cretex as x };`;

    await fs.writeFile(indexFile, updatedContent.trim().replace(/\n{2,}/g, '\n\n'), 'utf8');

    log.build('namespace', chalk.yellow.bold('📝 berhasil diperbarui!'));
    log.success('RUN FORMAT');
  } catch (error) {
    log.error('Terjadi kesalahan saat memperbarui namespace. Error:', error);
  }
}

rewriteNamespace();
