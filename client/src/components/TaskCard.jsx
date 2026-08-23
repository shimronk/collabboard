import { useEffect, useRef, useState } from "react";
import menuIcon from "../assets/icons/menu.png";
import editIcon from "../assets/icons/edit.png";
import deleteIcon from "../assets/icons/delete.png";
import checkIcon from "../assets/icons/check.png";

function TaskCard({
    task,
    users = [],
    onEditTask,
    onDeleteTask,
}) {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);


    /* =========================================
       GET USERS ASSIGNED TO THIS TASK
    ========================================= */

    const assignedUsers = users.filter(
        (user) =>
            task.assigneeIds?.includes(user.id)
    );


    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }

        };


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    const formatDeadline = (deadline) => {

        if (!deadline) {
            return "";
        }


        const date = new Date(
            `${deadline}T00:00:00`
        );


        return date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            }
        );

    };


    const getDeadlineStatus = (deadline) => {

        if (!deadline) {
            return "";
        }


        const today = new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        const deadlineDate = new Date(
            `${deadline}T00:00:00`
        );


        const difference =
            deadlineDate.getTime() -
            today.getTime();


        const daysLeft = Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );


        if (daysLeft <= 2) {
            return "deadline-urgent";
        }


        if (daysLeft <= 7) {
            return "deadline-soon";
        }


        if (daysLeft <= 14) {
            return "deadline-medium";
        }


        return "deadline-safe";

    };


    const handleEdit = () => {

        setIsMenuOpen(false);

        onEditTask(task);

    };


    const handleDelete = () => {

        setIsMenuOpen(false);

        onDeleteTask(task.id);

    };


    return (

        <div className="task-card">

            {/* =====================================
                HEADER
            ====================================== */}

            <div className="task-card-header">

                <h3>
                    {task.title}
                </h3>


                <div
                    className="task-menu"
                    ref={menuRef}
                >

                    <button
                        type="button"
                        className="task-menu-button"
                        aria-label="Task menu"

                        onClick={() =>
                            setIsMenuOpen(
                                (current) =>
                                    !current
                            )
                        }
                    >

                        <img
                            src={menuIcon}
                            alt=""
                            className="task-main-menu-icon"
                        />

                    </button>


                    {isMenuOpen && (

                        <div className="task-menu-dropdown">

                            <button
                                type="button"
                                className="task-menu-item"
                                onClick={handleEdit}
                            >

                                <img
                                    src={editIcon}
                                    alt=""
                                    className="task-menu-icon"
                                />

                                <span>
                                    Edit
                                </span>

                            </button>


                            <button
                                type="button"
                                className="task-menu-item delete-menu-item"
                                onClick={handleDelete}
                            >

                                <img
                                    src={deleteIcon}
                                    alt=""
                                    className="task-menu-icon"
                                />

                                <span>
                                    Delete
                                </span>

                            </button>

                        </div>

                    )}

                </div>

            </div>


            {/* =====================================
                DESCRIPTION
            ====================================== */}

            <p className="task-description">

                {task.description}

            </p>


            {/* =====================================
                DEADLINE / COMPLETED
            ====================================== */}

            {task.status === "done" ? (

                <div className="completed-status">

                    <span className="completed-check">

                        <img
                            src={checkIcon}
                            alt=""
                            className="completed-check-icon"
                        />

                    </span>


                    <span className="completed-text">
                        Completed
                    </span>

                </div>

            ) : (

                task.deadline && (

                    <div className="deadline-section">

                        <div className="deadline-information">

                            <span className="deadline-title">
                                Deadline
                            </span>


                            <span className="deadline-value">

                                {formatDeadline(
                                    task.deadline
                                )}

                            </span>

                        </div>


                        <div
                            className={`deadline-status-line ${getDeadlineStatus(
                                task.deadline
                            )}`}
                        />

                    </div>

                )

            )}


            {/* =====================================
                FOOTER
            ====================================== */}

            <div className="task-card-footer">


                {/* MULTIPLE ASSIGNEES */}

                <div className="task-assignees">

                    {assignedUsers.length > 0 ? (

                        assignedUsers.map(
                            (user) => (

                                <span
                                    key={user.id}
                                    className="assignee-chip"
                                >

                                    @{user.username}

                                </span>

                            )
                        )

                    ) : (

                        <span className="unassigned">
                            Unassigned
                        </span>

                    )}

                </div>


                {/* PRIORITY */}

                <span
                    className={`priority priority-${task.priority.toLowerCase()}`}
                >

                    {task.priority}

                </span>

            </div>

        </div>

    );

}

export default TaskCard;