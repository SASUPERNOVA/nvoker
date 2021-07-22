const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('nvokerAPI', {
    addCategory: (category) => {
        ipcRenderer.send('add-category', category);
    },
    loadCategories: async () => {
        try {
            const data = await ipcRenderer.invoke('load-file', 'Links.json');
            return Object.keys(data);
        }
        catch (err) {
            console.error(err);
        }
    },
    removeCategories(categories) {
        ipcRenderer.send('remove-categories', categories);
    },
    addSite: async (category, url) => {
        try {
            await ipcRenderer.invoke('add-site', category, url);
        }
        catch (err) {
            console.error(err);
        }
    },
    loadSites: async (category) => {
        try {
            const data = await ipcRenderer.invoke('load-file', 'Links.json');
            return data[category];
        }
        catch (err) {
            console.error(err);
        }
    }
});