import * as vscode from "vscode";
export const openLoginWebView = (context: vscode.ExtensionContext) =>
  vscode.commands.registerCommand("extension.openLoginWebView", () => {
    const panel = vscode.window.createWebviewPanel(
      "unite-plugin", // WebView面板的唯一标识
      "登录页面", // WebView面板的标题
      vscode.ViewColumn.One, // WebView面板打开的栏位（这里示例为第一栏）
      {
        enableScripts: true, // 启用WebView中的JavaScript
      }
    );

    // 在WebView面板中加载第三方网站
    panel.webview.html = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
      </head>
      <body>
      <div id="test"></div>
      <iframe id="tc_login_iframe" src="https://tccommon.17usoft.com/oauth/authorize?response_type=code&scope=read&client_id=JF_AUTHZ_CLIENT&redirect_uri=https://authzsso.tcshuke.com/oa/authorizationCallback&state=eac685ce9bcd4bce865b90fdde37dd2e&return_uri=https://marketplace.visualstudio.com/vscode" width="100%" height="800px"></iframe>
      <script>
      const iframe = document.getElementById('tc_login_iframe');

// 创建一个 MutationObserver 实例
const observer = new MutationObserver(function(mutations) {
  // 遍历所有更改
  mutations.forEach(function(mutation) {
    // 如果 src 属性更改了
    if (mutation.attributeName === 'src') {
      // 处理你的逻辑
      document.getElementById('test').innerText = 'src changed';
    }
  });
});

// 监听 iframe 的属性更改
observer.observe(iframe, { attributes: true });
      </body>
      </html>`;

    panel.onDidChangeViewState(
      () => {
        const terminal = vscode.window.activeTerminal;
        terminal?.sendText("changed");
      },
      null,
      context.subscriptions
    );
  });
