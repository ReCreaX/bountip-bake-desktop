import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { spawn } from 'child_process';

let mainWindow: BrowserWindow | null = null;

const isDev = !app.isPackaged;

const createWindow = async () => {
    ipcMain.handle('ping', async () => 'pong from main');
  if (!isDev) {
    // 🧠 In production, start the Next.js server
    spawn('npm', ['run', 'start'], {
      cwd: path.join(__dirname, '../frontend'),
      shell: true,
      stdio: 'inherit',
    });

    // ⏳ Wait 4 seconds for Next.js to boot
    await new Promise((resolve) => setTimeout(resolve, 4000));
  }

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const url = isDev
    ? 'http://localhost:3000'
    : 'http://localhost:3000/sales/123/details'; // Production loads dynamic route

  await mainWindow.loadURL(url);
};

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
