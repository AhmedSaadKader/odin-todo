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
const allListsDiv = document.getElementById('to-do-lists')
const allTasksListDiv = document.getElementById('all-tasks-list')
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
    let newTask = addToDoTask(createNewTaskInstance(newTaskTitle.value, newTaskDescription.value,newTaskCategory.value, newTaskDate.value, newTaskPriority.value))
    dataTaskStorage(newTask)
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
    const x = addToDoList(createNewList(newListTitle.value, newListDescription.value))
    dataListStorage(x)
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

function updateTaskStorage() {
  localStorage.clear()
  for (let i = 0; i < allTasks.length; i++) {
    localStorage.setItem(`task${i}`, JSON.stringify(allTasks[i]))
  }
  for (let i = 0; i < toDoCategories.length; i++){
    localStorage.setItem(`list${i}`, JSON.stringify(toDoCategories[i]))
  }
}

function storageDisplay () {
  const storageLength = localStorage.length
  for (let i = 0; i < storageLength; i++) {
    if (localStorage.getItem(`task${i}`)){
      const storedTask = JSON.parse(localStorage.getItem(`task${i}`));
      addToDoTask(createNewTaskInstance(storedTask.title, storedTask.description, storedTask.category, storedTask.dueDate, storedTask.priority, storedTask.done))
    }
    if (localStorage.getItem(`list${i}`)){
      const storedList = JSON.parse(localStorage.getItem(`list${i}`));
      const storedListInstance = createNewList(storedList.title, storedList.description)
      displayLists(storedListInstance)
    }
  }
}

// Functions
function pageLoad() {
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

function createNewTaskInstance(title, description, category, date, priority, done) {
  const newTask = new ToDoItem(title, description, category, date, priority, done)
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

function addToDoTask(task, taskListDOM=allTasksListDiv) {
  const newTask = task
  allTasks.push(newTask)
  displayTasks(taskListDOM)
  taskFormElement.reset()
  taskModal.close()
  return newTask
}

function displayTasks(taskListDOM) {
  taskListDOM.innerHTML = "";
  const taskList = allTasks
  for (let i = 0; i < taskList.length; i++) {
    let newTaskElement = createTaskDiv(taskList[i])
    taskListDOM.appendChild(newTaskElement)
    checkIfTaskIsDone(newTaskElement, taskList[i])
    deleteTask(newTaskElement, taskList[i])
  }
}

function sortTasksList() {

}

function createTaskDiv(task){
  const newTaskElement = document.createElement('div')
  newTaskElement.classList = 'single-task'
  if (document.getElementById(task.title)){
    for (let i = 0; i < 100; i++) {
      if (!document.getElementById(`${task.title}-${i}`)){
        newTaskElement.setAttribute('id', `${task.title}-${i}`)
        break
      }
    }
  } else {
    newTaskElement.setAttribute('id', task.title)
  }
  let taskInput = createTaskCheckboxElement(task, newTaskElement)
  let taskInputLabel = createTaskTitleElement(task)
  let taskPriority = createTaskPriorityElement(task)
  let taskDeleteIcon = createTaskDeleteButton(task, newTaskElement)
  let taskDate = createTaskDateElement(task)
  newTaskElement.append(taskInput, taskInputLabel, taskPriority, taskDeleteIcon, taskDate)
  addPriorityStyleToTaskDiv(newTaskElement, task)
  return newTaskElement
}

function createTaskCheckboxElement(task, taskElement ) {
  const taskInput = document.createElement('input')
  const taskElementId = taskElement.id
  taskInput.setAttribute('id', `${taskElementId}-checkbox`)
  taskInput.setAttribute('type', 'checkbox')
  taskInput.classList = 'title-checkbox'
  if (task.done === true) {
    taskInput.checked = true
    taskElement.classList.add('task-done')
  }
  taskInput.setAttribute('name', task.title)
  return taskInput
}

function createTaskTitleElement(task) {
  const taskInputLabel = document.createElement('label')
  taskInputLabel.setAttribute('for', task.title)
  taskInputLabel.innerText = task.title
  return taskInputLabel
}

function createTaskPriorityElement(task) {
  const taskPriority = document.createElement('span')
  taskPriority.innerHTML = task.priority
  taskPriority.classList = 'span-right'
  return taskPriority
}

function addPriorityStyleToTaskDiv(div, task) {
  task.priority == 'high' ? div.classList.add('high'):
  task.priority == 'medium' ? div.classList.add('medium') : div.classList.add('low')
}

function createTaskDeleteButton(task, taskElement) {
  const taskElementId = taskElement.id
  const taskDeleteIcon = document.createElement('div');
  taskDeleteIcon.innerHTML = `<div id="${taskElementId}-delete"><i class="fa-solid fa-trash-can"></i></div>`
  return taskDeleteIcon
}

function createTaskDateElement(task) {
  const taskDate = document.createElement('p')
  taskDate.innerText = `Due: ${task.dueDate}`
  taskDate.classList = 'task-due-date'
  return taskDate
}


function checkIfTaskIsDone(taskElement,task) {
  const taskElementId = taskElement.id
  const tasksCheckbox = document.getElementById(`${taskElementId}-checkbox`)
  tasksCheckbox.addEventListener('change', (e)=>{
      console.log(e, tasksCheckbox.parentNode)
      tasksCheckbox.parentNode.classList.toggle('task-done')   
      allTasks.forEach(item => {
        if(item === task){
          item.checkBoxClick()
          displayTasks(allTasksListDiv)
          updateTaskStorage()
          // console.log(allTasks)   
        }
      })
    })
  }

function deleteTask(taskElement, task) {
  const taskElementId = taskElement.id
  const taskDeleteButton = document.getElementById(`${taskElementId}-delete`)
  taskDeleteButton.addEventListener('click', ()=>{
    allTasks.forEach(item => {
      if(item === task){
        const itemIndex = allTasks.indexOf(item)
        allTasks.splice(itemIndex, 1)
        displayTasks(allTasksListDiv)
        updateTaskStorage()
        console.log(itemIndex)
        console.log(allTasks)
      }
    })
  })
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
  displayLists(newList)
  listFormElement.reset()
  listModal.close()
  return newList
}

function displayLists(list) {
  const newListElement = document.createElement('div')
  toDoCategories.push(list)
  newListElement.innerText = list.title
  allListsDiv.appendChild(newListElement)
  addListToCategoryDOM(list)
}

function addListToCategoryDOM (list) {
  const categoryOption = document.createElement('option')
  categoryOption.setAttribute('value', list.title)
  categoryOption.innerText = list.title
  newTaskCategory.appendChild(categoryOption)
}