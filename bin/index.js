#! /usr/bin/env node
import handleChecKName from '../libs/command/index.js';
import {packageJsonData} from '../libs/constant.js';
import {program} from 'commander';
program.command('create <projectName>').action(projectName => {
    console.log(`项目名${projectName}`);
    handleChecKName(projectName);
});
// 读取版本
program.version(packageJsonData.version, '-v, --version');
program.parse(process.args);
