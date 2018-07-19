const inquirer = require('inquirer');
const { spawnSync } = require('child_process');

const isTest = process.env.NODE_ENV === 'test';

const logger = message => !isTest && process.stdout.write(`${message}\n`);

const shellCommand = (command, params) => {
  const { status, stdout, stderr } = spawnSync(command, params);

  if (status !== 0) {
    logger(`Error: ${stderr.toString()}`);
    process.exit(status);
  }

  return stdout.toString();
};

const getBranches = (executeCmd = shellCommand) => {
  const branches = executeCmd('git', ['branch']);

  if (branches === '') {
    logger('Error: This repository has no branches');
    process.exit(1);
  }

  return branches
    .replace('*', '')
    .split('\n')
    .filter(e => e !== '')
    .map(e => e.trim());
};

const doCheckout = branch => logger(shellCommand('git', ['checkout', branch]));

if (!isTest) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'branch',
        message: 'Please choose a branch to checkout:',
        choices: getBranches(shellCommand),
        pageSize: 10,
      },
    ])
    .then(answers => doCheckout(answers.branch));
}

module.exports = { getBranches };
