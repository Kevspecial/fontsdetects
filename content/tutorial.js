import Shepherd from 'shepherd.js';

const tutorial = new Shepherd.Tour({
  defaultStepOptions: {
    classes: 'shepherd-theme-custom',
    scrollTo: true
  }
});

tutorial.addSteps([
  {
    title: 'Welcome to Font Identifier!',
    text: 'Let me show you around...',
    attachTo: {
      element: '.extension-icon',
      on: 'bottom'
    }
  },
  {
    title: 'Hover Detection',
    text: 'Hover over any text to see font details',
    attachTo: {
      element: 'body',
      on: 'top'
    }
  }
]);

// Start tutorial on first install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    tutorial.start();
  }
});