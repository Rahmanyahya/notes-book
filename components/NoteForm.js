class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin-bottom: 2rem;
                }
                .note-form {
                    background: white;
                    padding: 2rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .form-group {
                    margin-bottom: 1rem;
                }
                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: bold;
                }
                input, textarea {
                    width: 100%;
                    padding: 0.5rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 1rem;
                }
                textarea {
                    min-height: 150px;
                    resize: vertical;
                }
                .error {
                    color: #e74c3c;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                    display: none;
                }
                button {
                    background-color: #2c3e50;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1rem;
                }
                button:hover {
                    background-color: #34495e;
                }
            </style>
            <form class="note-form">
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" id="title" required minlength="3">
                    <div class="error">Title must be at least 3 characters long</div>
                </div>
                <div class="form-group">
                    <label for="body">Note Content</label>
                    <textarea id="body" required minlength="10"></textarea>
                    <div class="error">Content must be at least 10 characters long</div>
                </div>
                <button type="submit">Add Note</button>
            </form>
        `;
    }

    setupListeners() {
        const form = this.shadowRoot.querySelector('form');
        const titleInput = this.shadowRoot.querySelector('#title');
        const bodyInput = this.shadowRoot.querySelector('#body');

        const validateInput = (input, minLength) => {
            const error = input.nextElementSibling;
            if (input.value.length < minLength && input.value.length > 0) {
                error.style.display = 'block';
                return false;
            }
            error.style.display = 'none';
            return true;
        };

        titleInput.addEventListener('input', () => validateInput(titleInput, 3));
        bodyInput.addEventListener('input', () => validateInput(bodyInput, 10));

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateInput(titleInput, 3) && validateInput(bodyInput, 10)) {
                const event = new CustomEvent('note-submitted', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        title: titleInput.value,
                        body: bodyInput.value,
                        createdAt: new Date().toISOString()
                    }
                });
                this.dispatchEvent(event);
                form.reset();
            }
        });
    }
}

customElements.define('note-form', NoteForm);