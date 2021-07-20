(() => {
    class AddCategoryModal extends WebComponent {
        constructor() {
            super('components/AddCategoryModal/AddCategoryModal.html');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.props = {
                exitButton: this.shadowRoot.querySelector('#exit-button'),
                modalInput: this.shadowRoot.querySelector('#modal-input'),
                confirmButton: this.shadowRoot.querySelector('#confirm-button')
            }

            this.props.exitButton.addEventListener('click', (_ev) => this.onExitButtonClick());
            this.props.confirmButton.addEventListener('click', (_ev) => this.onConfirm());
        }

        onExitButtonClick() {
            this.remove();
        }

        onConfirm() {
            this.hostComponent().dispatchEvent(new CustomEvent('add-category-modal-confirm', {detail: this.props.modalInput.value}));
            this.remove();
        }
    }

    customElements.define('add-category-modal', AddCategoryModal);
})();