import * as vscode from "vscode";

export const AddStatusBtn = () => {
  // 创建StatusBar按钮
  const button = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    0
  );
  button.text = "$(link-external) Unite Task";
  button.command = "extension.openTheCurrentTaskInUnite";
  button.show();
};
