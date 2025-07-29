let currentListId = null;
const API_BASE = 'http://localhost:8000';

async function loadLists() {
  try {
    const res = await fetch(`${API_BASE}/lists`);
    const lists = await res.json();
    const selector = document.getElementById('listContainer');
    selector.innerHTML = '';
    
    lists.forEach(list => {
      const option = document.createElement('option');
      option.value = list.id;
      option.textContent = list.name;
      selector.appendChild(option);
    });

    if (lists.length > 0) {
      currentListId = lists[0].id;
      selector.value = currentListId;
      loadNotes(currentListId);
    }
  } catch (error) {
    alert('Errore nel caricamento delle liste');
  }
}

async function loadNotes(listId) {
  if (!listId) return;
  
  try {
    const res = await fetch(`${API_BASE}/tasks?list_id=${listId}`);
    const notes = await res.json();
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';
    
    notes.forEach(note => {
      const div = document.createElement('div');
      div.className = 'col-md-6 col-lg-4 mb-3';
      div.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <p class="card-text">${note.title}</p>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" ${note.completed ? 'checked' : ''} 
                     onchange="toggleTask(${note.id})">
              <label class="form-check-label">
                ${note.completed ? 'Completata' : 'Da fare'}
              </label>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-sm btn-outline-primary" onclick="showEditModal(${note.id}, \`${note.title}\`)">
              Modifica
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteNote(${note.id})">
              Elimina
            </button>
          </div>
        </div>
      `;
      notesList.appendChild(div);
    });
  } catch (error) {
    alert('Errore nel caricamento delle note');
  }
}

async function toggleTask(id) {
  try {
    await fetch(`${API_BASE}/tasks/${id}/toggle`, {
      method: 'PATCH'
    });
    loadNotes(currentListId);
  } catch (error) {
    alert('Errore nel cambio stato della nota');
  }
}

function showEditModal(taskId, title) {
  document.getElementById('editNoteId').value = taskId;
  document.getElementById('editNoteContent').value = title;
  const modal = new bootstrap.Modal(document.getElementById('editNoteModal'));
  modal.show();
}

async function deleteNote(taskId) {
  if (!confirm('Sei sicuro di voler eliminare questa nota?')) return;
  
  try {
    await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'DELETE'
    });
    loadNotes(currentListId);
  } catch (error) {
    alert('Errore nell\'eliminazione della nota');
  }
}

async function createNewList() {
  const name = prompt('Nome della nuova lista:');
  if (!name) return;
  
  try {
    await fetch(`${API_BASE}/lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name })
    });
    loadLists();
  } catch (error) {
    alert('Errore nella creazione della lista');
  }
}

async function deleteCurrentList() {
  if (!currentListId) return;
  
  if (!confirm('Sei sicuro di voler eliminare questa lista?')) return;
  
  try {
    await fetch(`${API_BASE}/lists/${currentListId}`, {
      method: 'DELETE'
    });
    currentListId = null;
    loadLists();
    document.getElementById('notesList').innerHTML = '';
  } catch (error) {
    alert('Errore nell\'eliminazione della lista');
  }
}

document.getElementById('listContainer').addEventListener('change', function() {
  currentListId = this.value;
  loadNotes(currentListId);
});

document.getElementById('addNoteForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const title = document.getElementById('noteContent').value.trim();
  
  if (!title || !currentListId) return;

  try {
    await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title: title,
        list_id: parseInt(currentListId),
        completed: false
      })
    });

    document.getElementById('noteContent').value = '';
    loadNotes(currentListId);
  } catch (error) {
    alert('Errore nella creazione della nota');
  }
});

document.getElementById('editNoteForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const taskId = document.getElementById('editNoteId').value;
  const title = document.getElementById('editNoteContent').value.trim();
  
  if (!title) return;
  
  try {
    await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title })
    });
    
    bootstrap.Modal.getInstance(document.getElementById('editNoteModal')).hide();
    loadNotes(currentListId);
  } catch (error) {
    alert('Errore nella modifica della nota');
  }
});

window.onload = loadLists;