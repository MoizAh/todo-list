const projectForm = document.querySelector(".project-form");
const projectFormName = document.querySelector("#project-form-name");
const projectFormSubmit = document.querySelector("#project-form-submit");

const taskForm = document.querySelector(".task-form");
const taskFormName = document.querySelector("#task-form-name");
const taskFormSubmit = document.querySelector("#task-form-submit");

const todoListContainer = document.querySelector(".todo-list-container");
const allProjects = document.querySelector(".all-projects");
const allTasks = document.querySelector(".all-tasks");

// Project event listeners
projectFormSubmit.addEventListener("click", addProject);
allProjects.addEventListener("click", deleteProject);
allProjects.addEventListener("click", currentProject);

// Task event listeners
taskFormSubmit.addEventListener("click", addTask);
allTasks.addEventListener("click", deleteTask);

let projects = [];

class Project {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.tasks = [];
  }
}

function addProject(e) {
  if (projectFormName.value === "") {
    e.preventDefault();
    alert("Please enter a project name.");
    return;
  }

  e.preventDefault();
  let newProject = new Project(projectFormName.value);
  projects.push(newProject);
  projectForm.reset();

  // Create new elements to display project in the HTML
  const projectContainer = document.createElement("div");
  projectContainer.classList.add("project-container");
  const projectName = document.createElement("h2");
  projectName.classList.add("project-name");

  projectContainer.appendChild(projectName);

  // The new task's name is equal to the name in the Object
  projectName.textContent = newProject.name;

  // Set the id and id attribute for each new project
  let num = -1;
  projects.forEach((item, index) => {
    item.id = num + 1;
    num += 1;
  });
  projectContainer.setAttribute("id", newProject.id);

  // Delete button
  const deleteProjectButton = document.createElement("button");
  deleteProjectButton.classList.add("delete-project");
  deleteProjectButton.textContent = "+";
  projectContainer.appendChild(deleteProjectButton);

  allProjects.appendChild(projectContainer);

  if (projects.length === 1) {
    projectContainer.classList.add("active");
  }
}

function deleteProject(e) {
  let deleteButton = e.target;
  let deleteButtonParent = deleteButton.parentElement;
  let deleteButtonParentId = deleteButtonParent.attributes[1];

  // Remove the target element from HTML and Object
  if (deleteButton.classList[0] === "delete-project") {
    deleteButtonParent.remove();
    projects.splice(deleteButtonParentId.value, 1);
    console.log(projects);
    allProjects.innerHTML = "";
  } else if (deleteButtonParentId === undefined) {
    return;
  }

  // Re-render every project
  projects.forEach((item, index) => {
    const projectContainer = document.createElement("div");
    projectContainer.classList.add("project-container");
    const projectName = document.createElement("h2");
    projectName.classList.add("project-name");

    projectContainer.appendChild(projectName);

    projectName.textContent = item.name;

    let num = -1;
    projects.forEach((item, index) => {
      item.id = num + 1;
      num += 1;
    });
    projectContainer.setAttribute("id", item.id);

    const deleteProjectButton = document.createElement("button");
    deleteProjectButton.classList.add("delete-project");
    deleteProjectButton.textContent = "+";
    projectContainer.appendChild(deleteProjectButton);

    allProjects.appendChild(projectContainer);
  });

  // Check to see if any element has an "active" class, if not, add it to the first element
  let allProjectContainers = document.querySelectorAll(".project-container");
  allProjectContainersArr = Array.from(allProjectContainers);

  allProjectContainersArr.forEach((item, index) => {
    if (item.className.includes("active") === false) {
      allProjectContainersArr[0].classList.add("active");
    }
  });

  // Render every task under the element with the "active" class
  allTasks.innerHTML = "";

  projects[0].tasks.forEach((item, index) => {
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");
    const taskName = document.createElement("h3");
    taskContainer.appendChild(taskName);

    taskName.textContent = item.name;

    item.id = index;
    taskContainer.dataset.id = item.id;
    taskContainer.dataset.projectId = item.projectId;

    const deleteTaskButton = document.createElement("button");
    deleteTaskButton.classList.add("delete-task");
    taskContainer.appendChild(deleteTaskButton);

    deleteTaskButton.textContent = "Delete";

    allTasks.appendChild(taskContainer);
  });
}

class Task {
  constructor(name, id, projectId) {
    this.name = name;
    this.id = id;
    this.projectId = projectId;
  }
}

