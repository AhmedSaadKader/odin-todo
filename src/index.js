import './style.css';
import ToDoItem from './to_do_item';
import ToDoList from './to_do_list';

// defaults
const personalToDoList = new ToDoList('Personal', 'Personal')
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

// Event Listeners
window.addEventListener('load', pageLoad)
newTaskButtons.forEach((button)=>{button.addEventListener('click', openTaskModal)})
saveNewTaskButton.addEventListener('click', (e)=>{e.preventDefault(); addToDoTask(createNewTaskInstance())})
closeNewTaskButton.addEventListener('click', (e)=>{closeTaskModal(e)})
newListButtons.forEach((button)=>{button.addEventListener('click', openListModal)})
saveNewlistButton.addEventListener('click', addToDoList)
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
      const taskStoredItem = JSON.parse(localStorage.getItem(`task${i}`));
      displayTask(taskStoredItem)
    }
    if (localStorage.getItem(`list${i}`)){
      const listStoredItem = JSON.parse(localStorage.getItem(`list${i}`));
      addListToTaskLists(listStoredItem)
      console.log(listStoredItem)
    }
    
  }

}

// Functions
function pageLoad() {
  addListToTaskLists(personalToDoList)
  addListToTaskLists(workToDoList)
  console.log(localStorage)
  // localStorage.clear()
  storageDisplay()
  // localStorage.clear()
}

function openTaskModal() {
  taskModal.showModal()
}

function openListModal() {
  listModal.showModal()
}

function closeTaskModal(e) {
  e.preventDefault()
  taskFormElement.reset()
  taskModal.close()
}

function closelistModal(e) {
  e.preventDefault()
  listFormElement.reset()
  listModal.close()
}

function createNewTaskInstance() {
  if (newTaskTitle.value === '') {return false}
  const newTask = new ToDoItem(newTaskTitle.value, newTaskDescription.value,newTaskCategory.value, newTaskDate.value, newTaskPriority.value)
  newTask.checkDueDate()
  return newTask
}

function displayTask(task) {
  addTaskToCategory(task)
  allTasks.push(task)
  addTaskToAllTasksList(task)
}

function addToDoTask(task) {
  // e.preventDefault()
  const newTask = task
  displayTask(newTask)
  dataTaskStorage(newTask)
  taskFormElement.reset()
  taskModal.close()
}

function addToDoList() {
  if (newListTitle.value === '') {return false}
  const newList = new ToDoList(newListTitle.value, newListDescription.value)
  addListToTaskLists(newList)
  dataListStorage(newList)
  listFormElement.reset()
  listModal.close()
  document.getElementById('search').focus()
}

function addListToTaskLists(list) {
  const newListElement = document.createElement('div')
  toDoCategories.push(list)
  newListElement.innerText = list.title
  taskLists.appendChild(newListElement)
  addListToCategoryDOM(list)
}

function addTaskToAllTasksList(task){
  const newTaskElement = document.createElement('div')
  newTaskElement.classList = 'single-task'
  newTaskElement.setAttribute('id', task.title)
  addTaskTitleToList(newTaskElement, task)
  addTaskPriorityToList(newTaskElement, task)
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

function addTaskToCategory(task) {
  toDoCategories.forEach((category) => {
    if (category.title === task.category){
      category.addTask(task)
    }
  })
}

function checkIfTaskIsDone(task) {
  const tasksCheckboxes = document.querySelectorAll('.title-checkbox')
  tasksCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('click', ()=>{
     checkbox.parentNode.classList.toggle('task-done')
     task.checkBoxClick()
     console.log(task)
    })
  })
}

function addListToCategoryDOM (list) {
  const categoryOption = document.createElement('option')
  categoryOption.setAttribute('value', list.title)
  categoryOption.innerText = list.title
  if(list.title == "Personal"){categoryOption.selected = true}
  newTaskCategory.appendChild(categoryOption)
}