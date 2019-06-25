export function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
export function snooze(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
