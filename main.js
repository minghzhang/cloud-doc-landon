const {app, BrowserWindow} = require('electron');
//const isDev = require('electron-is-dev');
let mainWindow;
const { exec } = require('child_process'); // 用于终止进程

app.whenReady().then(() => {
    // 使用动态导入加载 ES Module
    const isDev = true;
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 680,
        webPreferences: {
            nodeIntegration: true,
        }
    })

    const urlLocation = isDev ? 'http://127.0.0.1:3000' : 'http://dummyUrl'
    mainWindow.loadURL(urlLocation);

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