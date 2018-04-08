/**
 * camelCase
 * Takes an input like "Red Truck Beer" and returns "RED-TRUCK-BEER".
 * @param {string} organization The name of the organization.
 */
function screamingKebabCase(organization = '') {
  return organization
    .toUpperCase()
    .trim()
    .replace(/\s/g, '-');
}

/**
 * screamingSnakeCase
 * Takes an input like "Red Truck Beer" and returns "RED_TRUCK_BEER".
 * @param {string} organization The name of the organization.
 */
function screamingSnakeCase(organization = '') {
  return organization
    .toUpperCase()
    .trim()
    .replace(/\s/g, '_');
}

module.exports = {
  screamingKebabCase,
  screamingSnakeCase,
};
