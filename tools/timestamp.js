import fs from 'fs';
import path from 'path';

import log from '../common/log/pino.js';

let base = Date.now();

function rename(filepath) {
    const dir = path.dirname(filepath);
    const file = path.basename(filepath);

    const underscoreIndex = file.indexOf('_');
    let filename;
    // eslint-disable-next-line no-magic-numbers
    if (underscoreIndex === -1) {
        // prepend prefix
        filename = file;
    } else {
        // replace prefix
        filename = file.slice(underscoreIndex + 1);
    }

    const timestamp = (base++).toString();
    const newFilename = `${timestamp}_${filename}`;
    const newFilepath = path.join(dir, newFilename);

    if (filepath === newFilepath) {
        return;
    }

    fs.renameSync(filepath, newFilepath);
    log.info(`${file} → ${newFilename}`);
}

function timestampTarget(target) {
    const targetPath = path.resolve(target);
    if (!fs.existsSync(targetPath)) {
        log.error(`target does not exist: ${target}`);
        return;
    }

    const stats = fs.statSync(targetPath);
    if (stats.isDirectory()) {
        const files = fs.readdirSync(targetPath)
            .filter(f => f.endsWith('.js'))
            .sort();

        for (const file of files) {
            rename(path.join(targetPath, file));
        }
    } else if (stats.isFile()) {
        rename(targetPath);
    } else {
        log.error(`target is neither a file nor a directory: ${target}`);
    }
}

// eslint-disable-next-line no-magic-numbers
const targets = process.argv.slice(2);
if (targets.length === 0) {
    log.error('Usage: node timestamp.js {file|dir} [file|dir] ...');
    process.exit(1);
}

for (const target of targets) {
    timestampTarget(target);
}