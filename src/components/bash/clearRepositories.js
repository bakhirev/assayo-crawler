const asyncExec = require('./asyncExec');
const { getCommand } = require('./getBashCommand');

async function clearRepositories(repositories) {
  const command = getCommand(({
    removeFolder,
  }) => (
    repositories.map((item) => removeFolder(`./repositories/${item.folder}`))
  ));
  const { stdout, stderr } = await asyncExec(command);
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}

module.exports = clearRepositories;
