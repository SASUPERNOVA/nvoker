(() => {
    class ConfirmationModal extends WebComponent {
        constructor() {
            super('components/ConfirmationModal/ConfirmationModal.html');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.props = {
                title: this.shadowRoot.querySelector('#confirmation-title'),
                message: this.shadowRoot.querySelector('#confirmation-message'),
                optionA: this.shadowRoot.querySelector('#option-a'),
                optionB: this.shadowRoot.querySelector('#option-b')
            };
        }

        setModal(title, message, optionA, optionB) {
            this.onShadowRootReady(() => {
                this.props.title.textContent = title ? title : this.props.title.textContent;
                this.props.message.textContent = message ? message: this.props.message.textContent;
                this.props.optionA.textContent = optionA ? optionA : this.props.optionA.textContent;
                this.props.optionB.textContent = optionB ? optionB : this.props.optionB.textContent;
            });
        }

        setActions(actionA, actionB) {
            this.onShadowRootReady(() => {
                this.props.optionA.addEventListener('click', actionA);
                this.props.optionB.addEventListener('click', actionB);
            });
        }
    }

    customElements.define('confirmation-modal', ConfirmationModal);
})();