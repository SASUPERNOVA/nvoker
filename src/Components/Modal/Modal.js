import React, { useEffect } from 'react';
import ReactDom from 'react-dom'
import './Modal.css';

function Portal({ children }) {
    const modalRoot = document.getElementById('modal-root');
    const el = document.createElement('div');

    useEffect(() => {
        modalRoot.appendChild(el);

        return () => {
            modalRoot.removeChild(el);
        }
    });

    return ReactDom.createPortal(children, el);
}

function Modal({ children, visible, toggle, acceptsEscape = true }) {
    useEffect(() => {
        const esc = onEscape(toggle);
        if (visible && acceptsEscape) {
            document.addEventListener('keydown', esc);
        }

        return () => document.removeEventListener('keydown', esc);
    }, [visible]);
    return visible ? <Portal>
        {children}
    </Portal> : null;
}

const onEscape = (toggle) => (e) => {
    if (e.key === 'Escape') {
        toggle();
    }
}

export default Modal;