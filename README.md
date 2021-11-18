# setup-setops

<p align="left">
  <a href="https://github.com/setopsco/setup-setops/actions"><img alt="Build Test" src="https://github.com/setopsco/setup-setops/workflows/build-test/badge.svg" /></a>
  <a href="https://github.com/setopsco/setup-setops/actions"><img alt="Action Test" src="https://github.com/setopsco/setup-setops/workflows/action-test/badge.svg" /></a>
</p>

The `setopsco/setup-setops` action is a JavaScript action that sets up SetOps CLI in your GitHub Actions workflow by downloading a specific version of SetOps CLI and adding it to your `PATH`.

After you've used the action, subsequent steps in the same job can run arbitrary SetOps commands using [the GitHub Actions `run` syntax](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsrun). This allows most SetOps commands to work exactly like they do on your local command line.

This action partly reuses code from https://github.com/hashicorp/setup-terraform.

## Usage

This action can be run on `ubuntu-latest` GitHub Actions runners.

The default configuration installs the latest version of SetOps CLI and installs the wrapper script to wrap subsequent calls to the `setops` binary.

```yaml
steps:
- uses: setopsco/setup-setops@v1
```

A specific version of SetOps CLI can be installed.

```yaml
steps:
- uses: setopsco/setup-setops@v1
  with:
    setops_version: 0.1.4
```

Credentials for SetOps can be configured.

```yaml
steps:
- uses: setopsco/setup-setops@v1
  with:
    setops_organization: yourorganization
    setops_username: my-ci-user@setops.co
    setops_password: ${{ secrets.SETOPS_PASSWORD }}
```

## Inputs

The action supports the following inputs:

- `setops_version` - (optional) The version of SetOps CLI to install. Instead of a full version string,
   you can also specify a constraint string (see [Semver Ranges](https://www.npmjs.com/package/semver#ranges)
   for available range specifications). Examples are: `<0.1.5`, `~0.1.4`, `0.1.x` (all three installing
   the latest available 0.1.4 version). If no version is given, it will default to `latest`.

- `setops_organization` - (optional) The SetOps organization to login to. If not set, no login will be executed.

- `setops_username` - (optional) The SetOps username for a SetOps service to login in. If not set, no login will be executed.

- `setops_password` - (optional) The SetOps password for a SetOps service to login in. If not set, no login will be executed.

## Outputs

This action does not configure any outputs.

## License

[Mozilla Public License v2.0](https://github.com/setopsco/setup-setops/blob/master/LICENSE)
