const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld('electronAPI', {
    getSavedLocation: (name) => ipcRenderer.invoke("get_savedLocation", name),
    readFile: (path) => ipcRenderer.invoke("read_file", path),
    writeFile: (path, content) => ipcRenderer.invoke("write_file", path, content),
    renameFile: (oldPath, newPath) => ipcRenderer.invoke("rename_file", oldPath, newPath),
    deleteFile: (path) => ipcRenderer.invoke("delete_file", path),
    saveStoreKV:(key, value) => ipcRenderer.invoke("save_storeKV", key, value),
    getStoreValue: (key) => ipcRenderer.invoke("get_store_value", key),
    deleteStoreKey: (key) => ipcRenderer.invoke("delete_store_key", key),
})

console.log("loading preload.js")