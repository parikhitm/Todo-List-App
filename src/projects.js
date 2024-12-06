import { addProjectButton, allTaskContainerHeading, projectList } from "./dom";
import { selectedProject } from "./state";
import { getProjectsFromStorage } from "./storage";
import { renderAllTasks } from "./tasks";
import { highlightSelectedButton } from './navigation.js';

// Function for adding new projects
export function addProject(callback) {

  // Modal Overlay
  const modalOverlay = document.createElement("div");
  modalOverlay.id = "add-project-modal";
  modalOverlay.className = "modal-overlay";

  // Modal Content Container
  const modalContent = document.createElement("div");
  modalContent.className = "add-project-modal-content";

  // Prevent clicks inside the modal content from closing the modal
  modalContent.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  // Modal Title
  const modalTitle = document.createElement("h2");
  modalTitle.textContent = "Enter new project name:";

  // Project Name Input Field
  const projectName = document.createElement("input");
  projectName.type = "text";
  projectName.placeholder = "Project name...";
  projectName.maxLength = 15;

  // Add Project Modal Save Button
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save Project";
  saveButton.style.backgroundColor = "rgb(42, 189, 103)";
  saveButton.style.color = "white";

  // Add Project Modal Cancel Button
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";

  // Append all the items to the modal content
  modalContent.append(
    modalTitle,
    projectName,
    saveButton,
    cancelButton
  );

  // Append the modal content to the modal overlay
  modalOverlay.appendChild(modalContent);

  // Append overlay to body
  document.body.appendChild(modalOverlay);

  // Event listener to close modal when clicking outside the modal content
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      document.body.removeChild(modalOverlay);
      if (callback) callback(null); // Call callback with null if cancelled
    }
  });

  // Event Listener for the save project button
  saveButton.addEventListener("click", () => {
    if (projectName.value.trim() !== "") {
      saveProject(projectName.value.trim());
      renderProjectList();
      document.body.removeChild(modalOverlay);
      if (callback) callback(projectName.value.trim()); // Call callback with new project name
    } else {
      alert("Please Write a valid project name...");
    }
  });

  // Event Listener for the cancel button
  cancelButton.addEventListener("click", () => {
    document.body.removeChild(modalOverlay);
    if (callback) callback(null); // Call callback with null if cancelled
  });
}

export function saveProject(projectName) {
    const projects = getProjectsFromStorage();
    if (!projects[projectName]) {
        projects[projectName] = [];
        localStorage.setItem("projects", JSON.stringify(projects));
    } else {
        alert("Project already exists!");
    }
}

// Function for getting all project names
export function getAllProjectNames() {
    const projects = getProjectsFromStorage();
    return Object.keys(projects);
}

export function renderProjectList() {
    projectList.innerHTML = ""; // Clear the list
    const projects = getAllProjectNames();

    projects.forEach(projectName => {
        const projectItem = document.createElement("li");
        projectItem.textContent = projectName;

        // Project Delete Button
        const projectDeleteButton = document.createElement("button");
        projectDeleteButton.textContent = "Delete";
        projectDeleteButton.className = "project-delete-button";
        
        // Event Listener For Viewing All the tasks for a particular project
        projectItem.addEventListener("click", () => {
            selectedProject.projectName = projectName;
            allTaskContainerHeading.textContent = `All Tasks - ${projectName}`;
            renderAllTasks();
            highlightSelectedButton(projectItem);
        });

        // Event Listener for deleting the project
        projectDeleteButton.addEventListener("click", () => {
            openDeleteProjectModal(projectName);
        });

        projectItem.appendChild(projectDeleteButton);
        projectList.appendChild(projectItem);
    });
}

// Attach event listener to the "Add Project" button

addProjectButton.addEventListener("click", () => {
    addProject();
});


// Function for Creating Delete Project Modal
export function openDeleteProjectModal(projectName) {
    // Create the modal overlay
  const modalOverlay = document.createElement("div");
  modalOverlay.id = "delete-project-modal";
  modalOverlay.className = "modal-overlay";

  // Modal content container
  const modalContent = document.createElement("div");
  modalContent.className = "delete-project-modal-content";

  // Prevent clicks inside the modal content from closing the modal
  modalContent.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  // Title
  const modalTitle = document.createElement("h2");
  modalTitle.textContent = `Do you really want to Delete Project "${projectName}"?`;
  modalContent.appendChild(modalTitle);

  // Message
  const modalMessage = document.createElement("p");
  modalMessage.textContent = "What would you like to do with the tasks associated in this project?";
  modalContent.appendChild(modalMessage);

  // Delete with tasks button
  const deleteWithTasksButton = document.createElement("button");
  deleteWithTasksButton.textContent = "Delete Project and Tasks";
  modalContent.appendChild(deleteWithTasksButton);

  // Transfer tasks to another project button
  const transferTasksButton = document.createElement("button");
  transferTasksButton.textContent = "Delete Project and Transfer Tasks";
  modalContent.appendChild(transferTasksButton);

  // Cancel button
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

  // Event listeners for buttons
  deleteWithTasksButton.addEventListener("click", () => {
    deleteProjectWithTasks(projectName);
    document.body.removeChild(modalOverlay);
  });

  transferTasksButton.addEventListener("click", () => {
    transferTasksFromProjectModal(projectName);
    document.body.removeChild(modalOverlay);
  });

  cancelButton.addEventListener("click", () => {
    document.body.removeChild(modalOverlay);
  });
}

