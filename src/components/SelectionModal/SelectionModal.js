(()=> {
    class SelectionModal extends WebComponent {
        constructor() {
            super('components/SelectionModal/SelectionModal.html');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('#confirm-button').addEventListener('click', (_ev) => this.onConfirmClick());
            this.shadowRoot.querySelector('#cancel-button').addEventListener('click', (_ev) => this.onCancelClick());
        }

        onConfirmClick() {
            this.dispatchEvent(new CustomEvent('confirm'));
        }

        onCancelClick() {
            this.dispatchEvent(new CustomEvent('cancel'));
        }
    }

    customElements.define('selection-modal', SelectionModal);
})();