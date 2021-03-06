import url from 'url';

/**
 * 处理include标签，将include的内容替换成真实内容
 * @param {工作目录} cwd 
 */

const INCLUDE_REG = /<include\s+(.*\s)?src\s*=\s*"(\S+)".*><\/include>/g

export default function(cwd) {
  return (req, res, next) => {
    let pathname = url.parse(req.originalUrl).pathname;
    fs.readFile(sysPath.join(cwd, pathname), 'utf8', (err, data) => {
      if (err) {
        next(err);
      } else {
        let content = data.toString();
        content = content.replace(INCLUDE_REG, ($0, $1, $2, $3) => {
          try {
            return fs.readFileSync(sysPath.join(cwd, url.resolve(pathname, $2)), 'utf8');
          } catch(err) {
            error(err.message);
            return '';
          }
        });
        res.type('html').send(Buffer.from(content, 'utf8'));
      }
    });
  }
}