export function deleteProjectWithTasks(projectName) {
    const projects = getProjectsFromStorage();
    delete projects[projectName];
    
    // Update localStorage
    localStorage.setItem("projects", JSON.stringify(projects));
    
    // If the deleted project was selected, reset to "All Projects"
    if (selectedProject.projectName === projectName) {
       selectedProject.projectName = "All Projects";
    }

    // Re-render the project list and tasks
    renderProjectList();
    renderAllTasks();
}


 export function transferTasksFromProjectModal(projectNameToDelete) {
    // Create the modal overlay
    const transferTasksModalOverlay = document.createElement("div");
    transferTasksModalOverlay.id = "transfer-tasks-modal";
    transferTasksModalOverlay.className = "modal-overlay";
  
    // Modal content container
    const transferTasksModalContent = document.createElement("div");
    transferTasksModalContent.className = "transfer-tasks-modal-content";
  
    // Prevent clicks inside the modal content from closing the modal
    transferTasksModalContent.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  
    // Title
    const modalTitle = document.createElement("h2");
    modalTitle.textContent = `Transfer Tasks from "${projectNameToDelete}"`;
    transferTasksModalContent.appendChild(modalTitle);
  
    // Message
    const modalMessage = document.createElement("p");
    modalMessage.textContent = "Select a project to transfer tasks to:";
    transferTasksModalContent.appendChild(modalMessage);
  
    // Project selection dropdown
    const projectSelect = document.createElement("select");
    const allProjects = getAllProjectNames().filter(name => name !== projectNameToDelete);
    
    allProjects.forEach(projectName => {
      const option = document.createElement("option");
      option.value = projectName;
      option.textContent = projectName;
      projectSelect.appendChild(option);
    });

    // Create a new project option inside the select project option
  const addProjectOption = document.createElement("option");
  addProjectOption.textContent = "Add New Project";
  addProjectOption.value = "add-new-project";
  
  projectSelect.appendChild(addProjectOption);

  // Event Listener for project selection
  projectSelect.addEventListener("change", () => {
    if (projectSelect.value === "add-new-project") {
      const newProjectName = prompt("Enter new project name:");
      if (newProjectName && newProjectName.trim() !== "") {
        saveProject(newProjectName.trim());
        renderProjectList();

        // Add the new project to the select options
        const newOption = document.createElement("option");
        newOption.textContent = newProjectName;
        newOption.value = newProjectName;
        // Insert the new project before the "Add New Project" option
        projectSelect.insertBefore(newOption, addProjectOption);
        projectSelect.value = newProjectName;
      } else {
        // Reset selection if no valid project name was entered
        projectSelect.value = allProjects[0];
      }
    }
  });
  
    transferTasksModalContent.appendChild(projectSelect);
  
    // Transfer button
    const transferTasksButton = document.createElement("button");
    transferTasksButton.textContent = "Transfer and Delete Project";
    transferTasksButton.className = "modal-button transfer-button";
    transferTasksModalContent.appendChild(transferTasksButton);
  
    // Cancel button
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.width = "25%";
    cancelButton.className = "modal-button cancel-button";
    transferTasksModalContent.appendChild(cancelButton);
  
    // Append modal content to overlay
    transferTasksModalOverlay.appendChild(transferTasksModalContent);
  
    // Append overlay to body
    document.body.appendChild(transferTasksModalOverlay);
  
    // Event listener to close modal when clicking outside the modal content
    transferTasksModalOverlay.addEventListener("click", (event) => {
      if (event.target === transferTasksModalOverlay) {
        document.body.removeChild(transferTasksModalOverlay);
      }
    });
  
    // Event listeners for buttons
    transferTasksButton.addEventListener("click", () => {
      const destinationProjectName = projectSelect.value;
      transferTasksAndDeleteProject(projectNameToDelete, destinationProjectName);
      document.body.removeChild(transferTasksModalOverlay);
    });
  
    cancelButton.addEventListener("click", () => {
      document.body.removeChild(transferTasksModalOverlay);
    });
  }

export function transferTasksAndDeleteProject(projectNameToDelete, destinationProjectName) {
    const projects = getProjectsFromStorage();

    const tasksToTransfer = projects[projectNameToDelete] || [];

    //Update the `project` property of each task to the new project name
    tasksToTransfer.forEach(task => {
        task.project = destinationProjectName;
      });

    // Add tasks to the destination project
    if (!projects[destinationProjectName]) {
        projects[destinationProjectName] = [];
    }

    projects[destinationProjectName] = projects[destinationProjectName].concat(tasksToTransfer);

    // Delete The Project
    delete projects[projectNameToDelete];

    // Update localStorage
    localStorage.setItem("projects", JSON.stringify(projects));

    // If the deleted project was selected, reset to "All Projects"
    if (selectedProject.projectName === projectNameToDelete) {
        selectedProject.projectName = "All Projects";
    }

    // Re-render the project list and tasks
    renderProjectList();
    renderAllTasks();
}