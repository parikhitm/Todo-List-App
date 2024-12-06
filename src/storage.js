// Function to save a task to localStorage
export function saveTask(task) {
    const projects = getProjectsFromStorage();

    // If the project doesn't exist, create it.
    if (!projects[task.project]) {
        projects[task.project] = [];
    }
    projects[task.project].push(task);
    localStorage.setItem("projects", JSON.stringify(projects));
  }
  
  // Function to get tasks from localStorage
  export function getTasksFromStorage(projectName) {
    const projects = getProjectsFromStorage();
    if (projectName === "All Projects") {
      let allTasks = [];
      for (const project in projects) {
        allTasks = allTasks.concat(projects[project]);
      }
      return allTasks;
    } else {
      return projects[projectName] || [];
    }
  }

  export function getProjectsFromStorage() {
    const projects = localStorage.getItem("projects");
    if (projects && projects !== "undefined") {
        return JSON.parse(projects);
    } else {
        // Return an object with the default project
        return {"Personal Tasks": [] };
    }
  }
  
  // Function to update tasks in localStorage
  export function updateTasksInStorage(projectName, tasks) {
    const projects = getProjectsFromStorage();
    projects[projectName] = tasks;
    localStorage.setItem("projects", JSON.stringify(projects));
  }

// Function for gett all the tasks from localStorage
export function getAllTasks() {
  const projects = getProjectsFromStorage();
  let allTasks = [];

  for (const projectName in projects) {
    allTasks = allTasks.concat(projects[projectName]);
  }

  return allTasks;
}

// Function to get all notes from localStorage
export function getAllNotes() {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  return notes;
}


  // Function to save a new note
export function saveNote(note) {
  const notes = getAllNotes();
  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Function to update an existing note
export function updateNote(updatedNote) {
  const notes = getAllNotes();
  const noteIndex = notes.findIndex(note => note.id === updatedNote.id);

  if (noteIndex !== -1) {
    notes[noteIndex] = updatedNote;
    localStorage.setItem("notes", JSON.stringify(notes));
  } else {
    alert("Note not found!");
  }
}


// Function to delete a note
export function deleteNote(noteId) {
  const notes = getAllNotes();
  const updatedNotes = notes.filter(note => note.id !== noteId);
  localStorage.setItem("notes", JSON.stringify(updatedNotes));
}