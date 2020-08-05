export interface TriggerDictionary {
  [key: string]: string;
}

export const triggerDictionary: TriggerDictionary = {
  'gtm.js': 'Pageview',
  'gtm.dom': 'DOM Ready',
  'gtm.load': 'Window Loaded',
  'gtm.linkClick': 'Link Clicks',
  'gtm.click': 'All Clicks',
  'gtm.formSubmit': 'Form Submit',
  'gtm.historyChange': 'History Change',
  'gtm.elementVisibility': 'Element Visibility',
  'gtm.video': 'Youtube Video',
  'gtm.scrollDepth': 'Scroll Depth',
  'gtm.timer': 'Timer',
  'gtm.pageError': 'JS Error',
  'gtm.triggerGroup': 'Trigger Group',
};
