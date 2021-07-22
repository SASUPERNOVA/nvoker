(() => {
    class SiteView extends WebComponent {
        constructor() {
            super('components/SiteView/SiteView.html');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.props = {
                modalRoot: document.querySelector('#modal-root')
            }
            this.shadowRoot.querySelector('#add-site-button').addEventListener('click', (_ev) => this.showAddModal());
        }

        showAddModal() {
            const addSiteModal = document.createElement('text-input-modal');
            addSiteModal.setModal('Enter a Category Name');
            this.props.modalRoot.appendChild(addSiteModal);
            addSiteModal.addEventListener('confirm', (ev) => this.onAddModalConfirm(ev));
        }

        onAddModalConfirm(ev) {
            console.log(ev.detail);
            //nvokerAPI.addSite(ev.detail);
            //this.loadSites();
        }
    }

    customElements.define('site-view', SiteView);
})();