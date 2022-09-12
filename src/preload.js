const {contextBridge, ipcRenderer} = require("electron");
contextBridge.exposeInMainWorld("api", {
    run_script: async(data) => await ipcRenderer.invoke("run_script", data),
});