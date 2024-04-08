import { openLoginWebView } from "./../command/open-login-web-view";
import * as vscode from "vscode";
import { AddStatusBtn } from "../status-bar/add-status-btn";
import axios from "axios";
const fs = require("fs");
import * as os from "os";
import { Platform } from "./enum";
import { UnitProjectUrl } from "./consts";
import { exec } from "child_process";

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

export const handleGetTaskName = async (taskId: string) => {
  axios({
    method: "POST",
    url: "https://unite.qa.tcshuke.com/api/project/getIssueByField",
    //   withCredentials: true,
    headers: {
      Cookie:
        "__AUTHZ_SSO_TICKET__=e2e69178dbc714db8376ea1018c3809d; JSESSIONID=L-Yp4PaaKXpHuPyk9_VEifZnkPE4aAoQkCE8D07l",
      Requestid: "1711615289743-66ee2c7b-388b-a087-83fc-fdb7319fa918",
      "content-type": "application/json;charset=UTF-8",
    },
    data: {
      fieldName: "title",
      issueId: taskId,
    },
  })
    .then((response: any) => {
      if (response.data.statusCode === 401) {
        vscode.window.showInformationMessage("登录过期，请重新登录");
        //TODO: 重新登录逻辑
        // vscode.commands.executeCommand("extension.openLoginWebView");
        return;
      }
      if (response.data.code !== "0000") {
        throw new Error(response.data.message);
      }
      const butonData = response.data?.data?.fieldValueText
        ? {
            text: response.data?.data?.fieldValueText,
          }
        : {
            text: "!error",
            color: "#ff4d4f",
          };
      AddStatusBtn(butonData);
    })
    .catch((error: any) => {
      vscode.window.showInformationMessage(`Error: ${error.message}`);
    });
};

export const OpenBrowser = (url: string) => {
  if (os.platform() === Platform["WindowOS"]) {
    exec(`start ${url}`);
  } else {
    exec(`open ${url}`);
  }
};
