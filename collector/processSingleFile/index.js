const path = require("path");
const fs = require("fs");
const {
  WATCH_DIRECTORY,
  SUPPORTED_FILETYPE_CONVERTERS,
} = require("../utils/constants");
const {
  trashFile,
  isTextType,
  normalizePath,
  isWithin,
} = require("../utils/files");
const RESERVED_FILES = ["__HOTDIR__.md"];

async function processSingleFile(targetFilename, options = {}) {
  const fullFilePath = path.resolve(
    WATCH_DIRECTORY,
    normalizePath(targetFilename)
  );
  if (!isWithin(path.resolve(WATCH_DIRECTORY), fullFilePath))
    return {
      success: false,
      reason: "文件名不是有效的处理路径.",
      documents: [],
    };

  if (RESERVED_FILES.includes(targetFilename))
    return {
      success: false,
      reason: "文件名是保留文件名，无法处理.",
      documents: [],
    };
  if (!fs.existsSync(fullFilePath))
    return {
      success: false,
      reason: "上传目录中不存在文件.",
      documents: [],
    };

  const fileExtension = path.extname(fullFilePath).toLowerCase();
  if (!fileExtension) {
    return {
      success: false,
      reason: `未找到文件扩展名,无法处理该文件.`,
      documents: [],
    };
  }

  let processFileAs = fileExtension;
  if (!SUPPORTED_FILETYPE_CONVERTERS.hasOwnProperty(fileExtension)) {
    if (isTextType(fullFilePath)) {
      console.log(
        `\x1b[33m[Collector]\x1b[0m The provided filetype of ${fileExtension} does not have a preset and will be processed as .txt.`
      );
      processFileAs = ".txt";
    } else {
      trashFile(fullFilePath);
      return {
        success: false,
        reason: `文件扩展名 ${fileExtension} 不支持解析，不能假定为文本文件类型.`,
        documents: [],
      };
    }
  }

  const FileTypeProcessor = require(SUPPORTED_FILETYPE_CONVERTERS[
    processFileAs
  ]);
  return await FileTypeProcessor({
    fullFilePath,
    filename: targetFilename,
    options,
  });
}

module.exports = {
  processSingleFile,
};
