'use strict';

const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');
const { key, iv } = require('./key');
const encode = require('./encode');

const confidentialDirPath = path.resolve('docs/assets/confidential');

fs.readdirSync(confidentialDirPath).forEach(function (filename) {
  if (!filename.endsWith('.mdx')) return;
  const filePath = path.join(confidentialDirPath, filename);
  const filePathStat = fs.statSync(filePath);
  if (filePathStat.isFile()) {
    encode(filename);
  }
});
