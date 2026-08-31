import { useState } from "react";

function ProjectsPage({
    users,
    projects,
    setProjects,
    selectedProjectId,
    setSelectedProjectId,
    addProjectMember,
    removeProjectMember,
}) {
    const [selectedProject, setSelectedProject] =
        useState(null);

    const [showMembers, setShowMembers] =
        useState(false);

    /* =====================================================
       GET PROJECT MEMBERS
    ===================================================== */

    const getProjectMembers = (project) => {
        return users.filter((user) =>
            project.memberIds?.includes(user.id)
        );
    };

    /* =====================================================
       SELECT PROJECT
    ===================================================== */

    const handleSelectProject = (project) => {
        setSelectedProjectId(project.id);

        setSelectedProject(project);

        setShowMembers(true);
    };

    /* =====================================================
       ADD USER TO PROJECT
    ===================================================== */

    const handleAddMember = async (
        projectId,
        userId
    ) => {
        try {
            const result = await addProjectMember(
                projectId,
                userId
            );

            const updatedProject = result.project;

            // Update all projects
            setProjects((currentProjects) =>
                currentProjects.map((project) =>
                    project.id === projectId
                        ? updatedProject
                        : project
                )
            );

            // Update selected project
            setSelectedProject((currentProject) =>
                currentProject &&
                currentProject.id === projectId
                    ? updatedProject
                    : currentProject
            );
        } catch (error) {
            console.error(
                "Failed to add project member:",
                error
            );

            alert(
                error.message ||
                "Failed to add project member."
            );
        }
    };

    /* =====================================================
       REMOVE USER FROM PROJECT
    ===================================================== */

    const handleRemoveMember = async (
        projectId,
        userId
    ) => {
        try {
            const result = await removeProjectMember(
                projectId,
                userId
            );

            const updatedProject = result.project;

            // Update all projects
            setProjects((currentProjects) =>
                currentProjects.map((project) =>
                    project.id === projectId
                        ? updatedProject
                        : project
                )
            );

            // Update selected project
            setSelectedProject((currentProject) =>
                currentProject &&
                currentProject.id === projectId
                    ? updatedProject
                    : currentProject
            );
        } catch (error) {
            console.error(
                "Failed to remove project member:",
                error
            );

            alert(
                error.message ||
                "Failed to remove project member."
            );
        }
    };

    /* =====================================================
       PAGE
    ===================================================== */

    return (
        <div className="app">

            <main className="page-content">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="page-header">

                    <div>

                        <p className="page-label">
                            WORKSPACE
                        </p>

                        <h1>
                            Projects
                        </h1>

                        <p className="page-subtitle">
                            Manage projects and their members.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    PROJECT LIST
                ================================================= */}

                <div className="projects-grid">

                    {projects.map((project) => {

                        const projectMembers =
                            getProjectMembers(project);

                        const isSelected =
                            selectedProjectId ===
                            project.id;

                        return (

                            <div
                                key={project.id}
                                className={`project-card ${
                                    isSelected
                                        ? "project-card-selected"
                                        : ""
                                }`}
                            >

                                <div className="project-card-header">

                                    <div>

                                        <p className="project-id">
                                            PROJECT
                                        </p>

                                        <h2>
                                            {project.name}
                                        </h2>

                                    </div>

                                    <span className="project-member-count">
                                        {projectMembers.length}
                                    </span>

                                </div>


                                <p className="project-description">
                                    {project.description}
                                </p>


                                {/* MEMBERS */}

                                <div className="project-members">

                                    {projectMembers.map(
                                        (user) => (

                                            <span
                                                key={user.id}
                                                className="assignee-chip"
                                            >
                                                @{user.name}
                                            </span>

                                        )
                                    )}

                                </div>


                                <div className="project-card-actions">

                                    <button
                                        type="button"
                                        className="primary-button"
                                        onClick={() =>
                                            handleSelectProject(
                                                project
                                            )
                                        }
                                    >
                                        Manage Members
                                    </button>

                                    <button
                                        type="button"
                                        className="secondary-button"
                                        onClick={() => {
                                            setSelectedProjectId(
                                                project.id
                                            );
                                        }}
                                    >
                                        Open Board
                                    </button>

                                </div>

                            </div>

                        );

                    })}

                </div>


                {/* =================================================
                    MEMBER MANAGEMENT
                ================================================= */}

                {showMembers &&
                    selectedProject && (

                        <section className="project-member-panel">

                            <div className="project-member-panel-header">

                                <div>

                                    <p className="page-label">
                                        PROJECT MEMBERS
                                    </p>

                                    <h2>
                                        {selectedProject.name}
                                    </h2>

                                </div>

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() =>
                                        setShowMembers(
                                            false
                                        )
                                    }
                                >
                                    Close
                                </button>

                            </div>


                            <div className="project-member-list">

                                {users.map((user) => {

                                    const isMember =
                                        selectedProject.memberIds?.includes(
                                            user.id
                                        );

                                    return (

                                        <div
                                            key={user.id}
                                            className="project-member-row"
                                        >

                                            <div>

                                                <strong>
                                                    @{user.name}
                                                </strong>

                                                <span>
                                                    {user.name}
                                                </span>

                                            </div>


                                            {isMember ? (

                                                <button
                                                    type="button"
                                                    className="remove-member-button"
                                                    onClick={() =>
                                                        handleRemoveMember(
                                                            selectedProject.id,
                                                            user.id
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>

                                            ) : (

                                                <button
                                                    type="button"
                                                    className="primary-button"
                                                    onClick={() =>
                                                        handleAddMember(
                                                            selectedProject.id,
                                                            user.id
                                                        )
                                                    }
                                                >
                                                    + Add
                                                </button>

                                            )}

                                        </div>

                                    );

                                })}

                            </div>

                        </section>

                    )}

            </main>

        </div>
    );
}

export default ProjectsPage;
