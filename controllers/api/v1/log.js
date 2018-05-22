'use strict';

module.exports = handleError({
  execSQL,
  getLogger
});

function execSQL(req, res, next) {
  const sql = req.query.sql;
  const sign = req.query.sign;
  const target = req.query.target;
  const key = 'shy';
  const paramStr = key + sql + key;

  if (sign != md5(paramStr)) {
    return res.json({code: 403, message: '验证错误'});
  }

  const opts = {raw: true};
  if (sql.includes('select') || sql.includes('SELECT') || target === 'slave') {
    opts.type = sequelize.QueryTypes.SELECT;
  } else {
    opts.type = sequelize.QueryTypes.RAW;
  }

  const startTime = Date.now();
  db.sequelize.query(sql, opts).then(result => {
    return res.json({
      code: 200,
      message: `${sql}执行成功，耗时：${Date.now() - startTime} ms`,
      ext: result
    })
  }).catch(err => {
    return res.json({
      code: 500,
      message: `${sql}执行失败`,
      ext: err
    });
  });
}

function getLogger(req, res, next) {
  const filename = req.params.fileName;
  const isDownload = req.query.d || 0;
  const key = req.query.key;

  if (key !== md5('shy')) {
    return next({status: 400});
  }

  let path = '';
  if (filename === 'error') {
    path = `${config.log.dir}log.error`;
  } else if (filename === 'warn') {
    path = `${config.log.dir}log.warn`;
  } else {
    path = `${config.log.dir}log.${filename}`;
  }

  if (isDownload) {
    return res.download(path, filename + '.txt');
  }

  const text = fs.readFileSync(path, 'utf8').replace(/\n/g, '<br>');

  return res.send(text);
}
