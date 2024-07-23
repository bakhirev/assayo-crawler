function getSaveLogCommand(fileName, withFileInfo = false) {
  const raw = withFileInfo ? '--raw --numstat' : '';
  return `git --no-pager log ${raw} --oneline --all --reverse --date=iso-strict --pretty=format:"%ad>%aN>%aE>%s" > ../${fileName}.txt`
}

const bashCommands = {
  getLog: (file) => getSaveLogCommand(file, true),
  getLogWithoutFile: (file) => getSaveLogCommand(file),
  getRepository: (url) => `git clone ${url}`,
  openFolder: (folder) => `cd ${folder}`,
  removeFolder: (folder) => `rm -rf ${folder}`,
  removeFile: (file) => `rm ${file}`,
  joinFiles: (files, file) => `awk 1 ${files.join(' ')} > ${file}`,
  fetchAllBranch: 'git fetch',
  checkoutBranch: (branch) => `git checkout ${branch}`,
  updateBranch: 'git pull',
  oneLine: ' && ',
};

function getCommand(callback) {
  const commands = typeof callback === 'function'
    ? callback(bashCommands)
    : callback;

  return Array.isArray(commands)
    ? commands.filter(v => v).join(bashCommands.oneLine)
    : commands;
}

module.exports = {
  ...bashCommands,
  getCommand,
};

