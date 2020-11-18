import React, { Fragment, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import CategoryView from './Components/CategoryView/CategoryView';
import SiteView from './Components/SiteView/SiteView';
import { ipcRenderer } from 'electron';
import './App.css';
// import "core-js/stable";
// import "regenerator-runtime/runtime";

function App() {
    const [addCategoryVisible, setAddCategoryVisible] = useState(false);
    const [removeCategoryVisible, setRemoveCategoryVisible] = useState(false);
    const [addSiteVisible, setAddSiteVisible] = useState(false);
    const [removeSiteVisible, setRemoveSiteVisible] = useState(false);
    const toggleAddCategory = () => setAddCategoryVisible(!addCategoryVisible);
    const toggleAddSite = () => setAddSiteVisible(!addSiteVisible);
    const toggleRemoveCategory = () => {
        if (removeSiteVisible) {
            toggleRemoveSite();
        }
        if (removeCategoryVisible) {
            clearDeleteCategories();
        }
        setRemoveCategoryVisible(!removeCategoryVisible);
    }
    const toggleRemoveSite = () => {
        if (removeCategoryVisible) {
            toggleRemoveCategory();
        }
        if (removeSiteVisible) {
            clearDeleteSites();
        }
        setRemoveSiteVisible(!removeSiteVisible);
    }

    useEffect(() => {
        loadCustomCSS();
    }, []);

    return (
    <Fragment>
        <CategoryView addModal={[addCategoryVisible, toggleAddCategory]} removeModal={[removeCategoryVisible, toggleRemoveCategory]}/>
        <SiteView addModal={[addSiteVisible, toggleAddSite]} removeModal={[removeSiteVisible, toggleRemoveSite]}/>
    </Fragment>);
}

function clearDeleteCategories() {
    Array.from(document.getElementById('category-view-grid').children)
    .filter((element) => element.classList.contains('delete-category-selected'))
    .map((element) => element.classList.toggle('delete-category-selected'));
}

function clearDeleteSites() {
    Array.from(document.getElementById('site-view-grid').children)
    .filter((element) => element.classList.contains('delete-site-selected'))
    .map((element) => element.classList.toggle('delete-site-selected'));
}

function loadCustomCSS() {
    const css = ipcRenderer.sendSync('get-css');
    
    if (css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));