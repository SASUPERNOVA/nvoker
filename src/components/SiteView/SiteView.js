(() => {
    class SiteView extends WebComponent {
        constructor() {
            super('components/SiteView/SiteView.html');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.props = {
                siteViewMenu: this.shadowRoot.querySelector('#site-view-menu'),
                addSiteButton: this.shadowRoot.querySelector('#add-site-button'),
                siteViewGrid: this.shadowRoot.querySelector('#site-view-grid'),
                currentCategory: null
            }
            this.props.addSiteButton.addEventListener('click', (_ev) => showTextInputModal({
                label: 'Enter a URL'
            }, (ev) => this.onAddModalConfirm(ev)));
        }

        async onAddModalConfirm(ev) {
            popModalRoot();
            await nvokerAPI.addSite(this.props.currentCategory, ev.detail);
            this.loadSites();
        }
        
        async loadSites(category) {
            this.props.currentCategory = category ? category : this.props.currentCategory;
            this.props.siteViewMenu.classList.toggle('inactive', false);
            this.props.siteViewGrid.textContent = '';
            for (const [url, title] of Object.entries(await nvokerAPI.loadSites(this.props.currentCategory))) {
                const imageLink = document.createElement('image-link');
                this.props.siteViewGrid.appendChild(imageLink);
                imageLink.setImageLink(url, `userData/Links/${this.props.currentCategory}/${new URL(url).hostname}.png`, title, title);
                imageLink.addEventListener('mousedown', (ev) => this.onAddSitePress(ev));
                imageLink.addEventListener('click', (ev) => this.onImageLinkClick(ev));
                imageLink.addEventListener('contextmenu', (ev) => this.onImageLinkContextMenu(ev));
            }
        }

        onImageLinkClick(ev) {
            const selectionModal = document.querySelector('selection-modal');
            const confirmationModal = document.querySelector('confirmation-modal');
            if (selectionModal) {
                if (selectionModal.parent == this && !confirmationModal) {
                    ev.target.classList.toggle('delete-site-selected');
                }
                return;
            }
            nvokerAPI.goto(ev.target.getLink());
        }

        onAddSitePress (ev) {
            const {target} = ev;
        
            const cancelTimeout = () => {
                clearTimeout(holdTimeout);
                target.removeEventListener('mouseup', cancelTimeout);
                target.removeEventListener('mouseleave', cancelTimeout);
            }
        
            const holdTimeout = setTimeout(() => {
                if (!document.querySelector('selection-modal')) {
                    const selectionModal = showSelectionModal((_ev) => showConfirmationModal({
                        title: 'Delete Sites',
                        message: 'Are you sure you want to delete the selected sites?'
                    }, () => this.onRemoveConfirm(), () => this.onRemoveCancel()), (_ev) => this.onRemoveCancel());
                    selectionModal.parent = this;
                }
            }, 1000);
        
            target.addEventListener('mouseup', cancelTimeout);
            target.addEventListener('mouseleave', cancelTimeout);
        }

        onImageLinkContextMenu(ev) {
            navigator.clipboard.writeText(ev.target.getLink());
        }

        async onRemoveConfirm() {
            const sites = Array.from(this.props.siteViewGrid.children)
            .filter((element) => element.classList.contains('delete-site-selected'))
            .map((imageLink) => imageLink.getLink());
            await nvokerAPI.removeSites(this.props.currentCategory, sites);
            this.loadSites();
            clearModalRoot();
        }

        onRemoveCancel() {
            for (const site of Array.from(this.props.siteViewGrid.children)) {
                site.classList.toggle('delete-site-selected', false);
            }
            popModalRoot();
        }
    }

    customElements.define('site-view', SiteView);
})();