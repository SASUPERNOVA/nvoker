(() => {
    class ImageLink extends WebComponent {
        constructor() {
            super('components/ImageLink/ImageLink.html');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.props = {
                linkButton: this.shadowRoot.querySelector('#link-button'),
                linkButtonImage: this.shadowRoot.querySelector('#link-button-image'),
                linkButtonOverlay: this.shadowRoot.querySelector('#link-button-overlay')
            }
            this.props.linkButton.addEventListener('click', (_ev) => this.onLinkButtonClick());
        }

        setImageLink(linkButton, linkButtonImage, linkButtonImageAlt, linkButtonOverlay) {
            this.onShadowRootReady(() => {
                this.props.linkButton.name = linkButton;
                this.props.linkButtonImage.src = linkButtonImage;
                this.props.linkButtonImage.alt = linkButtonImageAlt;
                this.props.linkButtonOverlay.textContent = linkButtonOverlay;
            });
        }

        onLinkButtonClick() {
            console.log(this.props.linkButton.name);
        }
    }

    customElements.define('image-link', ImageLink);
})();