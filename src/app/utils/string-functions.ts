/**
 * Ellipse text after a certain amount of characters
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export const ellipseText = (str: string, maxLength: number = 100) => {
  return str.substr(0, maxLength - 1) + (str.length > maxLength ? '&hellip;' : '');
};

/**
 * Capitalize a string
 * @param string
 * @returns {string}
 */
export const capitalize = (string) => {
  const chunks = string.split(' ');
  const letters = [];

  for ( let i = 0; i < chunks.length; i++ ) {
    letters.push(chunks[ i ].charAt(0).toUpperCase() + chunks[ i ].slice(1));
  }

  return letters.join(' ');
};


export const getFileType = (str: string ) => {
  const type =  str.split(';')[0].split('/')[1] || str.split('.').pop();
  return type;
};
