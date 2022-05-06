export default class ToDoItem {
    constructor (title, description, dueDate, priority) {
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
    }

    checkDueDate() {
        let taskDueDate = this.dueDate
        var nowDate = new Date(); 
        var date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate(); 
        taskDueDate === '' ? taskDueDate = date: console.log('bye')
        this.dueDate = taskDueDate
    }

    test() {
        console.log(this.title, this.description, this.dueDate)
    }
    
}