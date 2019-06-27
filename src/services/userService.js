/**
 * @description method for getting bit in given variable
 * @param {number} number variable
 * @param {number} bitPosition bit position
 */
const getBit = function(number, bitPosition) {
  return (number & (1 << bitPosition)) === 0 ? false : true;
};

/**
 * @description method for setting bit in given variable
 * @param {number} number variable
 * @param {number} bitPosition bit position
 */
const setBit = function(number, bitPosition) {
  return number | (1 << bitPosition);
};

const canVisualizeData = function(user) {
  if (!user) return null;
  let permissions = user.permissions;
  if (permissions === undefined || permissions === null) return false;
  return getBit(permissions, 0);
};

const canOperateData = function(user) {
  if (!user) return null;
  let permissions = user.permissions;
  if (permissions === undefined || permissions === null) return false;
  return getBit(permissions, 1);
};

const isDataAdmin = function(user) {
  if (!user) return null;
  let permissions = user.permissions;
  if (permissions === undefined || permissions === null) return false;
  return getBit(permissions, 2);
};

const isSuperAdmin = function(user) {
  if (!user) return null;
  let permissions = user.permissions;
  if (permissions === undefined || permissions === null) return false;
  return getBit(permissions, 3);
};

const getPermissionsArray = function(user) {
  if (!user) return [false, false, false, false];
  // bit 0 - vizualize data
  // bit 1 - operate data
  // bit 2 - data admin
  // bit 3 - super admin

  let permissions = user.permissions;

  let arrayToReturn = [];

  for (let i = 0; i < 3; i++) {
    arrayToReturn[i] = this.getBit(permissions, i);
  }

  return arrayToReturn;
};

export default {
  canVisualizeData,
  canOperateData,
  isDataAdmin,
  isSuperAdmin,
  getPermissionsArray
};
