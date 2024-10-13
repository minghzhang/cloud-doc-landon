const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld('electronAPI', {
    getSavedLocation: (name) => ipcRenderer.invoke("get_savedLocation", name),
    readFile: (path) => ipcRenderer.invoke("read_file", path),
    writeFile: (path, content) => ipcRenderer.invoke("write_file", path, content),
    renameFile: (oldPath, newPath) => ipcRenderer.invoke("rename_file", oldPath, newPath),
    deleteFile: (path) => ipcRenderer.invoke("delete_file", path),
})

console.log("loading preload.js")