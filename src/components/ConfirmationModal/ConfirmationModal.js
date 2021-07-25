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
                acceptButton: this.shadowRoot.querySelector('#option-a'),
                declineButton: this.shadowRoot.querySelector('#option-b')
            };

            if (nvokerAPI.platform() == 'win32') {
                this.shadowRoot.querySelector('#confirmation-options').insertBefore(this.props.declineButton, this.props.acceptButton);
            }
        }

        setModal(title, message, acceptButton, declineButton) {
            this.onShadowRootReady(() => {
                this.props.title.textContent = title ? title : this.props.title.textContent;
                this.props.message.textContent = message ? message: this.props.message.textContent;
                this.props.acceptButton.textContent = acceptButton ? acceptButton : this.props.acceptButton.textContent;
                this.props.declineButton.textContent = declineButton ? declineButton : this.props.declineButton.textContent;
            });
        }

        setActions(accept, decline) {
            this.onShadowRootReady(() => {
                this.props.acceptButton.addEventListener('click', accept);
                this.props.declineButton.addEventListener('click', decline);
            });
        }
    }

    customElements.define('confirmation-modal', ConfirmationModal);
})();