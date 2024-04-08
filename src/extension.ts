// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { openTheCurrentTaskInUnite } from "./command/open-the-current-task-in-unite";
import { getUniteTaskName } from "./command/get-unite-task-name";
import { openLoginWebView } from "./command/open-login-web-view";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // 注册命令
  context.subscriptions.push(
    openTheCurrentTaskInUnite(),
    getUniteTaskName(),
    openLoginWebView(context)
  );
  const watchingGitHead =
    vscode.workspace.createFileSystemWatcher("**/.git/logs/HEAD");
  watchingGitHead.onDidChange(() => {
    vscode.commands.executeCommand("extension.getUniteTaskName");
  });
  vscode.commands.executeCommand("extension.getUniteTaskName");
}

// This method is called when your extension is deactivated
export function deactivate() {}
