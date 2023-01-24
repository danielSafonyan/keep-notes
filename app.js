// v4 is used to generate uuid for new notes
import { v4 } from 'https://cdn.skypack.dev/uuid'

class App {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || []
        this.selectedNote = ''

        this.$modal = document.getElementById('modal')
        this.$form = document.getElementById('form')
        this.$noteTitle = document.getElementById('note-title')
        this.$noteText = document.getElementById('note-text')
        this.$formBtns = document.getElementById('form-buttons')
        this.$formCloseBtn = document.getElementById('form-close-button')
        this.$notes = document.getElementById('notes')
        this.$placeHolder = document.getElementById('placeholder')
        this.$colorTooltip = document.getElementById('color-tooltip')
        this.$placeholder = document.getElementById('placeholder')

        this.applyEventListners()
        this.displayNotes()
    }

    openForm(event) {
        this.$noteTitle.style.display = 'block'
        this.$formBtns.style.display = 'block'
    }

    closeForm(event) {
        this.$noteTitle.style.display = 'none'
        this.$formBtns.style.display = 'none'
    }

    handleFormClick(event) {
        if (event.target === this.$formCloseBtn) {
            this.closeForm()
        } else this.openForm(event)
    }

    handleNoteClick(event) {
        const note = event.target.closest('.note')
        if(!note) return 

        if (event.target.matches('.fa-trash-can')) this.deleteNote(note.dataset.id)
        else if (event.target.matches('.fa-paint-roller')) this.openNoteColorTooltip(event)
        else this.editNoteText(note)
    }

    deleteNote(noteId) {
        this.notes = this.notes.filter(el => el.id !== noteId)
        this.displayNotes()
        this.saveLocalStorage()
    }
    
    editNoteText(note) {
        this.selectedNote = note
        this.openModal()
    }

    openNoteColorTooltip(event) {
        this.selectedNote = event.target.closest('.note')
        const { x, y } = event
        this.$colorTooltip.style.display = 'flex'
        this.$colorTooltip.style.top = y + 10
        this.$colorTooltip.style.left = x + 10
    }

    editNoteColor(event) {
        if (!event.target.matches('.color-option')) return
        const noteId = this.selectedNote.dataset.id
        const color = event.target.dataset.color
        if (color) this.selectedNote.style.background = color
        console.log(noteId, color)

        this.notes = this.notes.map(el => el.id === noteId ? {
            ...el,
            color
        } : el)
        this.saveLocalStorage()
    }

    closeColorTooltip() {
        this.$colorTooltip.style.display = 'none'
    }

    applyEventListners() {
        document.addEventListener('click', event => {
            if (event.target.closest('#color-tooltip')) {
                this.editNoteColor(event)
            } else { this.closeColorTooltip()}

            if (this.$form.contains(event.target)) { this.handleFormClick(event) }
            if (event.target.closest('.note')) { this.handleNoteClick(event) }
        })

        this.$form.addEventListener('submit', event => {
            event.preventDefault()
            const [title, text] = [this.$noteTitle.value, this.$noteText.value]
            if (!(title || text)) return
            this.notes.push({
                title,
                text,
                color: '#fff',
                id: v4()
            })
            this.closeForm()
            this.$form.reset()
            this.displayNotes()
            this.saveLocalStorage()
            
        })

        document.querySelector('.modal-close-button').addEventListener('click', (event) => {
            this.closeModal()
        })
    }


    openModal() {
        const [modalTtitle, modalText] = this.$modal.children[0].children
        const [noteTtitle, noteText] = this.selectedNote.children
        modalTtitle.value = noteTtitle.textContent
        modalText.value = noteText.textContent
        this.$modal.classList.toggle('open-modal')
    }

    closeModal() {
        const [modalTtitle, modalText] = this.$modal.children[0].children
        const [title, text] = [modalTtitle.value, modalText.value]
        const noteId = this.selectedNote.dataset.id

        this.notes = this.notes.map(el => el.id === noteId ? {
            ...el,
            title,
            text
        } : el)
        this.$modal.classList.toggle('open-modal')
        this.displayNotes()
        this.saveLocalStorage()
    }

    saveLocalStorage() {
        localStorage.setItem('notes', JSON.stringify(this.notes))
    }

    displayNotes() {
    const hasNotes = this.notes.length > 0;
    this.$placeholder.style.display = hasNotes ? "none" : "flex";

    this.$notes.innerHTML = this.notes
      .map(
        note => `
        <div style="background: ${note.color};" class="note" data-id="${
          note.id
        }">
          <div class="${note.title && "note-title"}">${note.title}</div>
          <div class="note-text">${note.text}</div>
          <div class="toolbar-container">
            <div class="toolbar">
              <i class="fa-solid fa-paint-roller"></i>
              <i class="fa-solid fa-trash-can"></i>
            </div>
          </div>
        </div>
     `
      )
      .join("");
  }
}

new App()