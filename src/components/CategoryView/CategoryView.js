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
            addCategoryModal.addEventListener('confirm', (ev) => this.onAddModalConfirm(ev));
        }

        showRemoveModal() {
            const removeCategoryModal = document.createElement('remove-category-modal');
            this.shadowRoot.appendChild(removeCategoryModal);
            removeCategoryModal.addEventListener('confirm', (_ev) => this.onRemoveModalConfirm());
        }
        
        onAddModalConfirm(ev) {
            nvokerAPI.addCategory(ev.detail);
            this.loadCategories();
        }

        onRemoveModalConfirm() {
            const confirmationModal = document.createElement('confirmation-modal');
            this.shadowRoot.appendChild(confirmationModal);
            confirmationModal.setModal('Delete Categories', 'Are you sure you want to delete the selected categories?');
            confirmationModal.setActions(() => this.onRemoveConfirm(), () => this.onRemoveCancel());
        }

        onRemoveConfirm() {
            console.log(this);
        }

        onRemoveCancel() {
            this.shadowRoot.querySelector('confirmation-modal').remove();
        }

        createCategoryButton(category) {
            const categoryButton = document.createElement('button');
            categoryButton.textContent = category;
            this.shadowRoot.querySelector('#category-view-grid').appendChild(categoryButton);
            categoryButton.addEventListener('mousedown', (ev) => this.onCategoryButtonPress(ev));
            categoryButton.addEventListener('click', (ev) => this.onCategoryButtonClick(ev));
        }

        onCategoryButtonPress (ev) {
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

        onCategoryButtonClick(ev) {
            if (this.shadowRoot.querySelector('remove-category-modal')) {
                ev.target.classList.toggle('delete-category-selected');
                return;
            }
            const category = ev.target.textContent;
            console.log(category);
            //ipcRenderer.send('request-links', category);
        }
    }

    customElements.define('category-view', CategoryView);
})();