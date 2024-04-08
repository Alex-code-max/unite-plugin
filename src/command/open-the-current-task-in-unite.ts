import * as vscode from "vscode";
import { OpenBrowser, getGitBranch } from "../utils/common";
import { TaskIdReg, UnitProjectUrl } from "../utils/consts";

export const openTheCurrentTaskInUnite = () =>
  vscode.commands.registerCommand(
    "extension.openTheCurrentTaskInUnite",
    async () => {
      const branch = await getGitBranch();
      if (!branch) {
        return;
      }
      // const terminal = vscode.window.activeTerminal;
      // terminal?.sendText(taskId);
      const taskId = branch.replace(TaskIdReg, "");

      if (!+taskId) {
        vscode.window.showInformationMessage("当前分支不包含任务号");
        return;
      }
      OpenBrowser(`${UnitProjectUrl}${taskId}`);
    }
  );
