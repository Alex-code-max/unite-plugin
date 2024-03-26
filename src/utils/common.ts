import * as vscode from "vscode";
const fs = require("fs");

export const getGitBranch = async () => {
  // 获取当前工作目录
  let projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  if (!projectRoot) {
    vscode.window.showInformationMessage("当前工作目录不存在");
    return "";
  }
  let currentBranchdata = "";
  // 读取.git/HEAD文件，处理分支信息
  try {
    const data = fs.readFileSync(projectRoot + "/.git/HEAD");
    currentBranchdata = data.toString().replace("ref: refs/heads/", "");
    return currentBranchdata;
  } catch (error: any) {
    vscode.window.showInformationMessage(
      "找不到.git/HEAD文件，请确保当前为项目环境并检查是否添加git仓库"
    );
    return "";
  }
};
