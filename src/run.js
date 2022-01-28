"use strict";

const fs = require("fs");
const path = require("path");
const CryptoJS = require("crypto-js");
const password = require("./password");

const confidentialPath = path.resolve("src/confidential");
const targetDirPath = path.resolve("docs/confidential");

fs.readdirSync(confidentialPath).forEach(function (filename) {
  const filePath = path.join(confidentialPath, filename);
  const targetPath = path.join(targetDirPath, filename);
  const filePathStat = fs.statSync(filePath);
  if (filePathStat.isFile() && filename.endsWith(".md")) {
    const content = fs.readFileSync(filePath, "utf-8");
    const encodeed = CryptoJS.AES.encrypt(content, password).toString();
    fs.writeFileSync(targetPath, encodeed, "utf-8");
  }
});
