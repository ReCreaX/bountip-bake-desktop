"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
let mainWindow = null;
const isDev = !electron_1.app.isPackaged;
const createWindow = async () => {
    electron_1.ipcMain.handle('ping', async () => 'pong from main');
    if (!isDev) {
        // 🧠 In production, start the Next.js server
        (0, child_process_1.spawn)('npm', ['run', 'start'], {
            cwd: path_1.default.join(__dirname, '../frontend'),
            shell: true,
            stdio: 'inherit',
        });
        // ⏳ Wait 4 seconds for Next.js to boot
        await new Promise((resolve) => setTimeout(resolve, 4000));
    }
    mainWindow = new electron_1.BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    const url = isDev
        ? 'http://localhost:3000'
        : 'http://localhost:3000/sales/123/details'; // Production loads dynamic route
    await mainWindow.loadURL(url);
};
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', () => electron_1.app.quit());
//# sourceMappingURL=main.js.map