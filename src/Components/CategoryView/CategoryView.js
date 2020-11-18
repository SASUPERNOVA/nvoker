import React, { Fragment, useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import ScrollContainer from '../ScrollContainer/ScrollContainer';
import AddCategoryModal from '../AddCategoryModal/AddCategoryModal';
import RemoveCategoryModal from '../RemoveCategoryModal/RemoveCategoryModal';
import './CategoryView.css';

function CategoryView({addModal, removeModal}) {
    const [categories, setCategories] = useState([]);
    const [addModalVisible, toggleAddModal] = addModal;
    const [removeModalVisible, toggleRemoveModal] = removeModal;

    useEffect(() => {
        ipcRenderer.on('show-categories', (_event, cts) => {
            setCategories(cts);
        });
    }, []);

    return (
        <Fragment>
            <ScrollContainer id='category-view' overflowY='scroll'>
                <div id='category-view-menu'>
                    <button onClick={toggleAddModal}>Add Category</button>
                </div>  
                <ScrollContainer id='category-view-grid' overflowY='scroll'>
                {categories.map((category) => {
                    return <button key={category} onClick={onSideElementClicked(removeModalVisible)} onMouseDown={onSideElementPressed(toggleRemoveModal)}>{category}</button>;
                })}
                </ScrollContainer>
            </ScrollContainer>
            <AddCategoryModal visible={addModalVisible} toggle={toggleAddModal} confirm={onAddCategory(toggleAddModal)}/>
            <RemoveCategoryModal visible={removeModalVisible} toggle={toggleRemoveModal} confirm={onRemoveCategories(toggleRemoveModal)}/>
        </Fragment>);
}

const onSideElementClicked = (isRemoveModalVisible) => (e) => {
    if (isRemoveModalVisible) {
        e.target.classList.toggle('delete-category-selected');
        return;
    }

    const category = e.target.textContent;

    ipcRenderer.send('request-links', category);
}

const onSideElementPressed = (toggleRemoveModal) => (e) => {
    const {target} = e;

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

const onAddCategory = (toggleAddModal) => () => {
    const newCategory = document.getElementById('modal-input').value;
    ipcRenderer.send('add-category', newCategory);
    toggleAddModal();
}

const onRemoveCategories = (toggleRemoveModal) => () => {
    const categories = Array.from(document.getElementById('category-view-grid').children)
    .filter((element) => element.classList.contains('delete-category-selected'))
    .map(({ textContent }) => textContent);
    ipcRenderer.send('remove-categories', categories);
    toggleRemoveModal();
}

export default CategoryView;