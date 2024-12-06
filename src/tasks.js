import { addNoteButton, addTaskButton, allTaskContainer, allTaskContainerHeading } from './dom.js';
import { format, addDays, isAfter, isBefore, parseISO } from 'date-fns';
import { saveTask, getTasksFromStorage, updateTasksInStorage, getProjectsFromStorage, getAllTasks } from './storage.js';
import { selectedProject } from './state.js';
import { openDeleteTaskModal, openEditTaskModal } from './eventHandlers.js';

// Function to add a task
export function addTask(taskTitleText, taskDueDateText, taskDescriptionText, taskPriorityText, taskProjectName) {
    console.log(`Task Added: ${taskTitleText}, ${taskDueDateText}, ${taskDescriptionText}, ${taskPriorityText}, ${taskProjectName}`);
  
    if (taskTitleText === "") {
      alert("Please input a task title!");
      return;
    }
  
    if (taskDueDateText === "") {
      alert("Please enter a due date for your task!");
      return;
    }
    if (taskDescriptionText === "") {
      alert("Please input a task description!");
      return;
    }
    if (taskPriorityText === "") {
      alert("Please input a task priority!");
      return;
    }

    const project = taskProjectName || selectedProject;
  
    // Task Details Object
    const taskItem = {
      id: Date.now(),
      title: taskTitleText,
      dueDate: taskDueDateText,
      description: taskDescriptionText,
      priority: taskPriorityText,
      completed: false,
      isImportant: false,
      project: project,
    };
  
    saveTask(taskItem);
    renderTask(taskItem);
  }
  
  // Function to render a task
  export function renderTask(task) {
    // Individual Task Display
    const individualTasks = document.createElement("div");
    individualTasks.id = "individual-tasks";
    // Apply class based on completion status
    individualTasks.classList.add(task.completed ? "task-completed" : "task-uncompleted");
  
    // task Completion Checkbox
    const taskCheckboxDisplay = document.createElement("input");
    taskCheckboxDisplay.type = "checkbox";
    taskCheckboxDisplay.checked = task.completed;

    // Task Title
    const taskTitleDisplay = document.createElement("p");
    taskTitleDisplay.textContent = task.title;
    taskTitleDisplay.className = "task-title-display";

    // Task Description
    const taskDescriptionDisplay = document.createElement("p");
    taskDescriptionDisplay.textContent = task.description;
    taskDescriptionDisplay.className = "task-description-display";

    // Div Element for the task dueDate, priority, project, edit and delete button
    const taskOptionsdiv = document.createElement("div");
    taskOptionsdiv.className = "task-options-display";

    // Task Duedate
    const taskDueDateDisplay = document.createElement("p");
    taskDueDateDisplay.textContent = task.dueDate;
    taskDueDateDisplay.className = "task-dueDate-display";

    // Task Priority
    const taskPriorityDisplay = document.createElement("p");
    taskPriorityDisplay.textContent = task.priority;
    taskPriorityDisplay.className = "task-priority-display";

    // Task Project
    const taskProjectDisplay = document.createElement("p");
    taskProjectDisplay.textContent = task.project;
    taskProjectDisplay.className = "task-project-display";

    // Task Important Checkbox
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("class", "task-important-checkbox-display");

    // Define the star shape using polygon
    const star = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    star.setAttribute("points", "12,2 15,10 24,10 17,15 20,23 12,18 4,23 7,15 0,10 9,10");
    star.setAttribute("fill", task.isImportant ? "yellow" : "transparent"); // Fill color
    star.setAttribute("stroke", "black"); // Outline color
    star.setAttribute("stroke-width", "1.5"); // Outline thickness

    // Append the star to the SVG
    svg.appendChild(star);

    // Edit Task Button
    const editTaskButton = document.createElement("button");
    editTaskButton.textContent = "Edit";
    editTaskButton.className = "edit-task-button";

    // Delete Task Button
    const deleteTaskButton = document.createElement("button");
    deleteTaskButton.className = "delete-task-button";
    deleteTaskButton.textContent = "Delete";

    // Append the task options in the div
    taskOptionsdiv.append(
      taskDueDateDisplay,
      taskPriorityDisplay,
      taskProjectDisplay,
      svg,
      editTaskButton,
      deleteTaskButton
    );
  
    // Append task items to individual task
    individualTasks.append(
      taskCheckboxDisplay,
      taskTitleDisplay,
      taskDescriptionDisplay,
      taskOptionsdiv
    );
  
    // Append individual task to all tasks container
    allTaskContainer.appendChild(individualTasks);
  
    // Event listeners
    taskCheckboxDisplay.addEventListener("click", () => {
      toggleTaskComplete(task);
      individualTasks.classList.toggle("task-completed");
      individualTasks.classList.toggle("task-uncompleted");
    });

    svg.addEventListener("click", () => {
      toggleTaskImportance(task);
      star.setAttribute("fill", task.isImportant ? "yellow" : "transparent");
    });

    editTaskButton.addEventListener("click", () => {
      openEditTaskModal(task);
    });
  
    deleteTaskButton.addEventListener("click", function () {
      openDeleteTaskModal(task, function() {
        individualTasks.remove();
      });
    });
  
    resetPageStyle();
  }
  
  // Function to delete a task
  export function deleteTask(task) {
    const projectName = task.project;
    const tasks = getTasksFromStorage(projectName);
  
    // Filter out the task to be deleted
    const updatedTasks = tasks.filter(t => t.id !== task.id);
  
    updateTasksInStorage(projectName, updatedTasks);
    resetPageStyle();
  }
  
  // Function to toggle task completion
  export function toggleTaskComplete(task) {
    const projectName = task.project;
    const tasks = getTasksFromStorage(projectName);
  
    // Find and toggle the completion status of the task
    tasks.forEach(t => {
      if (t.id === task.id) {
        t.completed = !t.completed;
      }
    });
  
    updateTasksInStorage(projectName, tasks);
  }

  // Function to toggle task importance
  export function toggleTaskImportance(task) {
    task.isImportant = !task.isImportant;
    updateTask(task);
  }
  
  // Function to reset page style
  export function resetPageStyle() {
    if (allTaskContainer.childNodes.length === 0) {
      allTaskContainerHeading.style.display = "none";
      allTaskContainer.style.display = "none";
    } else {
      allTaskContainerHeading.style.display = "inline";
      allTaskContainer.style.display = "flex";
    }

    addNoteButton.style.display = "none";
    addTaskButton.style.display = "inline-block";

    allTaskContainer.style.flexDirection = "column";
    allTaskContainer.style.alignItems = "center";
    allTaskContainer.style.gap = "0px";
  }
  
  // Function to load tasks from localStorage
  export function loadTasks() {
    const tasks = getTasksFromStorage(selectedProject.projectName);
    tasks.forEach(task => {
      renderTask(task);
    });
  }


  // Function for for rendering all tasks for the selected project
  export function renderAllTasks() {
    // Clear existing tasks
    allTaskContainer.innerHTML = "";
    allTaskContainerHeading.textContent = `All Tasks - ${selectedProject.projectName}`;
  
    let tasks = [];

  if (selectedProject.projectName === "All Projects") {
    // Get tasks from all projects
    const projects = getProjectsFromStorage();
    for (const projectName in projects) {
      tasks = tasks.concat(projects[projectName]);
    }
  } else {
    // Get tasks from the selected project
    tasks = getTasksFromStorage(selectedProject.projectName);
  }

  tasks.forEach(task => {
    renderTask(task);
  });

  resetPageStyle();
  }


  export function updateTask(updatedTask) {
    const projectName = updatedTask.project;
    const tasks = getTasksFromStorage(projectName);

    // Find the index of the task to be updated, means finding which task to be updated
    const taskIndex = tasks.findIndex(task => task.id === updatedTask.id);
    
    if (taskIndex !== -1) {
      tasks[taskIndex] = updatedTask; //Update the task in the array
      updateTasksInStorage(projectName, tasks); //Save the updated tasks to localStorage
      renderAllTasks(); //Re-render tasks to reflect the changes
    } else {
      alert("Task not found!");
    }
  }


