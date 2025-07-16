import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { spawn } from "child_process";
import waitOn from "wait-on";

let mainWindow: BrowserWindow | null = null;
const isDev = !app.isPackaged;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function startNestBackend() {
  const backend = spawn("npm", ["run", "start:nest"], {
    cwd: path.join(__dirname, ".."),
    shell: true,
    stdio: "ignore",
    detached: true,
  });

  backend.unref();

  backend.on("error", (err) => {
    console.error("[NestJS] Failed to start backend:", err);
  });
}

function startNextInProd() {
  spawn("npm", ["run", "start"], {
    cwd: path.join(__dirname, "../frontend"),
    shell: true,
    stdio: "inherit",
  });
}

const createWindow = async () => {
  ipcMain.handle("ping", async () => "pong from main");

  if (!isDev) {
    startNextInProd();
    await waitOn({ resources: ["http://localhost:3000"] });
  }

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  const url = isDev ? "http://localhost:3000" : "http://localhost:3000";
  await mainWindow.loadURL(url);
};

app.whenReady().then(() => {
  app.setName("Bountip Bake Desktop");
  app.setAppUserModelId("com.bountip.bake");

  startNestBackend();
  createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});
