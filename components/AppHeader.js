class AppHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: #2c3e50;
                    color: white;
                    padding: 1rem;
                    text-align: center;
                }
                h1 {
                    margin: 0;
                    font-size: 2rem;
                }
            </style>
            <h1>${this.getAttribute('title') || 'Notes App'}</h1>
        `;
    }
}

customElements.define('app-header', AppHeader);