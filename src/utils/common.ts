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

export const OpenBrowser = (url: string) => {
  if (os.platform() === Platform["WindowOS"]) {
    exec(`start ${url}`);
  } else {
    exec(`open ${url}`);
  }
};

export const GetStorageData = async (context: vscode.ExtensionContext) => {
  const secrets = context["secrets"]; //SecretStorage-object
  const mySecret = await secrets.get("token"); //Get a secret
  return mySecret;
};

export const handleLogined = async (
  context: vscode.ExtensionContext,
  token: string
) => {
  const secrets = context["secrets"]; //SecretStorage-object
  await secrets.store("token", token); //Save a secret
  vscode.commands.executeCommand("extension.getUniteTaskName");
};

export const handleGetTaskName = async (
  taskId: string,
  context: vscode.ExtensionContext
) => {
  const token = GetStorageData(context);
  axios({
    method: "POST",
    url: "https://unite.qa.tcshuke.com/api/project/getIssueByField",
    //   withCredentials: true,
    headers: {
      Cookie: `__AUTHZ_SSO_TICKET__=${token}`,
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
        OpenBrowser(
          "https://tccommon.17usoft.com/oauth/authorize?response_type=code&scope=read&client_id=JF_AUTHZ_CLIENT&redirect_uri=https://authzsso.tcshuke.com/oa/authorizationCallback&state=eac685ce9bcd4bce865b90fdde37dd2e&return_uri=https://alex-code-max.github.io/alexyu_blog/unite-login"
        );
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
