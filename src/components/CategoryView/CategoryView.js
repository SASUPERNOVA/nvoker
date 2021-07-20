(()=> {
    class CategoryView extends WebComponent {
        constructor() {
            super('components/CategoryView/CategoryView.html');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('#add-category-button').addEventListener('click', (_ev) => this.showAddModal());
            this.addEventListener('add-category-modal-confirm', (ev) => this.onModalConfirm(ev));
            this.loadCategories();
        }
        
        async loadCategories() {
            this.shadowRoot.querySelector('#category-view-grid').textContent = '';
            for (const category of await nvokerAPI.loadCategories()) {
                this.createCategoryButton(category);  
            }
        }

        showAddModal() {
            const addCategoryModal = document.createElement('add-category-modal');
            this.shadowRoot.appendChild(addCategoryModal);
        }
        
        onModalConfirm(ev) {
            nvokerAPI.addCategory(ev.detail);
            this.loadCategories();
        }

        createCategoryButton(category) {
            const categoryButton = document.createElement('button');
            categoryButton.textContent = category;
            this.shadowRoot.querySelector('#category-view-grid').appendChild(categoryButton);
            categoryButton.addEventListener('click', (ev) => console.log(ev.target.value));
        }
    }

    customElements.define('category-view', CategoryView);
})();