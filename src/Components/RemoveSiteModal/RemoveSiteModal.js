import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import './RemoveSiteModal.css';

function RemoveSiteModal({ visible, toggle, confirm }) {
    const [confirmVisible, setConfirmVisible] = useState(false);
    const confirmToggle = () => setConfirmVisible(!confirmVisible);

    return (
        <Modal visible={visible} toggle={toggle}>
            <div id='remove-site-modal'>
                <button onClick={confirmToggle}>Confirm</button>
                <button onClick={toggle}>Cancel</button>
            </div>
            <ConfirmationModal visible={confirmVisible} toggle={confirmToggle} confirm={confirm}
                title='Delete Sites' message='Are you sure you want to delete the selected sites?'/>
        </Modal>
    );
}

export default RemoveSiteModal;