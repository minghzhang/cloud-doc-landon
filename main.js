import {app, BrowserWindow, dialog, ipcMain, Menu, MenuItem} from 'electron';
import isDev from 'electron-is-dev';
import {exec} from 'child_process';
import fs from "fs";
import path from "node:path"; // 用于终止进程
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import Store from 'electron-store';

let mainWindow;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function handleReadFile(event, path) {
    return await fs.promises.readFile(path, {encoding: 'utf8'});
}

async function handleWriteFile(event, path, content) {
    return await fs.promises.writeFile(path, content, {encoding: 'utf8'});
}

async function handleRenameFile(event, oldPath, newPath) {
    return await fs.promises.rename(oldPath, newPath);
}

async function handleDeleteFile(event, path) {
    return await fs.promises.unlink(path);
}


const store = new Store({'name': "Files_Data"});

async function handleSaveStoreKV(event, key, value) {
    return await store.set(key, value);
}

async function handleGetStoreValue(event, key) {
    return await store.get(key);
}

async function handleDeleteStoreKey(event, key) {
    return await store.delete(key);
}

async function handleOpenDialog(event) {
    return await dialog.showOpenDialog({
        title: "choose md files to import",
        properties: ['openFile', 'multiSelections'],
        filters: [
            {
                name: 'markdown filter',
                extensions: ['md']
            }
        ]
    });
}

async function handleShowMessageBox(event, type, title, message) {
    return await dialog.showMessageBox({
        type: type,
        title: title,
        message: message,
    });
}

const handleShowContextMenu = (event, menuItems) => {
    let template = menuItems.map(item => {
        return {
            "label": item.label,
            "click": () => {
                event.sender.send('context-menu-command', item.action)
            }
        };
    });
    const menu = Menu.buildFromTemplate(template);
    menu.popup(BrowserWindow.fromWebContents(event.sender)); // 在当前窗口弹出菜单
}


app.whenReady().then(() => {

    ipcMain.handle('get_savedLocation', (event, name) => {
        return app.getPath(name);
    });
    ipcMain.handle('read_file', handleReadFile);
    ipcMain.handle('write_file', handleWriteFile);
    ipcMain.handle('rename_file', handleRenameFile);
    ipcMain.handle('delete_file', handleDeleteFile);
    ipcMain.handle('save_storeKV', handleSaveStoreKV);
    ipcMain.handle('get_store_value', handleGetStoreValue);
    ipcMain.handle('delete_store_key', handleDeleteStoreKey);
    ipcMain.handle('open_dialog', handleOpenDialog);
    ipcMain.handle('show_message_box', handleShowMessageBox);

    // 监听渲染进程的右键点击事件
    ipcMain.on('show-context-menu', handleShowContextMenu)

    mainWindow = new BrowserWindow({
        width: 1024,
        height: 680,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        }
    })


    mainWindow.webContents.openDevTools();
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