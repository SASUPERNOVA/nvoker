(() => {
    class SiteView extends WebComponent {
        constructor() {
            super('components/SiteView/SiteView.html');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.props = {
                modalRoot: document.querySelector('#modal-root'),
                siteViewGrid: this.shadowRoot.querySelector('#site-view-grid')
            }
            this.shadowRoot.querySelector('#add-site-button').addEventListener('click', (_ev) => this.showAddModal());
            this.loadSites('test');
        }

        showAddModal() {
            const addSiteModal = document.createElement('text-input-modal');
            addSiteModal.setModal('Enter a Category Name');
            this.props.modalRoot.appendChild(addSiteModal);
            addSiteModal.addEventListener('confirm', (ev) => this.onAddModalConfirm(ev));
        }

        onAddModalConfirm(ev) {
            console.log(ev.detail);
            nvokerAPI.addSite('test', 'https://www.google.gr');
            //nvokerAPI.addSite(ev.detail);
            //this.loadSites();
        }
        
        async loadSites(category) {
            for (const [url, title] of Object.entries(await nvokerAPI.loadSites(category))) {
                const imageLink = document.createElement('image-link');
                this.props.siteViewGrid.appendChild(imageLink);
                imageLink.setImageLink(url, `userData/categories/test/${title}.png`, title, title);
            }
        }
    }

    customElements.define('site-view', SiteView);
})();