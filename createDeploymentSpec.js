/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const process = require('process');
const childProcess = require('child_process');

// Pull package.json file
const pkgJson = path.resolve(__dirname, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgJson, 'utf8'));

// Pull version and name from package.json
const { version, name } = pkg;

// Check package against remote
try {
  const execResult = childProcess.execSync(`npm view ${name} version`);
  const currentVersion = execResult.toString('utf-8').trim();

  if (currentVersion === version) {
    console.log(`Package ${name}@${version} already exists.\n`);
  } else {
    const filename = `${name}-${version}.tgz`;
    const deploymentSpec = {
      files: [
        {
          pattern: `*/${filename}`,
          target: `npm-local/@fortellis/${filename}`
        }
      ]
    };

    fs.writeFileSync(
      'artifactory-deployment-spec.json',
      JSON.stringify(deploymentSpec, null, 2)
    );

    console.log(`Created deployment spec for ${name}@${version}`);
  }
} catch (err) {
  if (err.toString().includes('404')) {
    console.log(
      `Package ${name} does not currently exist, ${version} will be the first version deployed.\n`
    );
  } else {
    console.log(err);
    process.exit(1);
  }
}
