"use strict";

const fs = require("fs");
const path = require("path");
const CryptoJS = require("crypto-js");
const password = require("./password");

const confidentialDirPath = path.resolve("src/confidential");
const targetDirPath = path.resolve("docs/confidential");

fs.readdirSync(confidentialDirPath).forEach(function (filename) {
  if (!filename.endsWith(".md")) return;
  const filePath = path.join(confidentialDirPath, filename);
  const filePathStat = fs.statSync(filePath);
  if (filePathStat.isFile()) {
    const content = fs.readFileSync(filePath, "utf-8");
    const encodeed = CryptoJS.AES.encrypt(content, password).toString();
    fs.writeFileSync(path.join(targetDirPath, filename), encodeed, "utf-8");
  }
});
