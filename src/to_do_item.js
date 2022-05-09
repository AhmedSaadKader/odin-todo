export default class ToDoItem {
    constructor (title, description,category, dueDate, priority, done=false) {
        this.title = title
        this.description = description
        this.category = category
        this.dueDate = dueDate
        this.priority = priority
        this.done = done
    }

    checkDueDate() {
        let taskDueDate = this.dueDate
        var nowDate = new Date(); 
        var date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate(); 
        if(taskDueDate === ''){
            taskDueDate = date
        } 
        this.dueDate = taskDueDate
    }

    checkBoxClick() {
        if (this.done == false) {
            this.done = true
        } else{
            this.done = false
        }
    }
    
}