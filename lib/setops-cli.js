const { spawn } = require('child_process');
const process = require('process');

function login(organization, username, password, apiUrl) {
  return new Promise(function (resolve, reject) {
    console.log(`Execute setops login for user ${username} in organization ${organization}`);

    const cmd = 'setops';
    const args = ["login", "--url", apiUrl];
    const options = {
      encoding: 'utf-8',
      stdio: ['pipe', process.stdout, process.stderr]
    };
    const childProcess = spawn(cmd, args, options);
    childProcess.stdin.write(`${organization}\n${username}\n${password}\n`);

    childProcess.on('exit', function (code) {
      if (code !== 0) {
        reject(`Process exited with code ${code}`)
      } else {
        resolve();
      }
    });
    childProcess.on('error', function (err) {
      reject(err);
    });
  });
}

module.exports = { login };
