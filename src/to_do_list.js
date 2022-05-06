export default class ToDoList {
    constructor (title, description) {
        this.title = title
        this.description = description
        this.list = []
    }

    test() {
        console.log('I am a todo list', this.list)
    }

    addTask(task) {
        this.list.push(task)
    }
}