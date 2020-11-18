import React, { useEffect, useRef } from 'react';
import Modal from '../Modal/Modal';
import './AddCategoryModal.css';

function AddCategoryModal({ visible, toggle, confirm }) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (visible) {
            inputRef.current.focus();
        }
    }, [visible]);

    return (
        <Modal visible={visible} toggle={toggle}>
            <div id='category-modal'>
                <p id='exit-button' onClick={toggle}>&#10006;</p>
                <div id='modal-grid'>
                    <p id='modal-label'>Enter a Category Name</p>
                    <div id='input-wrapper'>
                        <input id='modal-input' type='text' onKeyPress={onKeyPressed(confirm)} ref={inputRef}></input>
                        <button onClick={confirm}>Done</button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

const onKeyPressed = (confirm) => (e) => {
    if (e.key === 'Enter') {
        confirm();
    }
}

export default AddCategoryModal;