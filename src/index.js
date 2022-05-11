import './style.css';
import ToDoItem from './to_do_item';
import ToDoList from './to_do_list';

// defaults
// const personalToDoList = new ToDoList('Personal', 'Personal')
const workToDoList = new ToDoList('Work', 'Work')
const toDoCategories = []
const allTasks = []

// Selectors
const newTaskButtons = document.querySelectorAll('.new-task-button')
const newListButtons = document.querySelectorAll('.new-list-button')
const taskModal = document.getElementById('taskModal')
const listModal = document.getElementById('list-modal')
const taskFormElement = document.getElementById('task-form')
const listFormElement = document.getElementById('list-form')
const saveNewTaskButton = document.getElementById('save-task')
const closeNewTaskButton = document.getElementById('close-task-modal')
const saveNewlistButton = document.getElementById('save-list')
const closeNewlistButton = document.getElementById('close-list')
const taskLists = document.getElementById('to-do-lists')
const allTasksList = document.getElementById('all-tasks-list')
const newTaskTitle = document.getElementById('task-title')
const newTaskDescription = document.getElementById('task-description')
const newTaskCategory = document.getElementById('task-category')
const newTaskDate = document.getElementById('task-date')
const newTaskPriority = document.getElementById('task-priority')
const newListTitle = document.getElementById('list-title')
const newListDescription = document.getElementById('list-description')


// test
const testButton = document.querySelector('.user-wrap')
testButton.addEventListener('click', () => {
  console.log(localStorage)
  console.log(toDoCategories)
  console.log(allTasks)
})

// Event Listeners
window.addEventListener('load', pageLoad)
newTaskButtons.forEach((button)=>{button.addEventListener('click', openTaskModal)})
saveNewTaskButton.addEventListener('click', (e)=>{
  let isFormValid = taskFormElement.checkValidity();
  if (!isFormValid){
    taskFormElement.reportValidity()
  } else {
    e.preventDefault(); 
    addToDoTask(createNewTaskInstance(newTaskTitle.value, newTaskDescription.value,newTaskCategory.value, newTaskDate.value, newTaskPriority.value))
  }
})
closeNewTaskButton.addEventListener('click', (e)=>{closeTaskModal(e)})
newListButtons.forEach((button)=>{button.addEventListener('click', openListModal)})
saveNewlistButton.addEventListener('click', (e)=>{
  let isFormValid = listFormElement.checkValidity();
  if (!isFormValid){
    listFormElement.reportValidity()
  } else {
    e.preventDefault();
    addToDoList(createNewList(newListTitle.value, newListDescription.value))
  }
})
closeNewlistButton.addEventListener('click', (e)=>{closelistModal(e)})

// Storage
function dataTaskStorage(task) {
  const storageLength = localStorage.length
  for (let i = 0; i < (storageLength + 1); i++) {
    if (!localStorage.getItem(`task${i}`)){
      localStorage.setItem(`task${i}`, JSON.stringify(task))
      break
    }
  }
}

function dataListStorage(list) {
  const storageLength = localStorage.length
  for (let i = 0; i < (storageLength + 1); i++) {
    if (!localStorage.getItem(`list${i}`)){
      localStorage.setItem(`list${i}`, JSON.stringify(list))
      break
    }
  }
}

function updateTaskStorage(task) {

}

function storageDisplay () {
  const storageLength = localStorage.length
  for (let i = 0; i < storageLength; i++) {
    if (localStorage.getItem(`task${i}`)){
      const storedTask = JSON.parse(localStorage.getItem(`task${i}`));
      const storedTaskInstance = createNewTaskInstance(storedTask.title, storedTask.description, storedTask.category, storedTask.dueDate, storedTask.priority)
      displayTask(storedTaskInstance)
      // console.log(storedTaskInstance)
    }
    if (localStorage.getItem(`list${i}`)){
      const storedList = JSON.parse(localStorage.getItem(`list${i}`));
      const storedListInstance = createNewList(storedList.title, storedList.description)
      addListToTaskLists(storedListInstance)
      console.log(storedList)
    }
    
  }

}

