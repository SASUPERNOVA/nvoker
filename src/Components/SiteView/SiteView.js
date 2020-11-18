import React, { Fragment, useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import ScrollContainer from '../ScrollContainer/ScrollContainer';
import AddSiteModal from '../AddSiteModal/AddSiteModal';
import RemoveSiteModal from '../RemoveSiteModal/RemoveSiteModal';
import { decodeOSString } from '../../utils/os_string';
import './SiteView.css';

function SiteView({addModal, removeModal}) {
    const [links, setLinks] = useState([]);
    const [linksShown, setLinksShown] = useState(false);
    const [addModalVisible, toggleAddModal] = addModal;
    const [removeModalVisible, toggleRemoveModal] = removeModal;

    useEffect(() => {
        ipcRenderer.on('show-links', (_event, lks) => {
            setLinks(lks);
            setLinksShown(true);
        });

        ipcRenderer.on('hide-links', (_event) => {
            setLinks([]);
            setLinksShown(false);
        });
    }, []);

    return (
        <Fragment>
            <ScrollContainer id='site-view' overflowY='scroll'>
            {
                linksShown &&
                <div id='site-view-menu'>
                    <button onClick={toggleAddModal}>Add Website</button>
                </div>
            }
            <ScrollContainer id='site-view-grid' overflowY='scroll'>
            {Object.keys(links).map((url, index) => {
                let title = links[url];
                return (
                    <button className='link-button' key={index} name={url} onClick={onMainElementClicked(removeModalVisible)} onMouseDown={onMainElementPressed(toggleRemoveModal)}>
                        <img className='link-button-image' src={ipcRenderer.sendSync('get-image-path', title)} alt={title} draggable='false'/>
                        <span className='link-button-overlay'>{decodeOSString(title)}</span>
                    </button>
                )
            })}
            </ScrollContainer>
            </ScrollContainer>
            <AddSiteModal visible={addModalVisible} toggle={toggleAddModal} confirm={onAddSite(toggleAddModal)}/>
            <RemoveSiteModal visible={removeModalVisible} toggle={toggleRemoveModal} confirm={onRemoveSites(toggleRemoveModal)}/>
        </Fragment>);
}

const onMainElementPressed = (toggleRemoveModal) => (e) => {
    const target = e.currentTarget;

    const cancelTimeout = () => {
        clearTimeout(holdTimeout);
        target.removeEventListener('mouseup', cancelTimeout);
        target.removeEventListener('mouseleave', cancelTimeout);
    }

    const holdTimeout = setTimeout(() => {
        toggleRemoveModal();
    }, 1000);

    target.addEventListener('mouseup', cancelTimeout);
    target.addEventListener('mouseleave', cancelTimeout);
}

const onAddSite = (toggleAddModal) => () => {
    const newSiteURL = document.getElementById('modal-input').value;
    ipcRenderer.send('capture-page', newSiteURL);
    toggleAddModal();
}

const onRemoveSites = (toggleRemoveModal) => () => {
    const links = Array.from(document.getElementById('site-view-grid').children)
    .filter((element) => element.classList.contains('delete-site-selected'))
    .map(({name}) => name);
    ipcRenderer.send('remove-links', links);
    toggleRemoveModal();
}

const onMainElementClicked = (isRemoveModalVisible) => (e) => {
    const target = e.currentTarget;
    if (isRemoveModalVisible) {
        target.classList.toggle('delete-site-selected');
        return;
    }

    ipcRenderer.send('goto', target.name);
}

export default SiteView;