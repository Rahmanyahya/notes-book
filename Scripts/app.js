// Import components
import '../components/AppHeader.js';
import '../components/NoteForm.js';
import '../components/NoteCard.js';

// Render notes
function renderNotes() {
    const container = document.getElementById('notesContainer');
    container.innerHTML = '';
    
    notesData.forEach(note => {
        const noteCard = document.createElement('note-card');
        noteCard.setAttribute('title', note.title);
        noteCard.setAttribute('body', note.body);
        noteCard.setAttribute('created-at', note.createdAt);
        container.appendChild(noteCard);
    });
}

// Handle new note submission
document.addEventListener('note-submitted', (e) => {
    const newNote = {
        id: 'note-' + Date.now(),
        ...e.detail,
        archived: false
    };
    notesData.unshift(newNote);
    renderNotes();
});

// Initial render
renderNotes();