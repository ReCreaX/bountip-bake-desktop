import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  ping: async () => await ipcRenderer.invoke("ping"),
});
