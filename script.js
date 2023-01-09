import { v4 } from 'https://cdn.skypack.dev/uuid'


class App {
    constructor() {
        this.notes = [{
                    id: 0,
                    title: 'Test Note Title',
                    text: 'Test Note Text',
                    color: '#fff'
                }]
        this.noteTitle = ''
        this.noteText = ''
        this.id = ''

        this.$modal = document.querySelector(".modal");
        this.$form = document.getElementById('form')
        this.$noteTitle = document.getElementById('note-title')
        this.$noteText = document.getElementById('note-text')
        this.$formButtons = document.getElementById('form-buttons')
        this.$notes = document.getElementById('notes')

        this.applyEventListners()
        this.displayNotes()
    }

    applyEventListners() {
        document.addEventListener('click', (event) => {
            this.handleFormClick(event)
            this.openModal(event)
        })

        this.$form.addEventListener('submit', event => {
            event.preventDefault()
            const formIsFilled = Boolean(this.$noteTitle.value && this.$noteText.value)
            if (formIsFilled) {
                this.notes.push({
                    id: v4(),
                    title: this.$noteTitle.value,
                    text: this.$noteText.value,
                    color: '#fff'
                })
                this.displayNotes()
                this.closeForm()
            }

        })
        document.querySelector('.modal-close-button').addEventListener('click', () => {
            this.editNote()
        })
    }

    handleFormClick(event) {
            const isWithinForm = this.$form.contains(event.target)
            const isCloseBtn = event.target.id === 'form-close-button'
            if (isWithinForm && isCloseBtn) {
                this.closeForm()
            } else if (isWithinForm) {
                this.openForm()
            } else {
                this.closeForm()
            }
    }

    editNote() {
        const editedNote = this.notes.findIndex(el => el.id == this.id)
        const [title, text] = this.$modal.children[0].children
        this.notes[editedNote] = {
            ...this.notes[editedNote],
            title: title.value,
            text: text.value
        }
        this.closeModal()
        this.displayNotes()
    }

    openModal(event) {
        if (!event.target.matches('.fa-pen-to-square')) return
        const noteId = event.target.closest('.note').dataset.id
        const note = this.notes.find(el => el.id == noteId)
        const { title, text } = note
        const [modalTitle, modalText] = this.$modal.children[0].children
        modalTitle.value = title
        modalText.value = text
        this.$modal.classList.toggle('open-modal')

        this.noteTitle = title
        this.noteText = text
        this.id = noteId
    }

    closeModal() {
        this.$modal.classList.toggle('open-modal')
    }

    displayNotes() {
        this.$notes.innerHTML = this.notes
      .map(
        note => `
        <div style="background: ${note.color};" class="note" data-id="${note.id}">
          <div class="${note.title && "note-title"}">${note.title}</div>
          <div class="note-text">${note.text}</div>
          <div class="toolbar-container">
            <div class="toolbar">
              <div><i class="fa-regular fa-pen-to-square"></i></div>
              <div><i class="fa-solid fa-paint-roller"></i></div> 
            </div>
          </div>
        </div>
     `
      )
      .join("");
    }

    openForm() {
        this.$form.classList.add("form-open");
        this.$noteTitle.style.display = 'block'
        this.$formButtons.style.display = 'block'
    }
    closeForm() {
        this.$form.classList.remove("form-open");
        this.$noteTitle.style.display = 'none'
        this.$formButtons.style.display = 'none'
    }
}

new App()