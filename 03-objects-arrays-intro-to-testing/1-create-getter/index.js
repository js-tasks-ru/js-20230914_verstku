/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return (obj) => {
    const pathToArr = path.split('.');
    let result = obj;

    for (const item of pathToArr) {
      if (result === undefined) break;
      result = result[item]
    }

    return result;
  };
}
