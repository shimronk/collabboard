import { useState } from "react";

function ProjectsPage({
    users,
    projects,
    setProjects,
    selectedProjectId,
    setSelectedProjectId,
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
            project.userIds?.includes(user.id)
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

    const handleAddMember = (projectId, userId) => {

        setProjects((currentProjects) =>
            currentProjects.map((project) => {

                if (project.id !== projectId) {
                    return project;
                }

                const currentUserIds =
                    project.userIds || [];

                if (
                    currentUserIds.includes(userId)
                ) {
                    return project;
                }

                return {
                    ...project,

                    userIds: [
                        ...currentUserIds,
                        userId,
                    ],
                };

            })
        );


        /* Update selected project immediately */

        setSelectedProject((currentProject) => {

            if (
                !currentProject ||
                currentProject.id !== projectId
            ) {
                return currentProject;
            }

            return {
                ...currentProject,

                userIds: [
                    ...(currentProject.userIds || []),
                    userId,
                ],
            };

        });
    };


    /* =====================================================
       REMOVE USER FROM PROJECT
    ===================================================== */

    const handleRemoveMember = (
        projectId,
        userId
    ) => {

        setProjects((currentProjects) =>
            currentProjects.map((project) => {

                if (project.id !== projectId) {
                    return project;
                }

                return {
                    ...project,

                    userIds: (
                        project.userIds || []
                    ).filter(
                        (id) => id !== userId
                    ),
                };

            })
        );


        setSelectedProject((currentProject) => {

            if (
                !currentProject ||
                currentProject.id !== projectId
            ) {
                return currentProject;
            }

            return {
                ...currentProject,

                userIds: (
                    currentProject.userIds || []
                ).filter(
                    (id) => id !== userId
                ),
            };

        });
    };


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
                            getProjectMembers(
                                project
                            );

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
                                                @{user.username}
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
                                        selectedProject.userIds?.includes(
                                            user.id
                                        );

                                    return (

                                        <div
                                            key={user.id}
                                            className="project-member-row"
                                        >

                                            <div>

                                                <strong>
                                                    @{user.username}
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