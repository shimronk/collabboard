import Column from "./Column";

function Board({
    tasks,
    users,
    onEditTask,
    onDeleteTask,
}) {

    const todoTasks = tasks.filter(
        (task) => task.status === "todo"
    );

    const doingTasks = tasks.filter(
        (task) => task.status === "doing"
    );

    const doneTasks = tasks.filter(
        (task) => task.status === "done"
    );

    return (
        <main className="board">

            <Column
                title="To Do"
                tasks={todoTasks}
                users={users}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
            />

            <Column
                title="Doing"
                tasks={doingTasks}
                users={users}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
            />

            <Column
                title="Done"
                tasks={doneTasks}
                users={users}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
            />

        </main>
    );
}

export default Board;