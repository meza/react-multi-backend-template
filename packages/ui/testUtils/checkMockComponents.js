const path = require('path');
const glob = require('glob');
const fs = require('fs');

const missingMocks = [];

const checkFor = (baseDir) => {
  const files = glob.sync('**/*.tsx', {
    cwd: baseDir,
    ignore: [
      '**/*.test.tsx',
      '**/__mocks__/**/*'
    ]
  });
  files.forEach(file => {
    const p = path.parse(path.join(baseDir, file));
    const mocksDir = path.join(p.dir, '__mocks__');
    const mockFile = path.join(mocksDir, p.base);
    if (!fs.existsSync(mockFile)) {
      missingMocks.push(path.join(baseDir, file));
    }
  });
}

checkFor(path.resolve(__dirname, '../src/Pages'));
checkFor(path.resolve(__dirname, '../src/Components'));

if(missingMocks.length > 0) {
  console.error('Missing component mocks for:', missingMocks);
  process.exit(1);
}
