const inquirer = require('inquirer');
const { spawnSync } = require('child_process');
const fuzzy = require('fuzzy');

const isTest = process.env.NODE_ENV === 'test';

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const logger = message => !isTest && process.stdout.write(`${message}\n`);

const shellCommand = (command, params) => {
  const { status, stdout, stderr } = spawnSync(command, params);

  logger([command, ...params].join(' '));

  if (status !== 0) {
    logger(`Error: ${stderr.toString()}`);
    process.exit(status);
  }

  return stdout.toString();
};

const getBranches = (executeCmd = shellCommand, input) => {
  return new Promise((resolve) => {
    const branches = executeCmd('git', ['branch']);

    if (branches === '') {
      logger('Error: This repository has no branches');
      process.exit(1);
    }

    let branchList = branches
      .replace('*', '')
      .split('\n')
      .filter(e => e !== '')
      .map(e => e.trim());

    if (input) {
      branchList = fuzzy
        .filter(input, branchList)
        .map(e => e.string);
    }

    resolve(branchList);
  });
};

const doCheckout = branch => logger(shellCommand('git', ['checkout', branch]));

if (!isTest) {
  inquirer
    .prompt([
      {
        type: 'autocomplete',
        name: 'branch',
        message: 'Please choose a branch to checkout:',
        source: (answersSoFar, input) => getBranches(shellCommand, input),
      },
    ])
    .then(answers => doCheckout(answers.branch))
    .catch(err => logger(err));
}

module.exports = { getBranches };
