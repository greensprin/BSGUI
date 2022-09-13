const {contextBridge, ipcRenderer} = require("electron");
contextBridge.exposeInMainWorld("api", {
    // renderer -> main process
    run_script: async(data) => await ipcRenderer.invoke("run_script", data),

    // main process -> renderer
    on: (channel, callback) => ipcRenderer.on(channel, (event, argv) => callback(event, argv)),
});