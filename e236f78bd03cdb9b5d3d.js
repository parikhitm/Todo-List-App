import './style.css';
import { setupEventHandlers } from './eventHandlers.js';
import { renderAllTasks, resetPageStyle } from './tasks.js';
import { renderProjectList } from "./projects.js";
import { allTasksButton } from './dom.js';
import { highlightSelectedButton } from './navigation.js';

// Set up event handlers
setupEventHandlers();
resetPageStyle();

// Load tasks on window load
window.addEventListener("load", function () {
  renderProjectList(); // Ensure the project list is rendered
  renderAllTasks(); // Load tasks for the default project
  highlightSelectedButton(allTasksButton);
});