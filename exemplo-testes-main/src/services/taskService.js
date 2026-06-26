const repository = require("../repositories/taskRepository");

function addTask(title) {
    if (!title) {
        throw new Error("Titulo obrigatorio");
    }

    if (typeof title !== "string") {
        throw new Error("Titulo deve ser uma string");
    }

    if (title.length < 3) {
        throw new Error("Titulo muito curto");
    }

    if (title.length > 100) {
        throw new Error("Titulo muito longo");
    }

    const task = {
        id: Date.now() + Math.random(),
        title
    };

    repository.save(task);

    return task;
}

function getTasks() {
    return repository.findAll();
}

function deleteTask(id) {
    const deleted = repository.delete(id);

    if (!deleted) {
        throw new Error("Task nao encontrada");
    }

    return true;
}

module.exports = {
    addTask,
    getTasks,
    deleteTask
};