(()=> {
    class CategoryView extends WebComponent {
        constructor() {
            super('components/CategoryView/CategoryView.html');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.shadowRoot.querySelector('#add-category-button').addEventListener('click', (_ev) => this.showAddModal());
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
            addCategoryModal.addEventListener('confirm', (ev) => this.onModalConfirm(ev));
        }

        showRemoveModal() {
            const removeCategoryModal = document.createElement('remove-category-modal');
            console.log(this);
            this.shadowRoot.appendChild(removeCategoryModal);
        }
        
        onModalConfirm(ev) {
            nvokerAPI.addCategory(ev.detail);
            this.loadCategories();
        }

        createCategoryButton(category) {
            const categoryButton = document.createElement('button');
            categoryButton.textContent = category;
            this.shadowRoot.querySelector('#category-view-grid').appendChild(categoryButton);
            categoryButton.addEventListener('mousedown', (ev) => this.onSideElementPressed(ev));
        }

        onSideElementPressed (ev) {
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
    }

    customElements.define('category-view', CategoryView);
})();