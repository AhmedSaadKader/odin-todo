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
const searchDivElement = document.getElementById('search-tasks-list')
const searchBarElement = document.getElementById('search-input')
const searchDateElement = document.getElementById('date-search')


// test
const testButton = document.querySelector('.user-wrap')
testButton.addEventListener('click', () => {
  console.log(localStorage)
  console.log(toDoCategories)
  console.log(allTasks)
})

// Event Listeners
window.addEventListener('load', pageLoad)
newTaskButtons.forEach((button)=>{button.addEventListener('click', ()=>{openTaskModal();})})
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
    const x = addToDoList(createNewListInstance(newListTitle.value, newListDescription.value))
    dataListStorage(x)
  }
})
closeNewlistButton.addEventListener('click', (e)=>{closelistModal(e)})

searchBarElement.addEventListener('input', (e)=>{
  const value = e.target.value
  displaySearchTasks(value)
})

searchDateElement.addEventListener('input', (e)=>{
  const value = e.target.value
  displaySearchTasks(value)
})

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

function updateLocalStorage() {
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
      const storedListInstance = createNewListInstance(storedList.title, storedList.description)
      addToDoList(storedListInstance)
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

function addToDoTask(task) {
  const newTask = task
  allTasks.push(newTask)
  displayAllTasksList()

  taskFormElement.reset()
  taskModal.close()
  return newTask
}

function displayTask(div, task) {
  let newTaskElement = createTaskDiv(task)
  div.appendChild(newTaskElement)
  checkIfTaskIsDone(newTaskElement, task)
  deleteTask(newTaskElement, task)
}

function displayAllTasksList() {
  allTasksListDiv.innerHTML = "";
  for (let i = 0; i < allTasks.length; i++) {
    displayTask(allTasksListDiv, allTasks[i])
    displaySearchTasks(searchBarElement.value)
  }
}

function sortTasksList() {
  searchDivElement.innerHTML = ""
  const nowDate = new Date()
  const today = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate()
  let sortedTasks = allTasks.map(task => {
    if (task.dueDate == today){
        let newTaskElement = createTaskDiv(task)
        searchDivElement.appendChild(newTaskElement)
        checkIfTaskIsDone(newTaskElement, task)
        deleteTask(newTaskElement, task)
      console.log(task.title)
      return task
    }
  })
  console.log(today, sortedTasks)
}

function displaySearchTasks(searchTitleValue, dateValue) {
  let sortedTasks = []
  searchDivElement.innerHTML = ""
  if (searchBarElement.value != ""){
    sortedTasks = searchTitleTask(allTasks, searchTitleValue)
    console.log(sortedTasks)
  }
  if (searchDateElement.value != ""){
    if (searchBarElement.value == "") {
      sortedTasks = searchDateTask(allTasks, dateValue)
    } else {
      sortedTasks = searchDateTask(sortedTasks, dateValue)
      console.log(sortedTasks)
    }
  }
  
  sortedTasks.forEach(task => {
    if (task){
      displayTask(searchDivElement, task)
    }
  })
}

function searchTitleTask(tasklist, searchTitleValue) {
  let sortedTasks = tasklist.map(task => {
    if (searchBarElement.value != ""){
      if (task.title.includes(searchTitleValue)) {
        return task
      }
    }
  })
  return sortedTasks
}

function searchDateTask(tasklist, dateValue) {
  let sortedTasks = tasklist.map(task => {
    if(task){
      if (searchDateElement != "") {
        if (task.dueDate == searchDateElement.value){
          return task
        }
      }
    }
  })

  return sortedTasks
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
  let taskCategory = createTaskCategoryElement(task)
  newTaskElement.append(taskInput, taskInputLabel, taskPriority, taskDeleteIcon, taskDate, taskCategory)
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

function createTaskCategoryElement(task) {
  const taskCategory = document.createElement('span');
  taskCategory.innerHTML = task.category
  taskCategory.classList = 'span-right'
  return taskCategory
}

function checkIfTaskIsDone(taskElement,task) {
  const taskElementId = taskElement.id
  const tasksCheckbox = document.getElementById(`${taskElementId}-checkbox`)
  tasksCheckbox.addEventListener('change', (e)=>{
      tasksCheckbox.parentNode.classList.toggle('task-done')   
      allTasks.forEach(item => {
        if(item === task){
          item.checkBoxClick()
          displayAllTasksList()
            updateLocalStorage()
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
        displayAllTasksList()
        updateLocalStorage()
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

function createNewListInstance(title, description) {
  const newList = new ToDoList(title, description)
  return newList
}


function addToDoList(list) {
  const newList = list
  toDoCategories.push(newList)
  displayLists(newList)
  addListToCategoryDOM(newList)
  listFormElement.reset()
  listModal.close()
  return newList
}

function displayLists(list) {
  allListsDiv.innerHTML = ""
  for (let i = 0; i < toDoCategories.length; i++) {
    const newListElement = createNewList(toDoCategories[i])
    allListsDiv.appendChild(newListElement)
    deleteList(newListElement, toDoCategories[i])
  }
}

function createNewList(list) {
  const newListElement = document.createElement('div')
  const newListTitleElement = document.createElement('P')
  newListElement.classList = "list-div"
  if (document.getElementById(list.title)){
    for (let i = 0; i < 100; i++) {
      if (!document.getElementById(`${list.title}-${i}`)){
        newListElement.setAttribute('id', `${list.title}-${i}`)
        break
      }
    }
  } else {
    newListElement.setAttribute('id', list.title)
  }
  newListTitleElement.innerText = list.title
  newListElement.appendChild(newListTitleElement)
  const listDeleteIcon = createlistDeleteButton(list, newListElement)
  newListElement.appendChild(listDeleteIcon)
  return newListElement
}

function createlistDeleteButton(list, listElement) {
  const listElementId = listElement.id
  const listDeleteIcon = document.createElement('i');
  listDeleteIcon.setAttribute('id', `${listElementId}-delete`)
  listDeleteIcon.classList = 'fa-solid fa-trash-can list-delete-icon'
  return listDeleteIcon
}

function deleteList(listElement, list){
  const listElementId = listElement.id
  const listDeleteButton = document.getElementById(`${listElementId}-delete`)
  listDeleteButton.addEventListener('click', ()=>{
    toDoCategories.forEach(item => {
      if(item === list){
        const itemIndex = toDoCategories.indexOf(item)
        toDoCategories.splice(itemIndex, 1)
        displayLists(allListsDiv)
        updateLocalStorage()
      }
    })
  })
}

function addListToCategoryDOM (list) {
  const categoryOption = document.createElement('option')
  categoryOption.setAttribute('value', list.title)
  categoryOption.innerText = list.title
  newTaskCategory.appendChild(categoryOption)
}
