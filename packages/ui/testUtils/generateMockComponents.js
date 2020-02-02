const path = require('path');
const glob = require('glob');
const fs = require('fs');

const tplPath = path.join(__dirname, 'mockComponentTemplate.tpl');

const tpl = fs.readFileSync(tplPath).toString('utf-8');
const genFor = (baseDir) => {
  const files = glob.sync('**/*.tsx', {
    cwd: baseDir,
    ignore: [
      '**/*.test.tsx',
      '**/__mocks__/**/*'
    ]
  });
  files.forEach(file => {
    const p = path.parse(path.join(baseDir, file));
    const name = p.name;
    const mocksDir = path.join(p.dir, '__mocks__');
    const mockFile = path.join(mocksDir, p.base);
    const utilpath = path.relative(path.join(p.dir, '__mocks__'), __dirname);
    const contents = tpl.replace('__UTILPATH__', utilpath).replace('__NAME__', name);
    if (!fs.existsSync(mocksDir)) {
      fs.mkdirSync(mocksDir, {
        recursive: true
      });
    }
    if (!fs.existsSync(mockFile)) {
      fs.appendFileSync(mockFile, contents);
    }
  });
}

genFor(path.resolve(__dirname, '../src/Pages'));
genFor(path.resolve(__dirname, '../src/Components'));
