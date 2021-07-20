(() => {
    class Modal extends WebComponent {
        constructor() {
            super('components/Modal/Modal.html');
        }
    }

    customElements.define('modal-component', Modal);
})();