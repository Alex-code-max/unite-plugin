import * as vscode from "vscode";

export const AddStatusBtn = ({ text }: Partial<vscode.StatusBarItem>) => {
  // 创建StatusBar按钮
  const button = vscode.window.createStatusBarItem(
    "unite-plugin",
    vscode.StatusBarAlignment.Left,
    0
  );
  button.text = `$(link-external) ${text}`;
  button.command = "extension.openTheCurrentTaskInUnite";
  button.show();
};
