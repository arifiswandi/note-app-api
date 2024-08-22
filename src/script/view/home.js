import Swal from 'sweetalert2';
import { gsap } from 'gsap';

const baseUrl = 'https://notes-api.dicoding.dev/v2';

const home = () => {
  const searchFormElement = document.querySelector('search-bar');
  const noteListContainerElement = document.querySelector('#noteListContainer');
  const noteSearchErrorElement = noteListContainerElement.querySelector('note-search-error');
  const noteListElementNonArchived = noteListContainerElement.querySelector('note-list');
  const noteListElementArchived = noteListContainerElement.querySelector('note-list-archived');

  const showNote = async (query) => {
    showLoadingIndicator();

    try {
      const resultNonArchived = await getNoteNonArchived();
      const resultArchived = await getNoteArchived();

      if (!query) {
        displayResultNonArchived(resultNonArchived);
        displayResultArchived(resultArchived);
      } else {
        const resultSearchNonArchived = [];
        resultNonArchived.forEach((note) => {
          if (note.title.toLowerCase().includes(query) || note.body.toLowerCase().includes(query)) {
            resultSearchNonArchived.push(note);
          }
        });

        const resultSearchArchived = [];
        resultArchived.forEach((note) => {
          if (note.title.toLowerCase().includes(query) || note.body.toLowerCase().includes(query)) {
            resultSearchArchived.push(note);
          }
        });

        displayResultNonArchived(resultSearchNonArchived);
        displayResultArchived(resultSearchArchived);
      }

      showNoteList();
    } catch (error) {
      noteSearchErrorElement.textContent = error.message;
      showSearchError();
      Swal.fire({
        icon: 'error',
        title: 'Periksa kembali jaringan internet anda',
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      hideLoadingIndicator();
      gsap.from('note-list', { duration: 1, x: 50, opacity: 0 });
      gsap.from('note-list-archived', { duration: 1, x: -50, opacity: 0 });
    }
  };

  const getNoteNonArchived = async () => {
    const response = await fetch(`${baseUrl}/notes`);

    if (!(response.status >= 200 && response.status < 300)) {
      throw new Error(`Something went wrong`);
    }

    const responseJson = await response.json();
    const notes = responseJson;

    if (notes.length <= 0) {
      throw new Error(`Note is not found`);
    }

    return notes.data;
  };

  const getNoteArchived = async () => {
    const response = await fetch(`${baseUrl}/notes/archived`);

    if (!(response.status >= 200 && response.status < 300)) {
      throw new Error(`Something went wrong`);
    }

    const responseJson = await response.json();
    const notes = responseJson;

    if (notes.length <= 0) {
      throw new Error(`Note archived is not found`);
    }

    return notes.data;
  };

  const updateNoteStatusById = async (noteId, endpoint) => {
    try {
      const response = await fetch(`${baseUrl}/notes/${noteId}/${endpoint}`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.status === 'success') {
        if (endpoint === 'archive') {
          Swal.fire({
            icon: 'success',
            title: 'Catatan berhasil diarsipkan!',
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Catatan berhasil dikembalikan ke Catatan Saya!',
            showConfirmButton: false,
            timer: 1500,
          });
        }
        showNote();
      } else {
        console.error(`Error ${endpoint === 'archive' ? 'archiving' : 'unarchiving'} note:`, data.message);
      }
    } catch (error) {
      console.error(`Error ${endpoint === 'archive' ? 'archiving' : 'unarchiving'} note:`, error);
    }
  };

  const deleteNoteById = (noteId) => {
    Swal.fire({
      title: "Anda Yakin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      cancelButtonColor: "red",
      confirmButtonColor: "blue",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${baseUrl}/notes/${noteId}`, {
            method: 'DELETE',
          });
          const data = await response.json();
          if (data.status === 'success') {
            Swal.fire({
              icon: 'success',
              title: 'Catatan berhasil dihapus!',
              showConfirmButton: false,
              timer: 1500,
            });
            showNote();
          } else {
            console.error('Error deleting note:', data.message);
          }
        } catch (error) {
          console.error('Error deleting note:', error);
        }
      }
    })
  };

  const addNote = async (inputTitle, inputBody) => {
    showLoadingIndicator();
    try {
      const response = await fetch(`${baseUrl}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: inputTitle,
          body: inputBody,
        }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Catatan berhasil ditambahkan!',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.error('Error adding note:', data.message);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      hideLoadingIndicator();
      showNote();
      document.querySelector('add-note-form').shadowRoot.querySelector('#addNoteForm #text').value = '';
      document.querySelector('add-note-form').shadowRoot.querySelector('#addNoteForm #desc').value = '';
      document.querySelector('add-note-form').shadowRoot.querySelector('#addNoteForm #text').focus();
    }
  };

  searchFormElement.addEventListener('search', (event) => {
    event.preventDefault();
    const { query } = event.detail;
    if (!query) {
      showNote();
    } else {
      showNote(query);
    }
  });

  const displayResultNonArchived = (notes) => {
    const noteItemElementsNonArchived = notes.map((note) => {
      const noteItemElementNonArchived = document.createElement('note-item');
      noteItemElementNonArchived.note = note;

      const shadowRoot = noteItemElementNonArchived.shadowRoot;
      const deleteButton = shadowRoot.querySelector('.deleteNote');
      if (deleteButton) {
        deleteButton.addEventListener('click', (event) => {
          const noteId = event.target.dataset.id;
          deleteNoteById(noteId);
        });
      }

      const archiveNote = shadowRoot.querySelector('.archiveNote');
      if (archiveNote) {
        archiveNote.addEventListener('click', (event) => {
          const noteId = event.target.dataset.id;
          updateNoteStatusById(noteId, 'archive');
        });
      }

      return noteItemElementNonArchived;
    });

    emptyElement(noteListElementNonArchived);
    noteListElementNonArchived.append(...noteItemElementsNonArchived);
  };

  const displayResultArchived = (notes) => {
    const noteItemElementsArchived = notes.map((note) => {
      const noteItemElementArchived = document.createElement('note-item-archived');
      noteItemElementArchived.note = note;

      const shadowRoot = noteItemElementArchived.shadowRoot;
      const deleteButton = shadowRoot.querySelector('.deleteNote');
      if (deleteButton) {
        deleteButton.addEventListener('click', (event) => {
          const noteId = event.target.dataset.id;
          deleteNoteById(noteId);
        });
      }

      const unarchiveNote = shadowRoot.querySelector('.unarchiveNote');
      if (unarchiveNote) {
        unarchiveNote.addEventListener('click', (event) => {
          const noteId = event.target.dataset.id;
          updateNoteStatusById(noteId, 'unarchive');
        });
      }

      return noteItemElementArchived;
    });

    emptyElement(noteListElementArchived);
    noteListElementArchived.append(...noteItemElementsArchived);
  };

  const showNoteList = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      hideElement(element);
    });
    showElement(noteListElementNonArchived);
    showElement(noteListElementArchived);
  };

  const showLoadingIndicator = () => {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.classList.add('loading-indicator');
    document.body.appendChild(loadingIndicator);
  };

  const hideLoadingIndicator = () => {
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
      document.body.removeChild(loadingIndicator);
    }
  };

  const showSearchError = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      hideElement(element);
    });
    showElement(noteSearchErrorElement);
  };

  const inputNoteElement = document.querySelector('add-note-form');
  if (inputNoteElement) {
    inputNoteElement.addEventListener('add-note', (event) => {
      const newNote = event.detail;
      addNote(newNote.title, newNote.body);
    });
  }

  const showElement = (element) => {
    element.style.display = 'block';
    element.hidden = false;
  };

  const hideElement = (element) => {
    element.style.display = 'none';
    element.hidden = true;
  };

  const emptyElement = (element) => {
    element.innerHTML = '';
  };

  document
    .querySelector('search-bar')
    .shadowRoot.querySelector('.search-form #btnRefresh')
    .addEventListener('click', () => {
      showNote();
      document.querySelector('search-bar').shadowRoot.querySelector('.search-form #name').value = '';
    });

  showNote();
};

export default home;
