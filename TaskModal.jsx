import { useState } from "react";

function TaskModal({
    taskToEdit,
    onClose,
    onSaveTask,
    users = [],
}) {
    const [title, setTitle] = useState(
        taskToEdit?.title || ""
    );

    const [description, setDescription] = useState(
        taskToEdit?.description || ""
    );

    const [priority, setPriority] = useState(
        taskToEdit?.priority || "Medium"
    );

    const [status, setStatus] = useState(
        taskToEdit?.status || "todo"
    );

    const [assigneeIds, setAssigneeIds] = useState(
        taskToEdit?.assigneeIds || []
    );

    const [deadline, setDeadline] = useState(
        taskToEdit?.deadline || ""
    );

    const isEditing = Boolean(taskToEdit);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!title.trim()) {
            alert("Please enter a task title.");
            return;
        }

        onSaveTask({
            title: title.trim(),
            description: description.trim(),
            priority,
            status,
            assigneeIds,
            deadline,
        });
    };

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="modal-overlay"
            onClick={handleOverlayClick}
        >
            <div className="task-modal">

                <div className="modal-header">
                    <div>
                        <p className="modal-label">
                            {isEditing
                                ? "EDIT TASK"
                                : "NEW TASK"}
                        </p>

                        <h2>
                            {isEditing
                                ? "Edit Task"
                                : "Add New Task"}
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="modal-close-button"
                        onClick={onClose}
                    >
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* TASK TITLE */}

                    <div className="form-group">
                        <label htmlFor="task-title">
                            Task Title
                        </label>

                        <input
                            id="task-title"
                            type="text"
                            placeholder="Enter task title"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            autoFocus
                        />
                    </div>


                    {/* DESCRIPTION */}

                    <div className="form-group">
                        <label htmlFor="task-description">
                            Description
                        </label>

                        <textarea
                            id="task-description"
                            placeholder="Enter task description"
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            rows="4"
                        />
                    </div>


                    {/* PRIORITY + STATUS */}

                    <div className="form-row">

                        <div className="form-group">
                            <label htmlFor="task-priority">
                                Priority
                            </label>

                            <select
                                id="task-priority"
                                value={priority}
                                onChange={(event) =>
                                    setPriority(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="High">
                                    High
                                </option>

                                <option value="Medium">
                                    Medium
                                </option>

                                <option value="Low">
                                    Low
                                </option>
                            </select>
                        </div>


                        <div className="form-group">
                            <label htmlFor="task-status">
                                Status
                            </label>

                            <select
                                id="task-status"
                                value={status}
                                onChange={(event) =>
                                    setStatus(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="todo">
                                    To Do
                                </option>

                                <option value="doing">
                                    Doing
                                </option>

                                <option value="done">
                                    Done
                                </option>
                            </select>
                        </div>

                    </div>


                    {/* ASSIGN USERS */}

                    <div className="form-group">

                        <label>
                            Assign Users
                        </label>

                        <div className="assignee-checkbox-list">

                            {users.map((user) => (

                                <label
                                    key={user.id}
                                    className="assignee-checkbox"
                                >

                                    <input
                                        type="checkbox"
                                        className="assignee-user-checkbox"
                                        checked={
                                            assigneeIds.includes(
                                                user.id
                                            )
                                        }
                                        onChange={(event) => {

                                            if (
                                                event.target.checked
                                            ) {

                                                setAssigneeIds(
                                                    (currentIds) => {

                                                        if (
                                                            currentIds.includes(
                                                                user.id
                                                            )
                                                        ) {
                                                            return currentIds;
                                                        }

                                                        return [
                                                            ...currentIds,
                                                            user.id,
                                                        ];
                                                    }
                                                );

                                            } else {

                                                setAssigneeIds(
                                                    (currentIds) =>
                                                        currentIds.filter(
                                                            (id) =>
                                                                id !==
                                                                user.id
                                                        )
                                                );

                                            }

                                        }}
                                    />

                                    <span>
                                        @{user.username}
                                    </span>

                                </label>

                            ))}

                        </div>

                    </div>


                    {/* SELECTED USERS */}

                    {assigneeIds.length > 0 && (

                        <div className="selected-assignees">

                            <span className="selected-assignees-label">
                                Assigned:
                            </span>

                            {users
                                .filter((user) =>
                                    assigneeIds.includes(
                                        user.id
                                    )
                                )
                                .map((user) => (

                                    <span
                                        key={user.id}
                                        className="assignee-chip"
                                    >
                                        @{user.username}
                                    </span>

                                ))}

                        </div>

                    )}


                    {/* DEADLINE */}

                    <div className="form-group">

                        <label htmlFor="task-deadline">
                            Deadline
                        </label>

                        <input
                            id="task-deadline"
                            type="date"
                            value={deadline}
                            onChange={(event) =>
                                setDeadline(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    {/* BUTTONS */}

                    <div className="modal-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-task-button"
                        >
                            {isEditing
                                ? "Save Changes"
                                : "+ Add Task"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default TaskModal;