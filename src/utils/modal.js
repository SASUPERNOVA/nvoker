let modalRef = null;

function pushModalRoot(tagName) {
    const modalRoot = document.querySelector('#modal-root');
    const element =document.createElement(tagName);
    modalRoot.appendChild(element);
    return element;
}

function popModalRoot() {
    const modalRoot = document.querySelector('#modal-root');
    modalRoot.children[modalRoot.children.length - 1].remove();
}