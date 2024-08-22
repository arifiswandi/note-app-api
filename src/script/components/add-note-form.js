class AddNoteForm extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `
          <style>
                .floating-form {
                    background-color: white;
                    padding: 16px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
                }
                .floating-form h2 {
                    font-size: 1.6em;
                    font-weight: 700;
                    text-transform: uppercase;
                    text-align: center;
                }
                
                form {
                    background-color: #ffffff;
                }

                .row-control {
                    display: flex;
                    flex-direction: column;
                }

                input, textarea {
                    padding: 10px; 
                    font-size: 1rem;
                    border: 2px solid blue; 
                    background-color: transparent;
                    outline: none;
                }

                input::placeholder, textarea::placeholder {
                    color: #aaa;
                }

                .row-control label {
                    font-size: 1em;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: cornflowerblue;

                    white-space: nowrap;
                }

                .submit {
                    width: 100%;
                    padding: 1rem 2rem;
                    font-size: 2rem;
                    text-transform: uppercase;
                    color: #fff;
                    background-color: blue; 
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.3s; 
                }

                .submit:hover {
                    background-color: green;
                }

                input.error, textarea.error {
                    border-color: #ff4d4d;
                }

                .error-message {
                    color: #ff4d4d;
                    font-size: 1.4rem;
                    margin-top: 0.5rem;
                    visibility: hidden;
                }
       
          </style>

          <div class="floating-form">
            <div>
                <h2>Abadikan Catatan Kamu</h2>
            </div>
            <form id="addNoteForm">
                <div class="row-control">
                    <label for="text">Judul</label>
                    <input type="text" id="text" placeholder="Masukkan Judul Catatan" spellcheck="false">
                    <div id="titleError" class="error-message"></div>
                </div>
                <div class="row-control">
                    <label for="desc">Deskripsi</label>
                    <textarea id="desc" placeholder="Masukkan Deskripsi Catatan" rows="4" spellcheck="false"></textarea>
                    <div id="descError" class="error-message"></div>
                </div>
                <button type="submit" class="submit">Tambahkan</button>
            </form>
          </div>         
      
      `;

    shadow.appendChild(template.content.cloneNode(true));

    shadow.querySelector('.submit').addEventListener('click', this.handleSubmit.bind(this));

    const titleInput = shadow.querySelector('#text');
    titleInput.addEventListener('input', () => {
      this.validateInput(titleInput, 'titleError', 'Judul tidak boleh kosong');
    });

    const descInput = shadow.querySelector('#desc');
    descInput.addEventListener('input', () => {
      this.validateInput(descInput, 'descError', 'Deskripsi tidak boleh kosong');
    });

    titleInput.addEventListener('mouseover', () => {
      if (!titleInput.value.trim()) {
        this.showPopup(titleInput, 'titleError', 'Harap isi judul catatan.');
      } else {
        this.hidePopup(titleInput, 'titleError');
      }
    });

    descInput.addEventListener('mouseover', () => {
      if (!descInput.value.trim()) {
        this.showPopup(descInput, 'descError', 'Harap isi deskripsi catatan.');
      } else {
        this.hidePopup(descInput, 'descError');
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const titleInput = this.shadowRoot.getElementById('text');
    const descInput = this.shadowRoot.getElementById('desc');

    const isValid = this.validateForm();

    if (isValid) {
      this.dispatchEvent(
        new CustomEvent('add-note', {
          detail: {
            title: titleInput.value.trim(),
            body: descInput.value.trim(),
          },
        })
      );

      titleInput.value = '';
      descInput.value = '';
    }
  }

  validateForm() {
    const titleInput = this.shadowRoot.getElementById('text');
    const descInput = this.shadowRoot.getElementById('desc');

    let isValid = true;

    if (!titleInput.value.trim()) {
      this.setError(titleInput, 'titleError', 'Judul tidak boleh kosong');
      this.showPopup(titleInput, 'titleError', 'Harap isi judul catatan.');
      isValid = false;
    } else {
      this.clearError(titleInput, 'titleError');
    }

    if (!descInput.value.trim()) {
      this.setError(descInput, 'descError', 'Deskripsi tidak boleh kosong');
      this.showPopup(descInput, 'descError', 'Harap isi deskripsi catatan.');
      isValid = false;
    } else {
      this.clearError(descInput, 'descError');
    }

    return isValid;
  }

  showPopup(input, errorId, message) {
    const errorElement = this.shadowRoot.getElementById(errorId);
    errorElement.textContent = message;
    errorElement.style.visibility = 'visible';
  }

  hidePopup(input, errorId) {
    const errorElement = this.shadowRoot.getElementById(errorId);
    errorElement.textContent = '';
    errorElement.style.visibility = 'hidden';
  }

  setError(input, errorId, errorMessage) {
    input.classList.add('error');
    const errorElement = this.shadowRoot.getElementById(errorId);
    errorElement.textContent = errorMessage;
  }

  clearError(input, errorId) {
    input.classList.remove('error');
    const errorElement = this.shadowRoot.getElementById(errorId);
    errorElement.textContent = '';
  }

  validateInput(input, errorId) {
    if (!input.value.trim()) {
      this.setError(input, errorId, 'Kolom ini tidak boleh kosong');
    } else {
      this.clearError(input, errorId);
    }
  }
}

customElements.define('add-note-form', AddNoteForm);