// Function for rendering due today tasks
export function renderTasksDueToday() {
  // Clear existing tasks
  allTaskContainer.innerHTML = "";

  // Update heading
  allTaskContainerHeading.textContent = "Tasks Due Today";

  // Get today's date string
  const todayDateString = format(new Date(), 'yyyy-MM-dd');


  // Get all tasks
 const allTasks = getAllTasks();

  // Filter tasks due today
  const tasksDueToday = allTasks.filter(task => task.dueDate === todayDateString);

  // Render each task
  tasksDueToday.forEach(task => {
    renderTask(task);
  });

  resetPageStyle();
}

// Function for getting the due tasks within the next 7 days
export function renderTasksForNext7Days() {
  allTaskContainer.innerHTML = "";
  allTaskContainerHeading.textContent = "Tasks Due in the Next 7 Days";

  const today = new Date();
  const next7Days = addDays(today, 7);

  const allTasks = getAllTasks();

  const upcomingTasks = allTasks.filter(task => {
    if (task.dueDate) {
      const taskDate = parseISO(task.dueDate);

      return (
        (isAfter(taskDate, today) && isBefore(taskDate, next7Days)) ||
        task.dueDate === format(today, 'yyyy-MM-dd') // Include today
      );
    }
    return false;
  });

  // Render the tasks
  upcomingTasks.forEach(task => {
    renderTask(task);
  });

  resetPageStyle();
}

// Function for getting the Important Tasks
export function renderImportantTasks() {
  allTaskContainer.innerHTML = "";

  allTaskContainerHeading.textContent = "Important Tasks";

  const allTasks = getAllTasks();

  const importantTasks = allTasks.filter(task => task.isImportant);

  importantTasks.forEach(task => {
    renderTask(task);
  });

  resetPageStyle();
}