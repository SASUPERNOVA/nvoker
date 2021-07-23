(() => {
    class Modal extends WebComponent {
        constructor() {
            super('components/Modal/Modal.html');
        }

        get parent() {
            return this._parent;
        }

        set parent(parentNode) {
            this._parent = parentNode;
        }
    }

    customElements.define('modal-component', Modal);
})();