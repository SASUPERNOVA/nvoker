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

        async onAddModalConfirm(ev) {
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

        onAddSitePress (ev) {
            const {target} = ev;
        
            const cancelTimeout = () => {
                clearTimeout(holdTimeout);
                target.removeEventListener('mouseup', cancelTimeout);
                target.removeEventListener('mouseleave', cancelTimeout);
            }
        
            const holdTimeout = setTimeout(() => {
                this.showRemoveModal();
            }, 1000);
        
            target.addEventListener('mouseup', cancelTimeout);
            target.addEventListener('mouseleave', cancelTimeout);
        }

        onImageLinkClick(ev) {
            if (this.props.modalRoot.children.length != 0) {
                ev.target.classList.toggle('delete-site-selected');
                return;
            }
            const url = ev.target.getLink();
            console.log(url);
        }

        onImageLinkContextMenu(ev) {
            navigator.clipboard.writeText(ev.target.getLink());
        }

        showRemoveModal() {
            const removeCategoryModal = document.createElement('selection-modal');
            this.props.modalRoot.appendChild(removeCategoryModal);
            removeCategoryModal.addEventListener('confirm', (_ev) => this.onRemoveModalConfirm());
            removeCategoryModal.addEventListener('cancel', (_ev) => this.onRemoveCancel());
        }

        onRemoveModalConfirm() {
            const confirmationModal = document.createElement('confirmation-modal');
            this.props.modalRoot.appendChild(confirmationModal);
            confirmationModal.setModal('Delete Sites', 'Are you sure you want to delete the selected sites?');
            confirmationModal.setActions(() => this.onRemoveConfirm(), () => this.onRemoveCancel());
        }

        async onRemoveConfirm() {
            const sites = Array.from(this.props.siteViewGrid.children)
            .filter((element) => element.classList.contains('delete-site-selected'))
            .map((imageLink) => imageLink.getLink());
            await nvokerAPI.removeSites(this.props.currentCategory, sites);
            this.loadSites();
            console.log(sites);
            this.props.modalRoot.children[0].remove();
        }

        onRemoveCancel() {
            for (const site of Array.from(this.props.siteViewGrid.children)) {
                site.classList.toggle('delete-site-selected', false);
            }
            this.props.modalRoot.children[0].remove();
        }
    }

    customElements.define('site-view', SiteView);
})();