let tasks = [];

function addTask(e) {
  if (taskFormName.value === "") {
    e.preventDefault();
    alert("Please enter a task name.");
    return;
  }

  if (projects.length === 0) {
    e.preventDefault();
    alert("Please create a new project first.");
    return;
  }

  e.preventDefault();
  let newTask = new Task(taskFormName.value);
  tasks.push(newTask);
  let allProjectContainers = document.querySelectorAll(".project-container");
  allProjectContainersArr = Array.from(allProjectContainers);
  allProjectContainersArr.find((item, index) => {
    if (item.classList.contains("active")) {
      projects[item.id].tasks.push(newTask);
    }
  });
  taskForm.reset();

  // Create new elements for the task when it is created
  const taskContainer = document.createElement("div");
  taskContainer.classList.add("task-container");
  const taskName = document.createElement("h3");
  taskContainer.appendChild(taskName);

  // Set the id's and id attributes for each new task
  let taskProjectId;
  allProjectContainersArr.find((item, index) => {
    if (item.classList.contains("active")) {
      taskProjectId = index;
    }
  });

  projects.forEach((item, index) => {
    item.tasks.forEach((task, taskIndex) => {
      task.id = taskIndex;
      taskContainer.dataset.id = newTask.id;
    });
  });

  projects.forEach((item, index) => {
    item.tasks.forEach((task) => {
      task.projectId = item.id;
      taskContainer.dataset.projectId = taskProjectId;
    });
  });

  // The new task's name is equal to the name in the Object
  taskName.textContent = newTask.name;

  // Delete Button
  const deleteTaskButton = document.createElement("button");
  deleteTaskButton.classList.add("delete-task");
  taskContainer.appendChild(deleteTaskButton);

  deleteTaskButton.textContent = "Delete";

  allTasks.appendChild(taskContainer);
}

function deleteTask(e) {
  let deleteButton = e.target;
  let taskItem = deleteButton.parentElement;
  let taskItemId = taskItem.dataset.id;
  let taskItemProjectId = taskItem.dataset.projectId;
  let taskContainer = document.querySelector(".task-container");
  let taskContainerAll = Array.from(taskContainer);

  // Remove the target element from HTML and Object
  if (deleteButton.classList[0] === "delete-task") {
    projects[taskItemProjectId].tasks.splice(taskItemId, 1);
    taskItem.remove();
  } else if (deleteButton[0] !== "delete-task") {
    return;
  }

  // Re-render every task
  allTasks.innerHTML = "";

  projects[taskItemProjectId].tasks.forEach((item, index) => {
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");
    const taskName = document.createElement("h3");
    taskContainer.appendChild(taskName);

    taskName.textContent = item.name;

    item.id = index;
    taskContainer.dataset.id = item.id;
    taskContainer.dataset.projectId = item.projectId;

    const deleteTaskButton = document.createElement("button");
    deleteTaskButton.classList.add("delete-task");
    taskContainer.appendChild(deleteTaskButton);
    deleteTaskButton.textContent = "Delete";

    allTasks.appendChild(taskContainer);
  });
}

// Select current project and add an "active" class to selected element
function currentProject(e) {
  let projectContainerTarget = e.target;
  let projectContainers = document.querySelectorAll(".project-container");
  if (projectContainerTarget.classList[0] === "project-container") {
    for (let i = 0; i < projectContainers.length; i++) {
      allTasks.textContent = "";
      let current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      projectContainerTarget.className += " active";
    }
  }

  // Render tasks of "active" project
  let projectContainerTargetActive = document.querySelectorAll(".active");
  if (projectContainerTarget.classList.contains("active") === true) {
    let projectContainerTargetId =
      projectContainerTargetActive[0].attributes[1].textContent;
    projects[projectContainerTargetId].tasks.forEach((item, index) => {
      const taskContainer = document.createElement("div");
      taskContainer.classList.add("task-container");
      const taskName = document.createElement("h3");
      taskContainer.appendChild(taskName);

      taskContainer.dataset.id = item.id;
      taskContainer.dataset.projectId = item.projectId;

      taskName.textContent = item.name;

      const deleteTaskButton = document.createElement("button");
      deleteTaskButton.classList.add("delete-task");
      taskContainer.appendChild(deleteTaskButton);
      deleteTaskButton.textContent = "Delete";

      allTasks.appendChild(taskContainer);
    });
  }
}
