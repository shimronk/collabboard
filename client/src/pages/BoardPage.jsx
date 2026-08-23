import { useState } from "react";
import Navbar from "../components/Navbar";
import Board from "../components/Board";
import TaskModal from "../components/TaskModal";

function BoardPage({
    tasks,
    users,
    projects,
    selectedProjectId,
    setSelectedProjectId,
    onSaveTask,
    onDeleteTask,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Filter tasks for currently selected project
const projectTasks =
    tasks.filter(
        (task) =>
            task.projectId === selectedProjectId
    );


// Get currently selected project
const selectedProject = projects.find(
    (project) =>
        project.id === selectedProjectId
);


// Get only members of selected project
const projectMembers = users.filter(
    (user) =>
        selectedProject?.userIds?.includes(
            user.id
        )
);

    /* =========================================================
       ADD ACTIVITY
    ========================================================= */

    const addActivity = (activity) => {
        const existingActivities =
            JSON.parse(
                localStorage.getItem(
                    "collabboardActivities"
                )
            ) || [];

        const newActivity = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...activity,
        };

        localStorage.setItem(
            "collabboardActivities",
            JSON.stringify(
                [
                    newActivity,
                    ...existingActivities,
                ].slice(0, 20)
            )
        );

        window.dispatchEvent(
            new Event(
                "collabboardActivityUpdated"
            )
        );
    };


    /* =========================================================
       OPEN ADD TASK MODAL
    ========================================================= */

    const handleOpenAddTask = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };


    /* =========================================================
       EDIT TASK
    ========================================================= */

    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };


    /* =========================================================
       CLOSE MODAL
    ========================================================= */

    const handleCloseModal = () => {
        setEditingTask(null);
        setIsModalOpen(false);
    };


    /* =========================================================
       SAVE TASK
    ========================================================= */

    const handleSaveTask = (taskData) => {

        /* =====================================================
           EDIT EXISTING TASK
        ===================================================== */

        if (editingTask) {

            const oldStatus =
                editingTask.status;

            const newStatus =
                taskData.status;


            let updatedTaskData = {
                ...taskData,
            };


            /* =================================================
               TASK MOVED TO DONE
            ================================================= */

            if (
                newStatus === "done" &&
                oldStatus !== "done"
            ) {

                const completedAt =
                    new Date().toISOString();

                updatedTaskData.completedAt =
                    completedAt;


                /* Record completed activity */

                addActivity({
                    type: "completed",

                    member:
                        taskData.assignee ||
                        editingTask.assignee ||
                        "Team Member",

                    taskTitle:
                        taskData.title ||
                        editingTask.title,
                });

            }


            /* =================================================
               TASK WAS ALREADY DONE
            ================================================= */

            if (
                newStatus === "done" &&
                oldStatus === "done" &&
                editingTask.completedAt
            ) {

                updatedTaskData.completedAt =
                    editingTask.completedAt;

            }


            /* =================================================
               TASK MOVED BACK FROM DONE
            ================================================= */

            if (
                newStatus !== "done" &&
                oldStatus === "done"
            ) {

                updatedTaskData.completedAt =
                    null;

            }


            /* =================================================
               STATUS CHANGED
            ================================================= */

            if (
                oldStatus !== newStatus
            ) {

                /*
                 * Don't create a second status activity
                 * when the task was moved to Done.
                 */

                if (
                    newStatus !== "done"
                ) {

                    addActivity({
                        type: "status",

                        member:
                            taskData.assignee ||
                            editingTask.assignee ||
                            "Team Member",

                        taskTitle:
                            taskData.title ||
                            editingTask.title,

                        oldStatus,
                        newStatus,
                    });

                }

            } else {

                /* =================================================
                   NORMAL EDIT
                ================================================= */

                addActivity({
                    type: "updated",

                    member:
                        taskData.assignee ||
                        editingTask.assignee ||
                        "Team Member",

                    taskTitle:
                        taskData.title ||
                        editingTask.title,
                });

            }


            /* =================================================
               SAVE UPDATED TASK
            ================================================= */

            onSaveTask(
                updatedTaskData,
                editingTask
            );

        } else {

            /* =====================================================
               CREATE NEW TASK
            ===================================================== */

            const newTaskData = {
                ...taskData,
            };


            /* =================================================
               TASK CREATED DIRECTLY AS DONE
            ================================================= */

            if (
                newTaskData.status === "done"
            ) {

                newTaskData.completedAt =
                    new Date().toISOString();

            }


            /* =================================================
               RECORD CREATION
            ================================================= */

            addActivity({
                type: "created",

                member:
                    newTaskData.assignee ||
                    "Team Member",

                taskTitle:
                    newTaskData.title ||
                    "New task",
            });


            /* =================================================
               SAVE NEW TASK
            ================================================= */

            onSaveTask(
                newTaskData,
                null
            );
        }


        handleCloseModal();
    };


    /* =========================================================
       DELETE TASK
    ========================================================= */

    const handleDeleteTask = (taskId) => {

        const taskToDelete =
            tasks.find(
                (task) =>
                    task.id === taskId
            );


        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${taskToDelete?.title}"?`
            );


        if (!confirmed) {
            return;
        }


        /* =====================================================
           RECORD DELETE ACTIVITY
        ===================================================== */

        addActivity({
            type: "deleted",

            member:
                taskToDelete?.assignee ||
                "Team Member",

            taskTitle:
                taskToDelete?.title ||
                "Task",
        });


        /* =====================================================
           DELETE TASK
        ===================================================== */

        onDeleteTask(taskId);
    };


    /* =========================================================
       PAGE
    ========================================================= */

    return (

        <div className="app">

            <Navbar />


            <main className="page-content">


                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div className="page-header">

                    <div>

                        <p className="page-label">
                            WORKSPACE
                        </p>


                        <h1>
                            Development Board
                        </h1>


                        <p className="page-subtitle">
                            Manage your team's tasks and track project progress.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="add-task-button"
                        onClick={
                            handleOpenAddTask
                        }
                    >
                        + Add Task
                    </button>

                </div>


                {/* =================================================
                    BOARD
                ================================================= */}

                <Board
    tasks={projectTasks}
    users={users}
    onEditTask={
        handleEditTask
    }
    onDeleteTask={
        handleDeleteTask
    }
/>

            </main>


            {/* =====================================================
                TASK MODAL
            ===================================================== */}

            {isModalOpen && (

                <TaskModal
    taskToEdit={
        editingTask
    }

    users={projectMembers}

    onClose={
        handleCloseModal
    }

    onSaveTask={
        handleSaveTask
    }
/>

            )}

        </div>
    );
}

export default BoardPage;