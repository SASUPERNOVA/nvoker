(() => {
    class TextInputModal extends WebComponent {
        constructor() {
            super('components/TextInputModal/TextInputModal.html');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.props = {
                modalLabel: this.shadowRoot.querySelector('#modal-label'),
                exitButton: this.shadowRoot.querySelector('#exit-button'),
                modalInput: this.shadowRoot.querySelector('#modal-input'),
                confirmButton: this.shadowRoot.querySelector('#confirm-button')
            }

            this.props.exitButton.addEventListener('click', (_ev) => this.onExitButtonClick());
            this.props.modalInput.addEventListener('keyup', (ev) => this.onKeyUp(ev));
            this.props.confirmButton.addEventListener('click', (_ev) => this.onConfirm());
        }

        onExitButtonClick() {
            this.remove();
        }

        onKeyUp(ev) {
            if (ev.key == 'Enter') {
                this.onConfirm();
            }
        }

        onConfirm() {
            this.dispatchEvent(new CustomEvent('confirm', {detail: this.props.modalInput.value}));
            this.remove();
        }

        setModal(modalLabel, confirmButton) {
            this.onShadowRootReady(() => {
                this.props.modalLabel.textContent = modalLabel ? modalLabel : this.props.modalLabel.textContent;
                this.props.confirmButton.textContent = confirmButton ? confirmButton : this.props.confirmButton.textContent;
            });
        }
    }

    customElements.define('text-input-modal', TextInputModal);
})();