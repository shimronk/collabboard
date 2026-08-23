function GroupsPage({
    users,
    groups,
    setGroups,
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
                            Groups
                        </h1>

                        <p className="page-subtitle">
                            Manage your collaboration groups.
                        </p>
                    </div>
                </div>

                <div className="projects-grid">

                    {groups.map((group) => {

                        const members = users.filter(
                            (user) =>
                                group.userIds?.includes(
                                    user.id
                                )
                        );

                        return (
                            <div
                                key={group.id}
                                className="project-card"
                            >
                                <div className="project-card-header">
                                    <div>
                                        <p className="project-id">
                                            GROUP
                                        </p>

                                        <h2>
                                            {group.name}
                                        </h2>
                                    </div>

                                    <span className="project-member-count">
                                        {members.length}
                                    </span>
                                </div>

                                <p className="project-description">
                                    {group.description}
                                </p>

                                <div className="project-members">

                                    {members.map(
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

                            </div>
                        );
                    })}

                </div>

            </main>
        </div>
    );
}

export default GroupsPage;