class WebComponent extends HTMLElement {
    constructor(path, templateId) {
        super();
        this.path = path;
        this.templateId = templateId;
    }

    async _loadTemplateFile() {
        const parser = new DOMParser();
        const htmlFile = await (await fetch(this.path)).text();
        const vPage = parser.parseFromString(htmlFile, 'text/html');
    
        const template = this.templateId ? vPage.getElementById(this.templateId) : vPage.querySelector('template');
        const templateContent = template.content;
        const styles = vPage.querySelectorAll('link');
    
        return { templateContent, styles };
    }

    async _initComponent() {
        let { templateContent, styles } = await this._loadTemplateFile();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        for (const style of styles) {
            shadowRoot.appendChild(style.cloneNode(false));
        }
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }

    async connectedCallback() {
        if (!this.shadowRoot) {
            await this._initComponent();
        }
    }

    hostComponent() {
        return this.getRootNode().host;
    }

    genURefId() {
        let refId = new Uint8Array(16);
        crypto.getRandomValues(refId);
        refId[6] = 64 + (refId[6] & ((1 << 4) - 1));
        refId[8] = 128 + (refId[8] & ((1 << 6) - 1));
        refId = Array.from(refId).map(byte => byte.toString(16).padStart(2, '0'));
        refId = `${refId.slice(0, 4).join('')}-${refId.slice(4, 6).join('')}-${refId.slice(6, 8).join('')}-${refId.slice(8, 10).join('')}-${refId.slice(10).join('')}`;
        return refId;
    }

    setRefId(refId) {
        if (!this.hasAttribute('ref-id')) {
            this.setAttribute('ref-id', refId);
        }
    }

    onShadowRootReady(callback) {
        const timer = setInterval(() => {
            if (!this.shadowRoot) {
                return;
            }
            callback();
            clearInterval(timer);
        }, 1);
    }

    get refId() {
        return this.getAttribute('ref-id');
    }
}