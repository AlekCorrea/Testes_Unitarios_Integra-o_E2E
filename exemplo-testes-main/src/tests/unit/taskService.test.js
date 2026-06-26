jest.mock("../../repositories/taskRepository", () => ({
  save: jest.fn(),
  findAll: jest.fn(),
  delete: jest.fn(),
}));

const repository = require("../../repositories/taskRepository");
const taskService = require("../../services/taskService");

describe("Task Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve criar tarefa", () => {
    const tarefa = taskService.addTask("Estudar");

    expect(tarefa.title).toBe("Estudar");

    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(repository.save).toHaveBeenCalledWith(tarefa);
  });

  test("addTask deve retornar id e title", () => {
    const tarefa = taskService.addTask("Estudar");

    expect(tarefa).toHaveProperty("id");
    expect(tarefa).toHaveProperty("title");
    expect(tarefa.title).toBe("Estudar");
  });

  test("deve lancar erro sem titulo", () => {
    expect(() => {
      taskService.addTask("");
    }).toThrow("Titulo obrigatorio");

    expect(repository.save).not.toHaveBeenCalled();
  });

  test("deve lancar erro quando title for numero", () => {
    expect(() => {
      taskService.addTask(42);
    }).toThrow();
  });

  test.each([
    null,
    undefined,
    42,
    [],
    {},
  ])("deve lancar erro para title invalido: %p", (valor) => {
    expect(() => {
      taskService.addTask(valor);
    }).toThrow();
  });

  test("deve lancar erro para titulo muito curto", () => {
    expect(() => {
      taskService.addTask("ab");
    }).toThrow("Titulo muito curto");
  });

  test("deve lancar erro para titulo muito longo", () => {
    const titulo = "a".repeat(101);

    expect(() => {
      taskService.addTask(titulo);
    }).toThrow("Titulo muito longo");
  });

  test("deve listar tarefas", () => {
    repository.findAll.mockReturnValue([
      { id: 1, title: "Tarefa 1" },
      { id: 2, title: "Tarefa 2" },
    ]);

    const tarefas = taskService.getTasks();

    expect(tarefas).toHaveLength(2);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  test("getTasks deve retornar valor do repository", () => {
    const mockTasks = [
      { id: 1, title: "A" },
      { id: 2, title: "B" },
    ];

    repository.findAll.mockReturnValue(mockTasks);

    const tarefas = taskService.getTasks();

    expect(tarefas).toEqual(mockTasks);
  });

  test("deve gerar ids diferentes", () => {
    const tarefa1 = taskService.addTask("Estudar");
    const tarefa2 = taskService.addTask("Trabalhar");

    expect(tarefa1.id).not.toBe(tarefa2.id);
  });

  test("deleteTask deve chamar repository.delete com id correto", () => {
    repository.delete.mockReturnValue(true);

    taskService.deleteTask(1);

    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  test("deleteTask deve lancar erro se id nao existir", () => {
    repository.delete.mockReturnValue(false);

    expect(() => {
      taskService.deleteTask(999);
    }).toThrow();
  });
});