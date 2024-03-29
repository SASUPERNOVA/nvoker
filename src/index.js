const { app, BrowserWindow, ipcMain, Notification } = require('electron');
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
  if (!app.commandLine.hasSwitch('debug')) {
    mainWindow.removeMenu();
  }

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
  const categoryPath = path.join(__dirname, 'userData', 'Links', category);

  let data = fs.readFileSync(linkPath);
  data = JSON.parse(data);

  data[category] = {};

  fs.mkdirSync(categoryPath, {recursive: true});
  fs.writeFileSync(linkPath, JSON.stringify(data, null, ' '));
});

ipcMain.on('remove-categories', (_event, categories) => {
  const linkPath = path.join(__dirname, 'userData', 'Links.json');

  let data = fs.readFileSync(linkPath);
  data = JSON.parse(data);

  for (const category of categories) {
  const categoryPath = path.join(__dirname, 'userData', 'Links', category);
    delete data[category];
    fs.rm(categoryPath, {recursive: true, force: true}, (err) => {
      if (err) {
        throw err;
      }
    });
  }

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

ipcMain.handle('add-site', async (event, category, url) => {
  try {
    const linkPath = path.join(__dirname, 'userData', 'Links.json');

    let data = fs.readFileSync(linkPath);
    data = JSON.parse(data);
    const title = await capturePage(category, url);

    data[category][url] = title;

    fs.writeFileSync(linkPath, JSON.stringify(data, null, ' '));
  }
  catch (err) {
    throw err;
  }
});

async function capturePage(category, url) {
  const categoryPath = path.join(__dirname, 'userData', 'Links', category);
  const snapshot = {
        width: 800,
        height: 600,
        timeout: 0
      };
  const { timeout, width, height } = snapshot;
  let browser = new BrowserWindow({
    width,
    height,
    show: false,
    webPreferences: {
      offscreen: true // Necessary for rendering elements such as YouTube preview images
    }
  });

  try {
    browser.webContents.setAudioMuted(true);
    await browser.loadURL(url);
    await new Promise(resolve => setTimeout(resolve, timeout));
    const image = await browser.webContents.capturePage();
    const title = browser.webContents.getTitle();
    fs.mkdirSync(categoryPath, {recursive: true});
    fs.writeFileSync(path.join(categoryPath, `${new URL(url).hostname}.png`), image.toPNG());
    browser.close();
    return title;
  }
  catch (err) {
    if (err.code === 'ERR_INVALID_URL') {
      new Notification({
        title: "URL Capture Failed",
        body: `Could not connect to ${url}`
      }).show();
    }
    else {
      throw err;
    }
  }
}

ipcMain.on('remove-sites', (_event, category, urls) => {
  const linkPath = path.join(__dirname, 'userData', 'Links.json');

  let data = fs.readFileSync(linkPath);
  data = JSON.parse(data);

  for (const url of urls) {
  const categoryPath = path.join(__dirname, 'userData', 'Links', category);
    delete data[category][url];
    fs.rm(path.join(categoryPath, `${new URL(url).hostname}.png`,), (err) => {
      if (err) {
        throw err;
      }
    });
  }
  fs.writeFileSync(linkPath, JSON.stringify(data, null, ' '));
});
