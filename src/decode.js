"use strict";

const fs = require("fs");
const path = require("path");
const CryptoJS = require("crypto-js");
const password = require("./password");

const confidentialDirPath = path.resolve("src/confidential");
const targetDirPath = path.resolve("docs/confidential");

fs.readdirSync(targetDirPath).forEach(function (filename) {
  if (!filename.endsWith(".md")) return;
  const filePath = path.join(targetDirPath, filename);
  const filePathStat = fs.statSync(filePath);
  if (filePathStat.isFile()) {
    const content = fs.readFileSync(filePath, "utf-8");
    const bytes = CryptoJS.AES.decrypt(content, password);
    const decodeed = bytes.toString(CryptoJS.enc.Utf8);
    fs.writeFileSync(path.join(confidentialDirPath, filename), decodeed, "utf-8");
  }
});
