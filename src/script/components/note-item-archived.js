class NoteItemArchived extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _note = {
    id: null,
    title: null,
    body: null,
    createdAt: null,
    archived: null,
  };

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = '';
  }

  set note(value) {
    this._note = value;

    this.render();
  }

  get note() {
    return this._note;
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        border-radius: 8px;

        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
        overflow: hidden;
        padding: 20px;
        font-size: 12pt;
      }

      .card{
      }  

      .card #title{      
        line-height: 1px; 
        background-color: aqua;
      }
      .card #title, #body, #footer{     
        padding: 10px;      
      }

      .action{
        display: grid;
        grid-template-columns: ${'1fr '.repeat(2)};
        gap: 5px;
      }

      button {
        border: 0;
        padding: 5px;
        margin: 0 5px 0 0;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12pt;
      }

      .deleteNote {
        background-color: #A0153E;
        color: white;
      }

      .archiveNote {
        background-color: #FDAF7B;
        color: white;
      }

      .unarchiveNote {
        background-color: #EFBC9B;
        color: white;
      }

    `;
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div class="card">  
        <div id="title">        
          <h3>${this._note.title}</h3>
        </div>
        <div id="body">
          <p>${this._note.body}</p>
        </div>
        <div id="footer">
          <p>${this._note.createdAt}</p>
          <div class="action">
            <button class="deleteNote" data-id="${this._note.id}">Hapus</button>
            ${
              !this._note.archived
                ? `<button class="archiveNote" data-id="${this._note.id}">Arsipkan</button>`
                : `<button class="unarchiveNote" data-id="${this._note.id}">Kembalikan</button>`
            }
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('note-item-archived', NoteItemArchived);
