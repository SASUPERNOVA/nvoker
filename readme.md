# Nvoker

<p align="center">
    <img src=".media/Nvoker.svg" width="200px" alt="Nvoker logo">
</p>

Nvoker is as Speed Dial built on [Electron](https://github.com/electron/electron), using [Electron Forge](https://github.com/electron-userland/electron-forge). It allows you to quickly access you favorite websites, by saving them as images in your own categories.

## General Usage

To start adding links, a category must first be created. After a category has been created and selected, you can start adding links to that category by providing its URL. Left clicking on a link will open that link in your default browser, while right clicking will copy the URL to clipboard. You can create any number of categories and links, so feel free to add as many as you wish.  
Navigation of categories and links can be done either by using the mouse wheel, or by clicking and dragging the mouse.  
Deleting links or categories can be done by clicking and holding on an element that you want to delete, which will bring a menu to delete items of that type (category or link). After the menu appears, you may select any number of elements of that type to delete, and the confirm your selection.

### Customization

You can customize `src/index.html` by modifying `src/css/index.css`, individual Web Components by modifying the respective `src/components/somecomponent/somecomponent.css`, and all Web Components by modifying `src/css/global.css`.

## Building

Before building Nvoker, please make sure you have [Node](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. If both are installed, you can do the following to build from source:

1. Clone or download and extract this repository.
2. Open a terminal, and `cd` to the folder you have cloned or extracted this repository.
3. Run `npm install` to download required dependencies.
4. Run `npm run make` to build Nvoker. This will create an `out` directory with all the files required to install/run Nvoker.

## Demos
<details>
    <summary>Adding Categories and Links</summary>
    <img src=".media/demo1.gif" alt="Demo 1">
</details>
<details>
    <summary>Opening Links</summary>
    <img src=".media/demo2.gif" alt="Demo 2">
</details>
<details>
    <summary>Deleting Categories and Links</summary>
    <img src=".media/demo3.gif" alt="Demo 3">
</details>
<br>

## License

[MIT License](https://github.com/SASUPERNOVA/nvoker/blob/master/License.md)

