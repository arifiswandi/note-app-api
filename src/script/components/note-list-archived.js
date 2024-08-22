class NoteListArchived extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  _column = 3;
  _gutter = 5;

  static get observedAttributes() {
    return ['column', 'gutter'];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');

    this.render();
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
      }
        
      .wraper{        
        margin: 20px 0;
        background-color: white;

        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
      }

      .wraper #listTitle{  
        background-color: cornflowerblue;
        padding: 16px;
        text-transform: uppercase;
        line-height: 0px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
      }

      .list {
        padding: 16px;
        display: grid;
        grid-template-columns: ${'1fr '.repeat(this.column)};

        gap: ${this.gutter}px;
      }
    `;
  }

  set column(value) {
    const newValue = Number(value);
    if (!this._isValidInteger(newValue)) return;

    this._column = value;
  }

  get column() {
    return this._column;
  }

  set gutter(value) {
    const newValue = Number(value);
    if (!this._isValidInteger(newValue)) return;

    this._gutter = value;
  }

  get gutter() {
    return this._gutter;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = '';
  }

  _isValidInteger(newValue) {
    return Number.isNaN(newValue) || Number.isFinite(newValue);
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div class="wraper">
        <div id="listTitle">
          <h2>Arsip Catatan</h2>
        </div>
        <div class="list archived">
          <slot>Tidak ditemukan</slot>
        </div>
      </div>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'column':
        this.column = newValue;
        break;
      case 'gutter':
        this.gutter = newValue;
        break;
    }

    this.render();
  }
}

customElements.define('note-list-archived', NoteListArchived);
