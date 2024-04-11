import * as vscode from "vscode";
import {
  getGitBranch,
  handleGetTaskName,
  handleLogined,
} from "../utils/common";
import { TaskIdReg } from "../utils/consts";

export const getUniteTaskName = (context: vscode.ExtensionContext) =>
  vscode.commands.registerCommand("extension.getUniteTaskName", async () => {
    vscode.window.registerUriHandler({
      handleUri(uri: vscode.Uri) {
        if (uri.authority === "alexyu.unite-plugin") {
          const token = uri.query.replace("__AUTHZ_SSO_TICKET__=", "");
          handleLogined(context, token);
        }
      },
    });
    const branch = await getGitBranch();
    if (!branch) {
      return;
    }
    const taskId = branch.replace(TaskIdReg, "");
    if (!+taskId) {
      vscode.window.showInformationMessage("当前分支不包含任务号");
      return;
    }
    handleGetTaskName(taskId, context);
  });
