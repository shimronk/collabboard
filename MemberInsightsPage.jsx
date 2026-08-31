function MemberInsightsPage({
    users = [],
    projects = [],
    tasks = [],
}) {
    return (
        <div className="app">
            <main className="page-content">

                <div className="page-header">
                    <div>
                        <p className="page-label">
                            WORKSPACE
                        </p>

                        <h1>
                            Member Insights
                        </h1>

                        <p className="page-subtitle">
                            View team member activity and project progress.
                        </p>
                    </div>
                </div>

                <div className="projects-grid">

                    {users.map((user) => {

                        const memberTasks =
                            tasks.filter((task) =>
                                task.assigneeIds?.includes(
                                    user.id
                                )
                            );

                        const completedTasks =
                            memberTasks.filter(
                                (task) =>
                                    task.status === "done"
                            );

                        const memberProjects =
                            projects.filter((project) =>
                                project.userIds?.includes(
                                    user.id
                                )
                            );

                        return (
                            <div
                                key={user.id}
                                className="project-card"
                            >

                                <div className="project-card-header">

                                    <div>
                                        <p className="project-id">
                                            MEMBER
                                        </p>

                                        <h2>
                                            @{user.username}
                                        </h2>
                                    </div>

                                    <span className="project-member-count">
                                        {memberTasks.length}
                                    </span>

                                </div>

                                <p className="project-description">
                                    {user.name}
                                </p>

                                <div className="project-members">

                                    <span className="assignee-chip">
                                        Projects:{" "}
                                        {memberProjects.length}
                                    </span>

                                    <span className="assignee-chip">
                                        Tasks:{" "}
                                        {memberTasks.length}
                                    </span>

                                    <span className="assignee-chip">
                                        Completed:{" "}
                                        {completedTasks.length}
                                    </span>

                                </div>

                            </div>
                        );
                    })}

                </div>

            </main>
        </div>
    );
}

export default MemberInsightsPage;
