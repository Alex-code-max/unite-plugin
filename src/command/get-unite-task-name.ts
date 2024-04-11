import * as vscode from "vscode";
import {
  getGitBranch,
  handleGetTaskName,
  handleLogined,
} from "../utils/common";
import { TaskIdReg } from "../utils/consts";

export const getUniteTaskName = (context: vscode.ExtensionContext) =>
  vscode.commands.registerCommand("extension.getUniteTaskName", async () => {
    const branch = await getGitBranch();
    if (!branch) {
      vscode.window.showInformationMessage("没有分支");
      return;
    }
    const taskId = branch.replace(TaskIdReg, "");
    if (!+taskId) {
      vscode.window.showInformationMessage("当前分支不包含任务号");
      return;
    }
    handleGetTaskName(taskId, context);
  });