// Functions
function pageLoad() {
  console.log(toDoCategories, allTasks)
  console.log(localStorage)
  // localStorage.clear()
  storageDisplay()
}

// Task Functions
function openTaskModal() {
  taskModal.showModal()
}

function closeTaskModal(e) {
  e.preventDefault()
  taskFormElement.reset()
  taskModal.close()
}

function createNewTaskInstance(title, description, category, date, priority) {
  const newTask = new ToDoItem(title, description, category, date, priority)
  newTask.checkDueDate()
  addTaskToCategory(newTask)
  return newTask
}

function addTaskToCategory(task) {
  toDoCategories.forEach((category) => {
    if (category.title === task.category){
      category.addTask(task)
    }
  })
// }
}

function addToDoTask(task) {
  const newTask = task
  displayTask(newTask)
  dataTaskStorage(newTask)
  taskFormElement.reset()
  taskModal.close()
}

function displayTask(task) {
  allTasks.push(task)
  addTaskToAllTasksList(task)
  deleteTask(task)
}

function addTaskToAllTasksList(task){
  const newTaskElement = document.createElement('div')
  newTaskElement.classList = 'single-task'
  newTaskElement.setAttribute('id', task.title)
  addTaskTitleToList(newTaskElement, task)
  addTaskPriorityToList(newTaskElement, task)
  addDeleteButton(newTaskElement, task)
  addTaskDateToList(newTaskElement, task)
  checkIfTaskIsDone(task)
}

function addTaskTitleToList(div, task) {
  const taskInput = document.createElement('input')
  taskInput.setAttribute('type', 'checkbox')
  taskInput.classList = 'title-checkbox'
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
  taskDate.classList = 'task-due-date'
  div.appendChild(taskDate)
  allTasksList.appendChild(div)
}

function addTaskPriorityToList(div, task) {
  const taskPriority = document.createElement('span')
  taskPriority.innerHTML = task.priority
  taskPriority.classList = 'span-right'
  div.appendChild(taskPriority)
  allTasksList.appendChild(div)
  task.priority == 'high' ? div.classList.add('high'):
  task.priority == 'medium' ? div.classList.add('medium') : div.classList.add('low')
}

function addDeleteButton(div, task) {
  const taskDeleteIcon = document.createElement('div');
  taskDeleteIcon.innerHTML = `<div id="${task.title}-delete"><i class="fa-solid fa-trash-can"></i></div>`
  // onclick="deleteTask(${task.title})"
  div.appendChild(taskDeleteIcon)
  allTasksList.appendChild(div)
}

function checkIfTaskIsDone(task) {
  const tasksCheckboxes = document.querySelectorAll('.title-checkbox')
  tasksCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('click', ()=>{
     checkbox.parentNode.classList.toggle('task-done')
     task.checkBoxClick()
    })
  })
}

function deleteTask(task) {
  const taskDeleteButton = document.getElementById(`${task.title}-delete`)
  console.log(taskDeleteButton)
  taskDeleteButton.addEventListener('click', ()=>{console.log(task.title)})
  console.log(task)
}

// List Functions

function openListModal() {
  listModal.showModal()
}

function closelistModal(e) {
  e.preventDefault()
  listFormElement.reset()
  listModal.close()
}



function createNewList(title, description) {
  const newList = new ToDoList(title, description)
  return newList
}


function addToDoList(list) {
  const newList = list
  addListToTaskLists(newList)
  dataListStorage(newList)
  listFormElement.reset()
  listModal.close()
}

function addListToTaskLists(list) {
  const newListElement = document.createElement('div')
  toDoCategories.push(list)
  newListElement.innerText = list.title
  taskLists.appendChild(newListElement)
  addListToCategoryDOM(list)
}

function addListToCategoryDOM (list) {
  const categoryOption = document.createElement('option')
  categoryOption.setAttribute('value', list.title)
  categoryOption.innerText = list.title
  if(list.title == "Personal"){categoryOption.selected = true}
  newTaskCategory.appendChild(categoryOption)
}