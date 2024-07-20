let existingIDs = [];

/**
 * @param length string
 * @returns string
 */
export function generateRandomID(length = 4, attempt = 0) {
  let id = Math.random()
    .toString(36)
    .substring(2, length + 2);

  if (existingIDs.includes(id)) {
    return generateRandomID(length + Math.floor(attempt / 3), attempt + 1);
  }

  existingIDs.push(id);
  return id;
}

/**
 * @param id string
 */
export function registerID(id) {
  if (!existingIDs.includes(id)) {
    existingIDs.push(id);
  }
}
