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
    }
});