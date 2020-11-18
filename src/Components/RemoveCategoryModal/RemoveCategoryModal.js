import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import './RemoveCategoryModal.css';

function RemoveCategoryModal({ visible, toggle, confirm }) {
    const [confirmVisible, setConfirmVisible] = useState(false);
    const confirmToggle = () => setConfirmVisible(!confirmVisible);

    return (
        <Modal visible={visible} toggle={toggle}>
            <div id='remove-category-modal'>
                <button onClick={confirmToggle}>Confirm</button>
                <button onClick={toggle}>Cancel</button>
            </div>
            <ConfirmationModal visible={confirmVisible} toggle={confirmToggle} confirm={confirm}
                title='Delete Categories' message='Are you sure you want to delete the selected categories?'/>
        </Modal>
    );
}

export default RemoveCategoryModal;