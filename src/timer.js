import moment from 'moment';

let taskDurations = {
  standard: 1500,
  resting: 300,
};

if (window.location.hostname === 'localhost') {
  taskDurations = {
    standard: 5,
    resting: 3,
  };
}

const getRemaning = function getRemaning(startTime, type) {
  const duration = moment.duration(taskDurations[type], 'seconds');
  const elapsed = moment().diff(startTime, 'seconds');
  const remaning = duration.subtract(elapsed, 'seconds');

  return remaning;
};

const getContdown = function getContdown(startTime, type, level) {
  const remaning = getRemaning(startTime, type);

  let minutes = remaning.minutes() > 0 ? remaning.minutes() : 0;
  let seconds = remaning.seconds() > 0 ? remaning.seconds() : 0;
  let result = '';

  if (level === 'minute') {
    result = `${minutes}m`;
  } else {
    minutes = minutes > 9 ? `${minutes}` : `0${minutes}`;
    seconds = seconds > 9 ? `${seconds}` : `0${seconds}`;
    result = `${minutes}:${seconds}`;
  }

  return result;
};

export default { getRemaning, getContdown };
