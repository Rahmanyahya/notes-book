import '../components/AppHeader.js';
import '../components/NoteForm.js';
import '../components/NoteCard.js';
import './api-service.js';

class App {
  constructor() {
    this.notes = [];
    this.isLoading = false;
    this.container = document.getElementById('notesContainer');
    this.loadingElement = this.createLoadingElement();
    this.LOADING_TIMEOUT = 1000; // 1 second delay for loading states
  }

  createLoadingElement() {
    const element = document.createElement('div');
    element.className = 'loading';
    element.style.textAlign = 'center';
    element.style.padding = '2rem';
    element.innerHTML = `
      <div class="loading-spinner" style="
        width: 40px;
        height: 40px;
        margin: 0 auto;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      "></div>
      <p style="margin-top: 1rem;">Loading...</p>
    `;

    // Add the keyframe animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    return element;
  }

  showLoading() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.container.innerHTML = '';
      this.container.appendChild(this.loadingElement);
    }
  }

  hideLoading() {
    if (this.isLoading && this.loadingElement.parentNode === this.container) {
      this.container.removeChild(this.loadingElement);
      this.isLoading = false;
    }
  }

  async loadNotes() {
    try {
      this.showLoading();
      // Add artificial delay
      await new Promise(resolve => setTimeout(resolve, this.LOADING_TIMEOUT));
      
      const response = await fetch('https://notes-api.dicoding.dev/v2/notes');
      const responseJson = await response.json();
      this.notes = responseJson.data;
      this.renderNotes();
    } catch (error) {
      console.error('Failed to load notes:', error);
      this.container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #e74c3c;">
          <p>Failed to load notes. Please try again later.</p>
        </div>
      `;
    } finally {
      // Add artificial delay before hiding loading
      await new Promise(resolve => setTimeout(resolve, this.LOADING_TIMEOUT));
      this.hideLoading();
    }
  }

  renderNotes() {
    this.container.innerHTML = '';
    
    if (this.notes.length === 0) {
      this.container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #666;">
          <p>No notes found. Create your first note!</p>
        </div>
      `;
      return;
    }

    this.notes.forEach(note => {
      const noteCard = document.createElement('note-card');
      noteCard.setAttribute('id', note.id);
      noteCard.setAttribute('title', note.title);
      noteCard.setAttribute('body', note.body);
      noteCard.setAttribute('created-at', note.createdAt);
      noteCard.setAttribute('archived', note.archived.toString());
      this.container.appendChild(noteCard);
    });
  }

  setupEventListeners() {
    document.addEventListener('note-submitted', async (e) => {
      try {
        this.showLoading();
        // Add artificial delay
        await new Promise(resolve => setTimeout(resolve, this.LOADING_TIMEOUT));
        
        const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(e.detail),
        });
        const responseJson = await response.json();
        if (responseJson.status === 'success') {
          await this.loadNotes();
        }
      } catch (error) {
        console.error('Failed to create note:', error);
        alert('Failed to create note. Please try again.');
      } finally {
        // Add artificial delay before hiding loading
        await new Promise(resolve => setTimeout(resolve, this.LOADING_TIMEOUT));
        this.hideLoading();
      }
    });

    document.addEventListener('note-archive', async (e) => {
      try {
        this.showLoading();
        // Add artificial delay
        await new Promise(resolve => setTimeout(resolve, this.LOADING_TIMEOUT));
        
        const { id, archived } = e.detail;
        const endpoint = archived ? 'unarchive' : 'archive';
        const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${id}/${endpoint}`, {
          method: 'POST',
        });
        const responseJson = await response.json();
        if (responseJson.status === 'success') {
          await this.loadNotes();
        }
      } catch (error) {
        console.error('Failed to archive/unarchive note:', error);
        alert('Failed to update note. Please try again.');
      } finally {
        // Add artificial delay before hiding loading
        await new Promise(resolve => setTimeout(resolve, this.LOADING_TIMEOUT));
        this.hideLoading();
      }
    });

    document.addEventListener('note-delete', async (e) => {
      try {
        if (!confirm('Are you sure you want to delete this note?')) {
          return;
        }
        
        this.showLoading();
        // Add artificial delay
        await new Promise(resolve => setTimeout(resolve, this.LOADING_TIMEOUT));
        
        const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${e.detail.id}`, {
          method: 'DELETE',
        });
        const responseJson = await response.json();
        if (responseJson.status === 'success') {
          await this.loadNotes();
        }
      } catch (error) {
        console.error('Failed to delete note:', error);
        alert('Failed to delete note. Please try again.');
      } finally {
        // Add artificial delay before hiding loading
        await new Promise(resolve => setTimeout(resolve, this.LOADING_TIMEOUT));
        this.hideLoading();
      }
    });
  }

  init() {
    this.setupEventListeners();
    this.loadNotes();
  }
}

const app = new App();
app.init();