import * as vscode from "vscode";
import { getGitBranch } from "../utils/common";
import { TaskIdReg, UnitProjectUrl } from "../utils/consts";
import { Platform } from "../utils/enum";
import { exec } from "child_process";
import * as os from "os";

export const openTheCurrentTaskInUnite = () =>
  vscode.commands.registerCommand(
    "extension.openTheCurrentTaskInUnite",
    async () => {
      const branch = await getGitBranch();
      if (!branch) {
        return;
      }
      // const terminal = vscode.window.activeTerminal;
      const taskId = branch.replace(TaskIdReg, "");

      // terminal?.sendText(taskId);
      if (!+taskId) {
        vscode.window.showInformationMessage("当前分支不包含任务号");
        return;
      }
      if (os.platform() === Platform["WindowOS"]) {
        exec(`start ${UnitProjectUrl}${taskId}`);
      } else {
        exec(`open ${UnitProjectUrl}${taskId}`);
      }
    }
  );
