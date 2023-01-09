import { Plugin } from 'release-it';
import { execSync } from 'child_process';

class VantCliReleasePlugin extends Plugin {
  async beforeRelease() {
    // log an empty line
    console.log('');

    execSync('vue-plus-cli build', { stdio: 'inherit' });
    execSync('vue-plus-cli changelog', { stdio: 'inherit' });
  }
}

export default VantCliReleasePlugin;
