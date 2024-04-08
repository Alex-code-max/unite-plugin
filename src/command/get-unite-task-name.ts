import * as vscode from "vscode";
import { getGitBranch, handleGetTaskName } from "../utils/common";
import { TaskIdReg } from "../utils/consts";

export const getUniteTaskName = () =>
  vscode.commands.registerCommand("extension.getUniteTaskName", async () => {
    const branch = await getGitBranch();
    if (!branch) {
      return;
    }
    const taskId = branch.replace(TaskIdReg, "");
    if (!+taskId) {
      vscode.window.showInformationMessage("当前分支不包含任务号");
      return;
    }
    handleGetTaskName(taskId);
  });
