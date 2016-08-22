const report = function report(eventCategory, eventAction, eventLabel, eventValue, fieldsObject) {
  if (window.ga) {
    window.ga('send', 'event', eventCategory, eventAction, eventLabel, eventValue, fieldsObject);
  }
};

const utils = {
  report,
};

export default utils;
