const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld('electronAPI', {
    getSavedLocation: (name) => ipcRenderer.invoke("get_savedLocation", name),
    readFile: (path) => ipcRenderer.invoke("read_file", path),
    writeFile: (path, content) => ipcRenderer.invoke("write_file", path, content),
    renameFile: (oldPath, newPath) => ipcRenderer.invoke("rename_file", oldPath, newPath),
    deleteFile: (path) => ipcRenderer.invoke("delete_file", path),
    saveStoreKV: (key, value) => ipcRenderer.invoke("save_storeKV", key, value),
    getStoreValue: (key) => ipcRenderer.invoke("get_store_value", key),
    deleteStoreKey: (key) => ipcRenderer.invoke("delete_store_key", key),
    openDialog: () => ipcRenderer.invoke("open_dialog"),
    showMessageBox: (type, title, message) => ipcRenderer.invoke("show_message_box", type, title, message),
    // 提供一个方法让渲染进程请求弹出右键菜单
    showContextMenu: (itemArray) => ipcRenderer.send('show-context-menu',itemArray),

    // 提供一个方法监听菜单点击的命令
    onContextMenuCommand: (callback) => ipcRenderer.on('context-menu-command', callback),
})

console.log("loading preload.js")