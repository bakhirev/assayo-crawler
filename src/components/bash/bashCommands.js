const bashCommands = {
  getLog: 'git --no-pager log --numstat --oneline --all --reverse --date=iso-strict --pretty=format:"%ad>%cN>%cE>%s" > log.txt',
  getLogWithoutFile: 'git --no-pager log --oneline --all --reverse --date=iso-strict --pretty=format:"%ad>%cN>%cE>%s" > log.txt',
  getRepository: (url) => `git clone ${url}`,
  openFolder: (folder) => `cd ${folder}`,
  removeFolder: (folder) => `rm -rf ${folder}`,
  removeFile: (file) => `rm ${file}`,
  joinFiles: (files, file) => `cat ${files.join(' ')} > ${file}`,
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

