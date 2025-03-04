const BASE_URL = 'https://notes-api.dicoding.dev/v2';

class ApiService {
  static async getNotes() {
    const response = await fetch(`${BASE_URL}/notes`);
    const responseJson = await response.json();
    return responseJson.data;
  }

  static async getArchivedNotes() {
    const response = await fetch(`${BASE_URL}/notes/archived`);
    const responseJson = await response.json();
    return responseJson.data;
  }

  static async createNote({ title, body }) {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body }),
    });
    const responseJson = await response.json();
    return responseJson;
  }

  static async archiveNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
      method: 'POST',
    });
    return response.json();
  }

  static async unarchiveNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
      method: 'POST',
    });
    return response.json();
  }

  static async deleteNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }
}

export default ApiService;