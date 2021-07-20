const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    icon: path.join(__dirname, 'media', 'Nvoker.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
  }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('add-category', (event, category) => {
  const linkPath = path.join(__dirname, 'userData', 'Links.json');
  const categoryPath = path.join(__dirname, 'userData', 'categories', category);

  let data = fs.readFileSync(linkPath);
  data = JSON.parse(data);

  data[category] = {};

  fs.mkdirSync(categoryPath, {recursive: true});
  fs.writeFileSync(linkPath, JSON.stringify(data, null, ' '));
});

ipcMain.handle('load-file', async (_event, fileName) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'userData', fileName));
    return JSON.parse(data);
  }
  catch (err) {
    if (err.code === 'ENOENT') {
      fs.mkdirSync(path.join(__dirname, 'userData'), {recursive: true});
      fs.writeFileSync(path.join(__dirname, 'userData', 'Links.json'), JSON.stringify({}));
      return {};
    }
    else {
      throw err;
    }
  }
});