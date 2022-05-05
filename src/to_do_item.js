export default class ToDoItem {
    constructor (title, description, dueDate) {
        this.title = title
        this.description = description
        this.dueDate = dueDate
    }

    test() {
        console.log(this.title, this.description, this.dueDate)
    }
}