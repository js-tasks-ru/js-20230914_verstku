/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0) return '';
  if (!size) return string;

  const stringToArr = [...string];

  const resultArr = stringToArr.reduce((result, item, index) => {
    if (index === 0 || item !== stringToArr[index - 1]) {
      result.push(item);
    }

    if (result.at(-1).length < size && item === stringToArr[index - 1]) {
      result[result.length - 1] += item;
    }

    return result;

  }, []);

  return resultArr.join('');
}
