import normalizeCss from 'normalize.css'; /* eslint no-unused-vars: 0 */
import animateCss from 'animate.css'; /* eslint no-unused-vars: 0 */
import FastClick from 'fastclick';

import commonCss from './common.scss'; /* eslint no-unused-vars: 0 */
import indexCss from './index.scss'; /* eslint no-unused-vars: 0 */
import utils from './utils';

const init = function initApp() {
  if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', () => {
      FastClick.attach(document.body);
    }, false);
  }

  utils.report('workflow', 'initIndex');
};

init();
