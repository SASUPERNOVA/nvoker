import React, { Fragment } from 'react';
import Modal from '../Modal/Modal';
import './ConfirmationModal.css';

function ConfirmationModal({ visible, toggle, confirm, title, message, accept, decline }) {
    accept = accept ? accept : 'Yes';
    decline = decline ? decline : 'No';
    const onConfirm = () => {
        confirm();
        toggle();
    }
    return(
        <Modal visible={visible} toggle={toggle}>
            <div id='confirmation-modal'>
                <p id='confirmation-title'>{title}</p>
                <p id='confirmation-message'>{message}</p>
                <div id='confirmation-options'>
                    {
                        navigator.platform === 'Win32' ? 
                        <Fragment>
                            <button onClick={toggle}>{decline}</button>
                            <button onClick={onConfirm}>{accept}</button>
                        </Fragment>
                        :
                        <Fragment>
                            <button onClick={onConfirm}>{accept}</button>
                            <button onClick={toggle}>{decline}</button>
                        </Fragment>
                    }
                </div>
            </div>
        </Modal>
    )
}

export default ConfirmationModal;