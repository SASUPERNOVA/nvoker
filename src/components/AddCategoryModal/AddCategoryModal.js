(() => {
    class AddCategoryModal extends WebComponent {
        constructor() {
            super('components/AddCategoryModal/AddCategoryModal.html');
        }

        async connectedCallback() {
            await super.connectedCallback();
        }
    }

    customElements.define('add-category-modal', AddCategoryModal);
})();