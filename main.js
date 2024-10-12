const {app, BrowserWindow} = require('electron');
//const isDev = require('electron-is-dev');
let mainWindow;
const {exec} = require('child_process');
const path = require("node:path"); // 用于终止进程

const remote = require('@electron/remote/main');
remote.initialize();

app.whenReady().then(() => {
    // 使用动态导入加载 ES Module
    const isDev = true;
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 680,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true, // 允许在渲染进程中使用 Node.js API
            contextIsolation: false,
            enableRemoteModules: true,
        }
    })
    mainWindow.webContents.openDevTools();
    const urlLocation = isDev ? 'http://127.0.0.1:3000' : 'http://dummyUrl'
    mainWindow.loadURL(urlLocation);
    remote.enable(mainWindow.webContents);

    mainWindow.on('closed', () => {
        // Electron 窗口关闭时，终止 React 开发服务器
        if (isDev) {
            exec('lsof -t -i :3000 | xargs kill', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error killing process: ${error}`);
                    return;
                }
                console.log(`Server on port 3000 stopped`);
            });
        }
        app.quit();
    });
})