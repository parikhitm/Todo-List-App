import { todayTasksButton, addTaskButton, addNoteButton, notesButton, next7DaysTasksButton, importantTasksButton, allTasksButton, viewAllNotes, darkThemeOption } from './dom.js';
import { highlightSelectedButton } from './navigation.js';
import { openAddNoteModal, renderAllNotes } from './notes.js';
import { addProject, getAllProjectNames, renderProjectList, saveProject } from './projects.js';
import { selectedProject } from './state.js';
import { updateTask, addTask, resetPageStyle, renderTasksDueToday, renderTasksForNext7Days, renderImportantTasks, renderAllTasks, deleteTask } from './tasks.js';

// Function to set up event handlers
export function setupEventHandlers() {
  addTaskButton.addEventListener("click", handleAddTaskClick);
}

// Handler for add task button
function handleAddTaskClick() {
  // Modal Overlay
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  // Modal Content Container
  const modalContent = document.createElement("div");
  modalContent.className = "add-task-modal-content";

  // Prevent clicks inside the modal content from closing the modal
  modalContent.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  modalOverlay.appendChild(modalContent);

  // Modal Title
  const modalTitle = document.createElement("h2");
  modalTitle.textContent = "Enter New Task Details:";

  // Task Title
  const taskTitle = document.createElement("input");
  taskTitle.type = "text";
  taskTitle.placeholder = "Task Title Here...";
  taskTitle.style.width = "68%";
  taskTitle.setAttribute("required", "");

  // Task Due Date
  const taskDueDate = document.createElement("input");
  taskDueDate.type = "date";
  taskDueDate.style.width = "25%";

  // Task Description
  const taskDescription = document.createElement("textarea");
  taskDescription.placeholder = "Task Description Here...";

  // Task Priority
  const taskPriority = document.createElement("select");

  const highPriority = document.createElement("option");
  highPriority.textContent = "High";
  highPriority.value = "high-priority";

  const mediumPriority = document.createElement("option");
  mediumPriority.textContent = "Medium";
  mediumPriority.value = "medium-priority";

  const lowPriority = document.createElement("option");
  lowPriority.textContent = "Low";
  lowPriority.value = "low-priority";

  taskPriority.append(highPriority, mediumPriority, lowPriority);


  // Task Project List
  const taskProject = document.createElement("select");

  const storedProjects = getAllProjectNames();
  storedProjects.forEach(projectName => {
    const projectOption = document.createElement("option");
    projectOption.textContent = projectName;
    projectOption.value = projectName;

    taskProject.appendChild(projectOption);
  });
  // Create a new project option inside the select project option
  const addProjectOption = document.createElement("option");
  addProjectOption.textContent = "Add New Project";
  addProjectOption.value = "add-new-project";

  taskProject.appendChild(addProjectOption);

  // Event Listener for project selection
  taskProject.addEventListener("change", () => {
    if (taskProject.value === "add-new-project") {
      // Call addProject with a callback
      addProject((projectName) => {
      if (projectName) {
        // Add the new project to the select options
        const newOption = document.createElement("option");
        newOption.textContent = projectName;
        newOption.value = projectName;

        // Insert the new project before the "Add New Project" option
        taskProject.insertBefore(newOption, addProjectOption);
        taskProject.value = projectName; // Set selected value to newly created project
      } else {
        // Reset selection if cancelled
        taskProject.value = storedProjects[0] || addProjectOption.value;
      }
    });
  }
});

  // Save Task Button
  const saveTaskButton = document.createElement("button");
  saveTaskButton.textContent = "Save";
  saveTaskButton.style.backgroundColor = "rgb(42, 189, 103)";
  saveTaskButton.style.color = "white";

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";

  // Append all the items to the modal content
  modalContent.append(
    modalTitle,
    taskTitle,
    taskDueDate,
    taskDescription,
    taskPriority,
    taskProject,
    saveTaskButton,
    cancelButton
  );

  document.body.appendChild(modalOverlay);

  // Event listener to close modal when clicking outside the modal content
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      document.body.removeChild(modalOverlay);
    }
  });

  // Event Listener for the Save Task Button
  saveTaskButton.addEventListener("click", () => {
    const taskTitleText = taskTitle.value.trim();
    const taskDueDateText = taskDueDate.value.trim();
    const taskDescriptionText = taskDescription.value.trim();
    const taskPriorityText = taskPriority.value.trim();
    const taskProjectName = taskProject.value.trim();

    addTask(taskTitleText, taskDueDateText, taskDescriptionText, taskPriorityText, taskProjectName);
    
    document.body.removeChild(modalOverlay);
    resetPageStyle();
  });

  // Event Listener for the cancel button
  cancelButton.addEventListener("click", () => {
    document.body.removeChild(modalOverlay);
  });
}


