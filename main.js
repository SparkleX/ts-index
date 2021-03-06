#!/usr/bin/env node

const glob = require("glob");
const yargs = require('yargs');
const fs = require('fs');
const path = require('path');

const argv = yargs.default('src', "src/**/").argv;

function createIndexFile (folder) {
    console.info(`index: ${folder}`);
    const indexFile = `${folder}index.ts`;
    if (fs.existsSync(indexFile)) {
        fs.unlinkSync(indexFile);
    }
    const tsFiles = glob.sync(`${folder}*.ts`);
    if(tsFiles.length ==0 ) {
        return;
    }
    let code = "";
    for (const tsFile of tsFiles) {
        const baseName = path.basename(tsFile, ".ts");
        code += `export * from "./${baseName}";\n`;
    }
    fs.writeFileSync(indexFile, code);
}

const files = glob.sync(argv.src);
for(const folder of files) {
    const rcFile = folder + ".index.json";
    if (fs.existsSync(rcFile) == false) {
        continue;
    }
    createIndexFile(folder);
}