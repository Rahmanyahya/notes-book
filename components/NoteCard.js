class NoteCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isLoading = false;
  }

  static get observedAttributes() {
    return ['title', 'body', 'created-at', 'id', 'archived'];
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  setLoading(loading, button) {
    this.isLoading = loading;
    const buttons = this.shadowRoot.querySelectorAll('button');
    
    if (loading) {
      // Disable all buttons during loading
      buttons.forEach(btn => {
        btn.disabled = true;
        if (btn === button) {
          btn.classList.add('loading');
          // Change button text to "Loading..." for the clicked button
          const isArchiveBtn = btn.classList.contains('archive-btn');
          btn.textContent = 'Loading...';
        }
      });
    } else {
      // Restore original button text and state
      const archiveBtn = this.shadowRoot.querySelector('.archive-btn');
      const deleteBtn = this.shadowRoot.querySelector('.delete-btn');
      
      archiveBtn.textContent = this.getAttribute('archived') === 'true' ? 'Unarchive' : 'Archive';
      deleteBtn.textContent = 'Delete';
      
      buttons.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('loading');
      });
    }
  }

  setupListeners() {
    const archiveButton = this.shadowRoot.querySelector('.archive-btn');
    const deleteButton = this.shadowRoot.querySelector('.delete-btn');

    archiveButton.addEventListener('click', async () => {
      this.setLoading(true, archiveButton);
      
      // Add artificial delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const event = new CustomEvent('note-archive', {
        bubbles: true,
        composed: true,
        detail: {
          id: this.getAttribute('id'),
          archived: this.getAttribute('archived') === 'true',
        },
      });
      this.dispatchEvent(event);
    });

    deleteButton.addEventListener('click', async () => {
      this.setLoading(true, deleteButton);
      
      // Add artificial delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const event = new CustomEvent('note-delete', {
        bubbles: true,
        composed: true,
        detail: {
          id: this.getAttribute('id'),
        },
      });
      this.dispatchEvent(event);
    });
  }

  render() {
    const title = this.getAttribute('title');
    const body = this.getAttribute('body');
    const date = new Date(this.getAttribute('created-at')).toLocaleDateString();
    const archived = this.getAttribute('archived') === 'true';

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
          position: relative;
          transition: transform 0.2s ease;
        }
        .note-card:hover {
          transform: translateY(-2px);
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
        .actions {
          margin-top: 1rem;
          display: flex;
          gap: 0.5rem;
        }
        button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 100px;
        }
        .archive-btn {
          background-color: #3498db;
          color: white;
        }
        .delete-btn {
          background-color: #e74c3c;
          color: white;
        }
        button:hover:not(:disabled) {
          opacity: 0.9;
        }
        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .loading {
          position: relative;
          overflow: hidden;
        }
        .loading::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 1s infinite;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .note-card.loading {
          opacity: 0.7;
          pointer-events: none;
        }
      </style>
      <div class="note-card ${this.isLoading ? 'loading' : ''}">
        <h2>${title}</h2>
        <p>${body}</p>
        <small>Created: ${date}</small>
        <div class="actions">
          <button class="archive-btn">
            ${archived ? 'Unarchive' : 'Archive'}
          </button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
    `;
  }
}

customElements.define('note-card', NoteCard);