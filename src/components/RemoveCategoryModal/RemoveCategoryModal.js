(()=> {
    class RemoveCategoryModal extends WebComponent {
        constructor() {
            super('components/RemoveCategoryModal/RemoveCategoryModal.html');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('#confirm-button').addEventListener('click', (_ev) => this.onConfirmClick());
            this.shadowRoot.querySelector('#cancel-button').addEventListener('click', (_ev) => this.onCancelClick());
        }

        onConfirmClick() {
            this.dispatchEvent(new CustomEvent('confirm'));
            this.remove();
        }

        onCancelClick() {
            this.dispatchEvent(new CustomEvent('cancel'));
        }
    }

    customElements.define('remove-category-modal', RemoveCategoryModal);
})();