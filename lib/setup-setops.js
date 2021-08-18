// Node.js core
const os = require('os');
const fs = require('fs').promises;
const path = require('path');

// External
const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const decompress = require('decompress');
const decompressBzip2 = require('decompress-bzip2');

// SetOps
const releases = require('./releases')
const cli = require('./setops-cli')

const supportedOSPlatforms = ["darwin", "linux"]
const supportedArches = ["amd64"]

// arch in [arm, x32, x64...] (https://nodejs.org/api/os.html#os_os_arch)
// return value in [amd64, 386, arm]
function mapArch(arch) {
  const mappings = {
    x32: '386',
    x64: 'amd64'
  };
  return mappings[arch] || arch;
}

async function downloadCLI(url) {
  core.debug(`Downloading SetOps CLI from ${url}`);
  const pathToDownload = await tc.downloadTool(url);

  const pathToCLI = await fs.mkdtemp(path.join(os.tmpdir(), 'setops-'));

  core.debug(`Extracting SetOps CLI bz2 file to ${pathToCLI}`);
  await decompress(pathToDownload, pathToCLI, {
    plugins: [
      decompressBzip2({ path: 'setops' })
    ]
  });

  await fs.chmod(path.join(pathToCLI, "setops"), 0o755)

  return pathToCLI;
}

async function run() {
  try {
    // Gather OS details
    const osPlatform = os.platform();
    const osArch = mapArch(os.arch());

    if (!supportedOSPlatforms.includes(osPlatform)) {
      throw new Error(`OS platform ${osPlatform} not supported`);
    }
    if (!supportedArches.includes(osArch)) {
      throw new Error(`OS architecture ${osArch} not supported`);
    }

    // Gather GitHub Actions inputs
    const version = core.getInput('setops_version');
    const loginClient = core.getInput('setops_client');
    const loginUsername = core.getInput('setops_username');
    const loginPassword = core.getInput('setops_password');

    if ((loginUsername || loginPassword || loginClient) && !(loginUsername && loginPassword && loginClient)) {
      throw new Error(
        `When providing setops_username, setops_password or setops_client, all of them must be set`
      );
    }

    core.debug(`Getting download url for SetOps version ${version}: ${osPlatform} ${osArch}`);
    const url = await releases.getDownloadUrl(version, osPlatform, osArch);
    if (!url) {
      throw new Error(`SetOps version ${version} not available for ${osPlatform} and ${osArch}`);
    }

    // Download requested version
    const pathToCLI = await downloadCLI(url);

    // Add to path
    core.addPath(pathToCLI);

    // Add credentials to file if they are provided
    if (loginUsername && loginPassword && loginClient) {
      await cli.login(loginClient, loginUsername, loginPassword)
    }
  } catch (error) {
    core.error(error);
    throw error;
  }
}

module.exports = run;
