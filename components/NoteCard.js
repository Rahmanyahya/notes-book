class NoteCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['title', 'body', 'created-at'];
    }

    attributeChangedCallback() {
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const title = this.getAttribute('title');
        const body = this.getAttribute('body');
        const date = new Date(this.getAttribute('created-at')).toLocaleDateString();

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .note-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    height: 100%;
                }
                h2 {
                    margin: 0 0 0.5rem 0;
                    color: #2c3e50;
                    font-size: 1.25rem;
                }
                p {
                    margin: 0 0 1rem 0;
                    color: #666;
                }
                small {
                    color: #999;
                }
            </style>
            <div class="note-card">
                <h2>${title}</h2>
                <p>${body}</p>
                <small>Created: ${date}</small>
            </div>
        `;
    }
}

customElements.define('note-card', NoteCard);