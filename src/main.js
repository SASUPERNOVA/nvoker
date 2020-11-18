const { app, BrowserWindow, Notification, ipcMain, protocol, shell, globalShortcut } = require('electron');
const fs = require('fs');
const path = require('path');
const { encodeOSString } = require('./utils/os_string');
// For using async/await
require("core-js/stable");
require("regenerator-runtime/runtime");

const ROOT_PATH = process.env.PORTABLE_EXECUTABLE_DIR ? process.env.PORTABLE_EXECUTABLE_DIR : './';
const USER_DATA_PATH = `${ROOT_PATH}/UserData`;
const LINKS_JSON_PATH = `${USER_DATA_PATH}/Links.json`;
const SNAPSHOT_PATH = `${USER_DATA_PATH}/Links/`;
const DYNAMIC_IMAGE_PROTOCOL = 'dimg';

const defaultSettings = {
  window: {
    bounds: {
      width: 800,
      height: 600
    },
    minWidth: 600,
    minHeight: 300,
  },
  snapshot: {
    width: 800,
    height: 600,
    timeout: 0
  },
  showNotifications: true
}

let mainWindow = null;
let settings = {};
let activeCategory = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  try {
    settings = fs.readFileSync(`${USER_DATA_PATH}/Settings.json`);
    settings = JSON.parse(settings);
    const windowBounds = settings.window.bounds;

    mainWindow = new BrowserWindow({
      width: windowBounds.width,
      height: windowBounds.height,
      x: windowBounds.x,
      y: windowBounds.y,
      minWidth: settings.window.minWidth,
      minHeight: settings.window.minHeight,
      webPreferences: {
        nodeIntegration: true,
        worldSafeExecuteJavaScript: true
    }
    });

    if (settings.window.isMaximized) {
      mainWindow.maximize();
    }
  }
  catch (_e) {
    settings = defaultSettings;
    const windowBounds = settings.window.bounds;

    mainWindow = new BrowserWindow({
      width: windowBounds.width,
      height: windowBounds.height,
      minWidth: settings.window.minWidth,
      minHeight: settings.window.minHeight,
      webPreferences: {
        nodeIntegration: true,
        worldSafeExecuteJavaScript: true
    }
    });
    
    fs.mkdirSync(USER_DATA_PATH, {recursive: true});
    fs.writeFileSync(`${USER_DATA_PATH}/Settings.json`, JSON.stringify(settings, null, ' '));
  }
  mainWindow.removeMenu();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.on('dom-ready', loadCategories);

  mainWindow.on('close', () => {
    settings.window.bounds = mainWindow.getBounds();
    settings.window.isMaximized = mainWindow.isMaximized();
    fs.writeFileSync(`${USER_DATA_PATH}/Settings.json`, JSON.stringify(settings, null, ' '));
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  protocol.registerFileProtocol(`${DYNAMIC_IMAGE_PROTOCOL}`, (request, callback) => {
    const { url } = request;
      const decoded_basename = decodeURIComponent(path.basename(url));
      const pathname = decodeURIComponent(url).replace(`${DYNAMIC_IMAGE_PROTOCOL}://`, '').replace(decoded_basename, encodeOSString(decoded_basename));
      callback(pathname);
  });

  if (process.platform === 'win32') {
    // Override app.electron prefix on push notifications
    app.setAppUserModelId('Nvoker');
  }

  globalShortcut.register('CommandOrControl+Shift+I', () => {
    if (mainWindow.isFocused()) {
      mainWindow.toggleDevTools();
    }
  });

  globalShortcut.register('CommandOrControl+R', () => {
    if (mainWindow.isFocused()) {
      mainWindow.reload();
    }
  });

  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

async function capturePage(url, outputName, options) {
  const snapshot = settings.snapshot;
  const { timeout = snapshot.timeout, width = snapshot.width, height = snapshot.height } = options ? options : snapshot;
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
    // Allow special characters to be used in file name
    outputName = outputName ? encodeOSString(outputName) : encodeOSString(browser.webContents.getTitle());
    fs.mkdirSync(`${SNAPSHOT_PATH}/${activeCategory}`, {recursive: true});
    fs.writeFileSync(`${SNAPSHOT_PATH}/${activeCategory}/${outputName}.png`, image.toPNG());
    browser.close();
    addLink(url, outputName);
  }
  catch (err) {
    if (err.code === 'ERR_INVALID_URL' && settings.showNotifications) {
      new Notification({
        title: "URL Capture Failed",
        body: `Could not connect to ${url}`
      }).show();
    }
  }
}

function addLink(url, title) {
  let data = fs.readFileSync(`${USER_DATA_PATH}/Links.json`);
  data = JSON.parse(data);
  
  data[activeCategory][url] = title;
  fs.writeFileSync(LINKS_JSON_PATH, JSON.stringify(data, null, ' '));
  loadLinks(activeCategory);
}

function loadCategories() {
  try {
    let data = fs.readFileSync(`${USER_DATA_PATH}/Links.json`);
    data = JSON.parse(data);

    mainWindow.webContents.send('show-categories', Object.keys(data));
    if (activeCategory) {
      loadLinks(activeCategory);
    }
  }
  catch (err) {
    if (err.code === 'ENOENT') {
      fs.mkdirSync(USER_DATA_PATH, {recursive: true});
      fs.writeFileSync(`${USER_DATA_PATH}/Links.json`, '{}');
      mainWindow.webContents.send('show-categories', []);
    }
    else throw err;
  }
}

function loadLinks(category) {
  let data = fs.readFileSync(`${USER_DATA_PATH}/Links.json`);
  data = JSON.parse(data);
  activeCategory = category;

  let links = data[category] ? data[category] : {};
  mainWindow.webContents.send('show-links', links);
}

function addCategory(category) {
  let data = fs.readFileSync(LINKS_JSON_PATH);
  data = JSON.parse(data);

  data[category] = {};

  fs.mkdirSync(`${SNAPSHOT_PATH}/${category}`, {recursive: true});
  fs.writeFileSync(LINKS_JSON_PATH, JSON.stringify(data, null, ' '));
  mainWindow.webContents.send('show-categories', Object.keys(data));
  if (!activeCategory) {
    loadLinks(category);
  }
}

function removeCategories(categories) {
  let data = fs.readFileSync(LINKS_JSON_PATH);
  data = JSON.parse(data);

  for (const category of categories) {
    delete data[category];
    fs.rmdirSync(`${SNAPSHOT_PATH}/${category}`, {recursive: true});
    activeCategory = activeCategory === category ? null : activeCategory;
  }

  fs.writeFileSync(LINKS_JSON_PATH, JSON.stringify(data, null, ' '));
  mainWindow.webContents.send('show-categories', Object.keys(data));
  if (!activeCategory) {
    mainWindow.webContents.send('hide-links');
  }
}

function removeLinks(links) {
  let data = fs.readFileSync(LINKS_JSON_PATH);
  data = JSON.parse(data);
  const activeCategoryLinks = data[activeCategory];

  for (const link of links) {
    fs.unlinkSync(`${SNAPSHOT_PATH}/${activeCategory}/${activeCategoryLinks[link]}.png`);
    delete activeCategoryLinks[link];
  }

  fs.writeFileSync(LINKS_JSON_PATH, JSON.stringify(data, null, ' '));
  mainWindow.webContents.send('show-links', activeCategoryLinks);
}

ipcMain.on('add-category', (_e, category) => {addCategory(category)});

ipcMain.on('remove-categories', (_e, categories) => {removeCategories(categories)});

ipcMain.on('request-links', (_e, category) => {loadLinks(category)});

ipcMain.on('capture-page', (_e, url, outputName, options) => {capturePage(url, outputName, options)});

ipcMain.on('remove-links', (_e, links) => {removeLinks(links)});

ipcMain.on('get-image-path', (e, title) => {
  const file_path = path.resolve(`${SNAPSHOT_PATH}/${activeCategory}/${title}.png`);
  e.returnValue = `${DYNAMIC_IMAGE_PROTOCOL}:///${file_path}`;
});

ipcMain.on('goto', (_e, url) => {
  shell.openExternal(url);
});

ipcMain.on('get-css', (e) => {
  try {
    const customCSS = fs.readFileSync(`${USER_DATA_PATH}/custom.css`, {encoding: 'utf-8'});
    e.returnValue = customCSS;
  }
  catch (_err) {
    e.returnValue = null;
  }
});