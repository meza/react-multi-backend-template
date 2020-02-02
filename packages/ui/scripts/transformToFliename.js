// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  process: (content, filePath) => {
    const relativePath = path.parse(filePath);
    return `module.exports = "${relativePath.base}"`;
  }
};