// Function to open the edit task modal
export function openEditTaskModal(task) {
  // Create Edit task modal
  const editTaskModal = document.createElement("div");
  editTaskModal.className = "modal-overlay";

  // Modal Content Container
  const modalContent = document.createElement("div");
  modalContent.className = "edit-modal-content";
  editTaskModal.appendChild(modalContent);

  // Modal Heading
  const modalHeading = document.createElement("h2");
  modalHeading.textContent = "Edit the Task Details:";
  modalContent.appendChild(modalHeading);

  // Task Title
  const taskTitle = document.createElement("input");
  taskTitle.type = "text";
  taskTitle.value = task.title;
  modalContent.appendChild(taskTitle);

  // Task Due Data
  const taskDueDate = document.createElement("input");
  taskDueDate.type = "date";
  taskDueDate.value = task.dueDate;
  modalContent.appendChild(taskDueDate);

  // Task Description
  const taskDescription = document.createElement("textarea");
  taskDescription.value = task.description;
  modalContent.appendChild(taskDescription);

  // Task Priority
  const taskPriority = document.createElement("select");

  const priorities = ["High", "Medium", "Low"];
  priorities.forEach(priorityText => {
    const option = document.createElement("option");
    option.textContent = priorityText;
    option.value = priorityText.toLocaleLowerCase() + "-priority";

    // Set the selected option
    if (option.value === task.priority) {
      option.selected = true;
    }

    taskPriority.appendChild(option);
  });
  modalContent.appendChild(taskPriority);

  // Task Project
  const taskProject = document.createElement("select");

  const storedProjects = getAllProjectNames();
  storedProjects.forEach(projectName => {
    const projectOption = document.createElement("option");
    projectOption.textContent = projectName;
    projectOption.value = projectName;

    if (projectOption.value === task.project) {
      projectOption.selected = true;
    }

    taskProject.appendChild(projectOption);
  });
  // Create a new project option inside the select project option
  const addProjectOption = document.createElement("option");
  addProjectOption.textContent = "Add New Project";
  addProjectOption.value = "add-new-project";

  taskProject.appendChild(addProjectOption);

  // Event Listener for project selection
  taskProject.addEventListener("change", () => {
    if (taskProject.value === "add-new-project") {
      const newProjectName = prompt("Enter new project name:");
      if (newProjectName && newProjectName.trim() !== "") {
        saveProject(newProjectName.trim());
        renderProjectList();

        // Add the new project to the select options
        const newOption = document.createElement("option");
        newOption.textContent = newProjectName;
        newOption.value = newProjectName;
        // Insert the new project before the "Add New Project" option
        taskProject.insertBefore(newOption, addProjectOption);
        taskProject.value = newProjectName;
      } else {
        // Reset selection if no valid project name was entered
        taskProject.value = storedProjects[0];
      }
    }
  });

  modalContent.appendChild(taskProject);


  // Save Changes Button
  const saveChangesButton = document.createElement("button");
  saveChangesButton.textContent = "Save Changes";
  modalContent.appendChild(saveChangesButton);

  // Cancel Button
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  modalContent.appendChild(cancelButton);

  // Append the modal to the body
  document.body.appendChild(editTaskModal);

  // Event Listener for the buttons
  saveChangesButton.addEventListener("click", () => {
    const updatedTask = {
      id: task.id,
      title: taskTitle.value.trim(),
      dueDate: taskDueDate.value.trim(),
      description: taskDescription.value.trim(),
      priority: taskPriority.value.trim(),
      project: taskProject.value.trim(),
    };

    updateTask(updatedTask);
    document.body.removeChild(editTaskModal);
    resetPageStyle();
  });

  cancelButton.addEventListener("click", () => {
    document.body.removeChild(editTaskModal);
  });

  editTaskModal.addEventListener("click", (event) => {
    if (event.target === editTaskModal)
      document.body.removeChild(editTaskModal);
  });
}

