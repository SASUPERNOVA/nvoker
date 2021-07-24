let modalRef = null;

function pushModalRoot(tagName) {
    const modalRoot = document.querySelector('#modal-root');
    const element = document.createElement(tagName);
    modalRoot.appendChild(element);
    return element;
}

function popModalRoot() {
    const modalRoot = document.querySelector('#modal-root');
    modalRoot.children[modalRoot.children.length - 1].remove();
}

function clearModalRoot() {
    document.querySelector('#modal-root').textContent = '';
}

function showTextInputModal({ label, button }, confirm) {
    const modal = pushModalRoot('text-input-modal');
    modal.setModal(label, button);
    modal.addEventListener('confirm', confirm);

    return modal;
}

function showSelectionModal(confirm, cancel) {
    const modal = pushModalRoot('selection-modal');
    modal.addEventListener('confirm', confirm);
    modal.addEventListener('cancel', cancel);

    return modal;
}

function showConfirmationModal({ title, message, optionA, optionB }, actionA, actionB) {
    const modal = pushModalRoot('confirmation-modal');
    modal.setModal(title, message, optionA, optionB);
    modal.setActions(actionA, actionB);

    return modal;
}