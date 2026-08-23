import { useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BoardPage from "./pages/BoardPage";
import ProfilePage from "./pages/ProfilePage";
import TeamPage from "./pages/TeamPage";
import ProjectsPage from "./pages/ProjectsPage";
import GroupsPage from "./pages/GroupsPage";
import MemberInsightsPage from "./pages/MemberInsightsPage";

import ProtectedRoute from "./components/ProtectedRoute";

import {
    defaultUsers,
    defaultGroups,
    defaultProjects,
    defaultTasks,
} from "./data/appData";


function getStoredData(key, fallback) {
    try {
        const saved = localStorage.getItem(key);

        return saved
            ? JSON.parse(saved)
            : fallback;

    } catch {
        return fallback;
    }
}


function App() {

    const [users, setUsers] = useState(() =>
        getStoredData(
            "collabboardUsers",
            defaultUsers
        )
    );


    const [groups, setGroups] = useState(() =>
        getStoredData(
            "collabboardGroups",
            defaultGroups
        )
    );


    const [projects, setProjects] = useState(() =>
        getStoredData(
            "collabboardProjects",
            defaultProjects
        )
    );


    const [tasks, setTasks] = useState(() =>
        getStoredData(
            "collabboardTasks",
            defaultTasks
        )
    );


    const [selectedProjectId, setSelectedProjectId] =
        useState(() =>
            Number(
                localStorage.getItem(
                    "collabboardSelectedProject"
                )
            ) || 1
        );


    /* =========================
       LOCAL STORAGE SYNC
    ========================= */

    useEffect(() => {
        localStorage.setItem(
            "collabboardUsers",
            JSON.stringify(users)
        );
    }, [users]);


    useEffect(() => {
        localStorage.setItem(
            "collabboardGroups",
            JSON.stringify(groups)
        );
    }, [groups]);


    useEffect(() => {
        localStorage.setItem(
            "collabboardProjects",
            JSON.stringify(projects)
        );
    }, [projects]);


    useEffect(() => {

        localStorage.setItem(
            "collabboardTasks",
            JSON.stringify(tasks)
        );

        window.dispatchEvent(
            new Event("collabboardDataUpdated")
        );

    }, [tasks]);


    useEffect(() => {

        localStorage.setItem(
            "collabboardSelectedProject",
            selectedProjectId
        );

    }, [selectedProjectId]);


    /* =========================
       TASK FUNCTIONS
    ========================= */

    const handleSaveTask = (
        taskData,
        editingTask
    ) => {

        if (editingTask) {

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === editingTask.id
                        ? {
                            ...task,
                            ...taskData,
                        }
                        : task
                )
            );

        } else {

            setTasks((currentTasks) => [
                ...currentTasks,
                {
                    id: Date.now(),
                    projectId: selectedProjectId,
                    ...taskData,
                },
            ]);

        }

    };


    const handleDeleteTask = (taskId) => {

        const task =
            tasks.find(
                (item) => item.id === taskId
            );

        const confirmed =
            window.confirm(
                `Delete "${task?.title}"?`
            );

        if (!confirmed) {
            return;
        }

        setTasks((currentTasks) =>
            currentTasks.filter(
                (task) =>
                    task.id !== taskId
            )
        );

    };


    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />


                <Route
                    path="/login"
                    element={<LoginPage />}
                />


                <Route
                    path="/register"
                    element={<RegisterPage />}
                />


                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage
                                tasks={tasks}
                                users={users}
                                projects={projects}
                            />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/projects"
                    element={
                        <ProtectedRoute>
                            <ProjectsPage
                                users={users}
                                projects={projects}
                                setProjects={setProjects}
                                selectedProjectId={selectedProjectId}
                                setSelectedProjectId={
                                    setSelectedProjectId
                                }
                            />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/groups"
                    element={
                        <ProtectedRoute>
                            <GroupsPage
                                users={users}
                                groups={groups}
                                setGroups={setGroups}
                            />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/board"
                    element={
                        <ProtectedRoute>
                            <BoardPage
                                tasks={tasks}
                                users={users}
                                projects={projects}
                                selectedProjectId={
                                    selectedProjectId
                                }
                                setSelectedProjectId={
                                    setSelectedProjectId
                                }
                                onSaveTask={
                                    handleSaveTask
                                }
                                onDeleteTask={
                                    handleDeleteTask
                                }
                            />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/team"
                    element={
                        <ProtectedRoute>
                            <TeamPage
                                users={users}
                                projects={projects}
                                groups={groups}
                                tasks={tasks}
                            />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/member-insights"
                    element={
                        <ProtectedRoute>
                            <MemberInsightsPage
                                users={users}
                                projects={projects}
                                tasks={tasks}
                            />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}


export default App;