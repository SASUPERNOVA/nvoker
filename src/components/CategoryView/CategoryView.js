(()=> {
    class CategoryView extends WebComponent {
        constructor() {
            super('components/CategoryView/CategoryView.html');
        }

        async connectedCallback() {
            await super.connectedCallback();
            this.props = {
                categoryViewGrid: this.shadowRoot.querySelector('#category-view-grid'),
                siteView: this.nextElementSibling
            }
            this.shadowRoot.querySelector('#add-category-button').addEventListener('click', (_ev) =>  showTextInputModal({
                label: "Enter a Category Name"
            }, (ev) => this.onAddModalConfirm(ev)));
            this.loadCategories();
        }
        
        async loadCategories() {
            this.props.categoryViewGrid.textContent = '';
            for (const category of await nvokerAPI.loadCategories()) {
                this.createCategoryButton(category);  
            }
        }

        createCategoryButton(category) {
            const categoryButton = document.createElement('button');
            categoryButton.textContent = category;
            this.props.categoryViewGrid.appendChild(categoryButton);
            categoryButton.addEventListener('mousedown', (ev) => this.onCategoryButtonPress(ev));
            categoryButton.addEventListener('click', (ev) => this.onCategoryButtonClick(ev));
        }

        onCategoryButtonClick(ev) {
            const selectionModal = document.querySelector('selection-modal');
            const confirmationModal = document.querySelector('confirmation-modal');
            if (selectionModal) {
                if (selectionModal.parent == this && !confirmationModal) {
                    ev.target.classList.toggle('delete-category-selected');
                }
                return;
            }
            const category = ev.target.textContent;
            this.props.siteView.loadSites(category);
        }

        onCategoryButtonPress (ev) {
            const {target} = ev;
        
            const cancelTimeout = () => {
                clearTimeout(holdTimeout);
                target.removeEventListener('mouseup', cancelTimeout);
                target.removeEventListener('mouseleave', cancelTimeout);
            }
        
            const holdTimeout = setTimeout(() => {
                if (!document.querySelector('selection-modal')) {
                    const selectionModal = showSelectionModal((_ev) => showConfirmationModal({
                        title: 'Delete Categories',
                        message: 'Are you sure you want to delete the selected categories?'
                    }, () => this.onRemoveConfirm(), () => this.onRemoveCancel()), (_ev) => this.onRemoveCancel());
                    selectionModal.parent = this;
                }
            }, 1000);
        
            target.addEventListener('mouseup', cancelTimeout);
            target.addEventListener('mouseleave', cancelTimeout);
        }
        
        onAddModalConfirm(ev) {
            nvokerAPI.addCategory(ev.detail);
            this.loadCategories();
            popModalRoot();
        }

        onRemoveModalConfirm() {
            const confirmationModal = pushModalRoot('confirmation-modal');
            confirmationModal.setModal('Delete Categories', 'Are you sure you want to delete the selected categories?');
            confirmationModal.setActions(() => this.onRemoveConfirm(), () => this.onRemoveCancel());
        }

        onRemoveConfirm() {
            const categories = Array.from(this.props.categoryViewGrid.children)
            .filter((element) => element.classList.contains('delete-category-selected'))
            .map(({ textContent }) => textContent);
            nvokerAPI.removeCategories(categories);
            this.loadCategories();
            if (categories.includes(this.props.siteView.props.currentCategory)) {
                this.props.siteView.loadSites(null);
            }
            clearModalRoot();
        }

        onRemoveCancel() {
            for (const category of Array.from(this.props.categoryViewGrid.children)) {
                category.classList.toggle('delete-category-selected', false);
            }
            popModalRoot();
        }
    }

    customElements.define('category-view', CategoryView);
})();