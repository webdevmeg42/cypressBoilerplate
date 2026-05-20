import './commands';
import './helpers/overrides';
import 'cypress-axe';
// @ts-ignore — @cypress/grep uses package.json exports that require node16/bundler moduleResolution
import '@cypress/grep';