// Event Listener to open the delete task modal
export function openDeleteTaskModal(task, confirmDelete) {
  // Modal Overlay
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  // Modal Content Container
  const modalContent = document.createElement("div");
  modalContent.className = "delete-modal-content";
  modalOverlay.appendChild(modalContent);

  // Prevent clicks inside the modal content from closing the modal
  modalContent.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  // Modal Heading
  const modalHeading = document.createElement("h2");
  modalHeading.textContent = "Do you really want to delete this task?";

  // Modal Paragraph
  const modalParagraph = document.createElement("p");
  modalParagraph.textContent = "This process is not reversible...";

  // Delete Button
  const yesButton = document.createElement("button");
  yesButton.textContent = "Yes";
  yesButton.style.backgroundColor = "rgb(42, 189, 103)";
  yesButton.style.color = "white";

  // Cancel Button
  const noButton = document.createElement("button");
  noButton.textContent = "No";

  modalContent.append(
    modalHeading,
    modalParagraph,
    noButton,
    yesButton
  );

  document.body.appendChild(modalOverlay);

  yesButton.addEventListener("click", () => {
    document.body.removeChild(modalOverlay);
    confirmDelete();
    deleteTask(task);
  });

  noButton.addEventListener("click", () => {
    document.body.removeChild(modalOverlay);
  });

  // Event listener to close modal when clicking outside the modal content
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      document.body.removeChild(modalOverlay);
    }
  });
}


// Event Listener for the Add Note Button
addNoteButton.addEventListener("click", () => {
  openAddNoteModal();
});


// Event Listener for the Notes Button for viewing all the notes
viewAllNotes.addEventListener("click", () => {
  renderAllNotes();
});


// Event listener for the Home button
allTasksButton.addEventListener("click", () => {
  selectedProject.projectName = "All Projects";
  renderAllTasks();
  highlightSelectedButton(allTasksButton);
});

// Event Listener for the Today Tasks Button
todayTasksButton.addEventListener("click", () => {
  renderTasksDueToday();
  highlightSelectedButton(todayTasksButton);
});

// Event Listener for the Next 7 Days Tasks Button
next7DaysTasksButton.addEventListener("click", () => {
  renderTasksForNext7Days();
  highlightSelectedButton(next7DaysTasksButton);
});

// Event Listener for the Important Tasks Button
importantTasksButton.addEventListener("click", () => {
  renderImportantTasks();
  highlightSelectedButton(importantTasksButton);
});

// Function to the open the delete note modal
export function openDeleteNoteModal(noteId, confirmDelete) {
  // Modal Overlay
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  // Modal Content Container
  const modalContent = document.createElement("div");
  modalContent.className = "delete-note-modal-content";
  modalOverlay.appendChild(modalContent);

  // Prevent clicks inside the modal content from closing the modal
  modalContent.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  // Modal Heading
  const modalHeading = document.createElement("h2");
  modalHeading.textContent = "Do you really want to delete this note?";

  // Modal Paragraph
  const modalParagraph = document.createElement("p");
  modalParagraph.textContent = "This process is not reversible...";

  // Delete Button
  const yesButton = document.createElement("button");
  yesButton.textContent = "Yes";
  yesButton.style.backgroundColor = "rgb(42, 189, 103)";
  yesButton.style.color = "white";

  // Cancel Button
  const noButton = document.createElement("button");
  noButton.textContent = "No";

  modalContent.append(
    modalHeading,
    modalParagraph,
    noButton,
    yesButton
  );

  document.body.appendChild(modalOverlay);

  yesButton.addEventListener("click", () => {
    document.body.removeChild(modalOverlay);
    confirmDelete(noteId);
  });

  noButton.addEventListener("click", () => {
    document.body.removeChild(modalOverlay);
  });

  // Event listener to close modal when clicking outside the modal content
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      document.body.removeChild(modalOverlay);
    }
  });
}


// Event Listener for the dark theme option
darkThemeOption.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
})