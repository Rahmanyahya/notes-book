class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isLoading = false;
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
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 150px;
                }
                button:hover:not(:disabled) {
                    background-color: #34495e;
                }
                button:disabled {
                    background-color: #95a5a6;
                    cursor: not-allowed;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .loading-spinner {
                    width: 20px;
                    height: 20px;
                    border: 3px solid #ffffff;
                    border-top: 3px solid transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-right: 8px;
                    display: none;
                }
                .loading .loading-spinner {
                    display: inline-block;
                }
                .form-controls {
                    display: flex;
                    justify-content: flex-end;
                }
                input:disabled, textarea:disabled {
                    background-color: #f5f6f7;
                    cursor: not-allowed;
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
                <div class="form-controls">
                    <button type="submit">
                        <span class="loading-spinner"></span>
                        <span class="button-text">Add Note</span>
                    </button>
                </div>
            </form>
        `;
    }

    setLoading(loading) {
        this.isLoading = loading;
        const form = this.shadowRoot.querySelector('form');
        const button = this.shadowRoot.querySelector('button');
        const titleInput = this.shadowRoot.querySelector('#title');
        const bodyInput = this.shadowRoot.querySelector('#body');
        const buttonText = this.shadowRoot.querySelector('.button-text');

        if (loading) {
            button.classList.add('loading');
            buttonText.textContent = 'Saving...';
            button.disabled = true;
            titleInput.disabled = true;
            bodyInput.disabled = true;
        } else {
            button.classList.remove('loading');
            buttonText.textContent = 'Add Note';
            button.disabled = false;
            titleInput.disabled = false;
            bodyInput.disabled = false;
        }
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

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (validateInput(titleInput, 3) && validateInput(bodyInput, 10)) {
                // Set loading state
                this.setLoading(true);

                // Artificial delay to show loading state (1 second)
                await new Promise(resolve => setTimeout(resolve, 1000));

                const event = new CustomEvent('note-submitted', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        title: titleInput.value,
                        body: bodyInput.value,
                    }
                });
                this.dispatchEvent(event);
                form.reset();

                // Additional delay before removing loading state
                await new Promise(resolve => setTimeout(resolve, 1000));
                this.setLoading(false);
            }
        });
    }
}

customElements.define('note-form', NoteForm);