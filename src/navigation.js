import { allTasksButton, importantTasksButton, next7DaysTasksButton, projectList, todayTasksButton } from "./dom";


export function highlightSelectedButton(activeElement) {
    // Collect all navigational elements that can be highlighted

    const buttonsToHighlight = [
        allTasksButton,
        todayTasksButton,
        next7DaysTasksButton,
        importantTasksButton,
    ];

    // Get all project list items
    const projectItems = projectList.querySelectorAll("li");

    // Combine all elements into one array
    const allHighlightableElements = [...buttonsToHighlight, ...projectItems];

    // Remove 'selected' class from all elements
    allHighlightableElements.forEach(element => {
        element.classList.remove("selected");
    });

    // Add 'selected' class to the active element, if provided
    if (activeElement) {
        activeElement.classList.add('selected');
    }
}


// Hide Side bar menu button Event Listener
document.getElementById("hiddenMenu").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("hidden-sidebar");
    document.getElementById("main-container").classList.toggle("hidden-main-container");
});