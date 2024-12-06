import { addNoteButton, addTaskButton, allTaskContainer, allTaskContainerHeading } from "./dom";
import { openDeleteNoteModal } from "./eventHandlers";
import { deleteNote, getAllNotes, saveNote, updateNote } from "./storage";


// Function open a modal when clicking add note button
export function openAddNoteModal() {
    // Create the modal overlay
  const modalOverlay = document.createElement("div");
  modalOverlay.id = "add-note-modal";
  modalOverlay.className = "modal-overlay";

  // Modal content container
  const modalContent = document.createElement("div");
  modalContent.className = "add-note-modal-content";

  // Prevent clicks inside the modal content from closing the modal
  modalContent.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  //Modal Heading
  const modalHeading = document.createElement("h2");
  modalHeading.textContent = "Write the Note Details:";
  modalContent.appendChild(modalHeading);

  // Title Input
  const noteTitle = document.createElement("input");
  noteTitle.type = "text";
  noteTitle.placeholder = "Note Title";
  modalContent.appendChild(noteTitle);

  // Content Textarea
  const noteContent = document.createElement("textarea");
  noteContent.placeholder = "Your note...";
  modalContent.appendChild(noteContent);

  // Save Note Button
  const saveNoteButton = document.createElement("button");
  saveNoteButton.textContent = "Save Note";
  saveNoteButton.style.backgroundColor = "rgb(42, 189, 103)";
  saveNoteButton.style.color = "white";
  modalContent.appendChild(saveNoteButton);

  // Cancel Button
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  modalContent.appendChild(cancelButton);

  // Append modal content to overlay
  modalOverlay.appendChild(modalContent);

  // Append overlay to body
  document.body.appendChild(modalOverlay);

  // Event listener to close modal when clicking outside the modal content
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      document.body.removeChild(modalOverlay);
    }
  });

  // Event Listeners for Buttons
  saveNoteButton.addEventListener("click", () => {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    if (!title || !content) {
      alert("Please fill in all fields.");
      return;
    }

    const newNote = {
      id: Date.now(),
      title: title,
      content: content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveNote(newNote);
    renderAllNotes();
    document.body.removeChild(modalOverlay);
  });

  cancelButton.addEventListener("click", () => {
    document.body.removeChild(modalOverlay);
  });
}

// Function for rendering all notes to display on the screen
export function renderAllNotes() {
    // Clear existing notes
    allTaskContainer.innerHTML = "";
    allTaskContainerHeading.textContent = `All Notes:`;

    addNoteButton.style.display = "inline-block";
    addTaskButton.style.display = "none";
  
    // Get all notes
    const notes = getAllNotes();
  
    // Render each note
    notes.forEach(note => {
      renderNote(note);
    });
  }


//   function for rendering each note on the display
  export function renderNote(note) {
    // Note Container
    const noteContainer = document.createElement("div");
    noteContainer.className = "note-container";
    noteContainer.dataset.noteId = note.id; // For reference
  
    // Note Title
    const noteTitle = document.createElement("h3");
    noteTitle.className = "note-title";
    noteTitle.textContent = note.title;
  
    // Note Content
    const noteContent = document.createElement("p");
    noteContent.className = "note-content";
    noteContent.textContent = note.content;
  
    // Buttons Container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "note-buttons";
  
    // Edit Button
    const editButton = document.createElement("button");
    editButton.className = "note-button edit-note-button";
    editButton.textContent = "Edit";
  
    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.className = "note-button delete-note-button";
    deleteButton.textContent = "Delete";
  
    // Append buttons to container
    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(deleteButton);
  
    // Append elements to note container
    noteContainer.appendChild(noteTitle);
    noteContainer.appendChild(noteContent);
    noteContainer.appendChild(buttonsContainer);
  
    // Append note container to all notes container
    allTaskContainer.appendChild(noteContainer);

    allTaskContainer.style.gap = "20px";
    allTaskContainer.style.flexDirection = "row";
    allTaskContainer.style.alignItems = "none";
  
    // Event listeners for buttons
    editButton.addEventListener("click", () => {
      openEditNoteModal(note);
    });
  
    deleteButton.addEventListener("click", () => {
      deleteNoteHandler(note.id);
    });
  }


// Function for open a modal when clicking on the edit note button
  export function openEditNoteModal(note) {
    // Create the modal overlay
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "edit-note-modal";
    modalOverlay.className = "modal-overlay";
  
    // Modal content container
    const modalContent = document.createElement("div");
    modalContent.className = "edit-notes-modal-content";
  
    // Prevent clicks inside the modal content from closing the modal
    modalContent.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    // Modal Heading
    const modalHeading = document.createElement("h2");
    modalHeading.textContent = "Edit The Task Details:";
    modalContent.appendChild(modalHeading);
  
    // Title Input
    const noteTitle = document.createElement("input");
    noteTitle.type = "text";
    noteTitle.value = note.title;
    noteTitle.className = "note-title";
    modalContent.appendChild(noteTitle);
  
    // Content Textarea
    const noteContent = document.createElement("textarea");
    noteContent.value = note.content;
    noteContent.className = "note-content";
    modalContent.appendChild(noteContent);
  
    // Save Changes Button
    const saveChangesButton = document.createElement("button");
    saveChangesButton.textContent = "Save Changes";
    saveChangesButton.style.backgroundColor = "rgb(42, 189, 103)";
    saveChangesButton.style.color = "white";
    saveChangesButton.className = "modal-button save-changes-button";
    modalContent.appendChild(saveChangesButton);
  
    // Cancel Button
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.className = "modal-button cancel-button";
    modalContent.appendChild(cancelButton);
  
    // Append modal content to overlay
    modalOverlay.appendChild(modalContent);
  
    // Append overlay to body
    document.body.appendChild(modalOverlay);
  
    // Event listener to close modal when clicking outside the modal content
    modalOverlay.addEventListener("click", (event) => {
      if (event.target === modalOverlay) {
        document.body.removeChild(modalOverlay);
      }
    });
  
    // Event Listeners for Buttons
    saveChangesButton.addEventListener("click", () => {
      const title = noteTitle.value.trim();
      const content = noteContent.value.trim();
  
      if (!title || !content) {
        alert("Please fill in all fields.");
        return;
      }
  
      const updatedNote = {
        id: note.id,
        title: title,
        content: content,
        createdAt: note.createdAt,
        updatedAt: new Date().toISOString(),
      };
  
      updateNote(updatedNote);
      renderAllNotes();
      document.body.removeChild(modalOverlay);
    });
  
    cancelButton.addEventListener("click", () => {
      document.body.removeChild(modalOverlay);
    });
  }


//   Function for deleting a note when clicking on the delete note button
export function deleteNoteHandler(noteId) {
    // Confirm deletion
    openDeleteNoteModal(noteId, function(noteId) {
      deleteNote(noteId);
      renderAllNotes();
    });
}

