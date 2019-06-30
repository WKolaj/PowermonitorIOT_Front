export function isEmpty(obj) {
  if (obj === "" || obj === {} || obj === []) return false;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

export function snooze(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function tickNumberToMs(tickNumber) {
  return tickNumber * 1000;
}

export function msToTickNumber(ms) {
  return Math.round(ms / 1000);
}

export function tickNumberToDate(tickNumber) {
  return new Date(tickNumber * 1000);
}

export function dateToTickNumber(date) {
  return Math.round(date.getTime() / 1000);
}

export function msToDate(tickNumber) {
  return new Date(tickNumber);
}

export function dateToMs(date) {
  return date.getTime();
}

export function exists(object) {
  return object !== null && object !== undefined;
}

export function now() {
  return new Date(Date.now());
}

export function arrayToObject(array, keyField) {
  let objectToReturn = {};

  for (let item of array) {
    //If key does not exist - convert using item as key and setting item as an id
    if (exists(keyField)) objectToReturn[item[keyField]] = item;
    else objectToReturn[item] = { id: item };
  }

  return objectToReturn;
}
