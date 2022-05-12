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
        let date = new Date();
        let nowMonth = date.getMonth() + 1
        let nowDay = date.getDate()
        if (nowMonth < 10){
            nowMonth = `0${nowMonth}`
        }
        if (nowDay < 10) {
            nowDay = `0${nowDay}`
        }
        var nowDate = date.getFullYear()+'-'+nowMonth+'-'+nowDay; 
        if(taskDueDate === ''){
            taskDueDate = nowDate
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