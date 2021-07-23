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
                modalRoot: document.querySelector('#modal-root'),
                siteViewGrid: this.shadowRoot.querySelector('#site-view-grid'),
                currentCategory: null
            }
            this.props.addSiteButton.addEventListener('click', (_ev) => this.showAddModal());
        }

        showAddModal() {
            const addSiteModal = document.createElement('text-input-modal');
            addSiteModal.setModal('Enter a Category Name');
            this.props.modalRoot.appendChild(addSiteModal);
            addSiteModal.addEventListener('confirm', (ev) => this.onAddModalConfirm(ev));
        }

        onAddModalConfirm(ev) {
            nvokerAPI.addSite(this.props.currentCategory, ev.detail);
            this.loadSites();
        }
        
        async loadSites(category) {
            this.props.currentCategory = category ? category : this.props.currentCategory;
            this.props.siteViewMenu.classList.toggle('inactive', false);
            this.props.siteViewGrid.textContent = '';
            for (const [url, title] of Object.entries(await nvokerAPI.loadSites(category))) {
                const imageLink = document.createElement('image-link');
                this.props.siteViewGrid.appendChild(imageLink);
                imageLink.setImageLink(url, `userData/Links/${category}/${new URL(url).hostname}.png`, title, title);
            }
        }
    }

    customElements.define('site-view', SiteView);
})();