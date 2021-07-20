(()=> {
    class CategoryView extends WebComponent {
        constructor() {
            super('components/CategoryView/CategoryView.html');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('#add-category-button').addEventListener('click', this.toggleModal);
        }

        toggleModal() {
            const modal = document.querySelector('add-category-modal');
            if (modal) {
                modal.remove();
            }
            else {
                const addCategoryModal = document.createElement('add-category-modal');
                document.querySelector('#modal-root').appendChild(addCategoryModal);
            }
        }
    }

    customElements.define('category-view', CategoryView);
})();