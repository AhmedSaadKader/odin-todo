import './style.css';
import ToDoItem from './to_do_item';
import ToDoList from './to_do_list';

// defaults
const defaultToDoList = new ToDoList('uncategorized', 'uncategorized')

// Selectors
const newTaskButtons = document.querySelectorAll('.new-task-button')
const newListButtons = document.querySelectorAll('.new-list-button')
const taskModal = document.getElementById('taskModal')
const taskFormElement = document.getElementById('task-form')
const saveNewTaskButton = document.getElementById('save-task')
const closeNewTaskButton = document.getElementById('close-task-modal')
const taskLists = document.getElementById('to-do-lists')
const allTasksList = document.getElementById('all-tasks-list')
const newTaskTitle = document.getElementById('task-title')
const newTaskDescription = document.getElementById('task-description')
const newTaskDate = document.getElementById('task-date')
const newTaskPriority = document.getElementById('task-priority')
// Event Listeners
window.addEventListener('load', pageLoad)
newTaskButtons.forEach((button)=>{button.addEventListener('click', openTaskModal)})
newListButtons.forEach((button)=>{button.addEventListener('click', (e)=>{addToDoList(e)})})
saveNewTaskButton.addEventListener('click', addToDoTask)
closeNewTaskButton.addEventListener('click', (e)=>{closeTaskModal(e)})
// Functions
function pageLoad() {
  addListToTaskLists(defaultToDoList)
}

function openTaskModal() {
  taskModal.showModal()
}

function closeTaskModal(e) {
  e.preventDefault()
  taskFormElement.reset()
  taskModal.close()
}

function addToDoTask(e) {
  // e.preventDefault()
  if (newTaskTitle.value === '') {return false}
  const newTask = new ToDoItem(newTaskTitle.value, newTaskDescription.value, newTaskDate.value, newTaskPriority.value)
  newTask.checkDueDate()
  defaultToDoList.addTask(newTask)
  addTaskToAllTasksList(newTask)
  taskFormElement.reset()
  taskModal.close()
}

function addToDoList() {
  const newList = new ToDoList('new List', 'new')
  addListToTaskLists(newList)
}

function addListToTaskLists(list) {
  const newListElement = document.createElement('div')
  newListElement.innerText = list.title
  taskLists.appendChild(newListElement)
}

function addTaskToAllTasksList(task){
  const newTaskElement = document.createElement('div')
  newTaskElement.classList = 'single-task'
  newTaskElement.setAttribute('id', task.title)
  addTaskTitleToList(newTaskElement, task)
  addTaskPriorityToList(newTaskElement, task)
  addTaskDateToList(newTaskElement, task)
}

function addTaskTitleToList(div, task) {
  const taskInput = document.createElement('input')
  taskInput.setAttribute('type', 'checkbox')
  taskInput.setAttribute('id', task.title)
  taskInput.setAttribute('name', task.title)
  const taskInputLabel = document.createElement('label')
  taskInputLabel.setAttribute('for', task.title)
  taskInputLabel.innerText = task.title
  div.appendChild(taskInput)
  div.appendChild(taskInputLabel)
  allTasksList.appendChild(div)
}

function addTaskDateToList(div, task) {
  const taskDate = document.createElement('p')
  taskDate.innerText = `Due: ${task.dueDate}`
  div.appendChild(taskDate)
  allTasksList.appendChild(div)
}

function addTaskPriorityToList(div, task) {
  const taskPriority = document.createElement('span')
  taskPriority.innerText = task.priority
  taskPriority.classList = 'span-right'
  div.appendChild(taskPriority)
  allTasksList.appendChild(div)

  task.priority == 'high' ? div.classList.add('high'):
  task.priority == 'medium' ? div.classList.add('medium') : div.classList.add('low')
}