(()=> {
    class CategoryView extends WebComponent {
        constructor() {
            super('components/CategoryView/CategoryView.html');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('#add-category-button').addEventListener('click', (_ev) => this.showAddModal());
            this.addEventListener('add-category-modal-confirm', (ev) => this.onModalConfirm(ev));
        }

        showAddModal() {
            const addCategoryModal = document.createElement('add-category-modal');
            this.shadowRoot.appendChild(addCategoryModal);
        }
        
        onModalConfirm(ev) {
            console.log(ev.detail);
        }
    }

    customElements.define('category-view', CategoryView);
})();