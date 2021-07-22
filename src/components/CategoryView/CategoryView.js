(()=> {
    class CategoryView extends WebComponent {
        constructor() {
            super('components/CategoryView/CategoryView.html');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.props = {
                categoryViewGrid: this.shadowRoot.querySelector('#category-view-grid'),
                modalRoot: document.querySelector('#modal-root')
            }
            this.shadowRoot.querySelector('#add-category-button').addEventListener('click', (_ev) => this.showAddModal());
            this.loadCategories();
        }
        
        async loadCategories() {
            this.props.categoryViewGrid.textContent = '';
            for (const category of await nvokerAPI.loadCategories()) {
                this.createCategoryButton(category);  
            }
        }

        showAddModal() {
            const addCategoryModal = document.createElement('add-category-modal');
            this.props.modalRoot.appendChild(addCategoryModal);
            addCategoryModal.addEventListener('confirm', (ev) => this.onAddModalConfirm(ev));
        }

        showRemoveModal() {
            const removeCategoryModal = document.createElement('remove-category-modal');
            this.props.modalRoot.appendChild(removeCategoryModal);
            removeCategoryModal.addEventListener('confirm', (_ev) => this.onRemoveModalConfirm());
            removeCategoryModal.addEventListener('cancel', (_ev) => this.onRemoveCancel());
        }
        
        onAddModalConfirm(ev) {
            nvokerAPI.addCategory(ev.detail);
            this.loadCategories();
        }

        onRemoveModalConfirm() {
            const confirmationModal = document.createElement('confirmation-modal');
            this.props.modalRoot.appendChild(confirmationModal);
            confirmationModal.setModal('Delete Categories', 'Are you sure you want to delete the selected categories?');
            confirmationModal.setActions(() => this.onRemoveConfirm(), () => this.onRemoveCancel());
        }

        onRemoveConfirm() {
            const categories = Array.from(this.props.categoryViewGrid.children)
            .filter((element) => element.classList.contains('delete-category-selected'))
            .map(({ textContent }) => textContent);
            nvokerAPI.removeCategories(categories);
            this.loadCategories();
            this.props.modalRoot.children[0].remove();
        }

        onRemoveCancel() {
            for (const category of Array.from(this.props.categoryViewGrid.children)) {
                category.classList.toggle('delete-category-selected', false);
            }
            this.props.modalRoot.children[0].remove();
        }

        createCategoryButton(category) {
            const categoryButton = document.createElement('button');
            categoryButton.textContent = category;
            this.props.categoryViewGrid.appendChild(categoryButton);
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
            if (this.props.modalRoot.children.length != 0) {
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