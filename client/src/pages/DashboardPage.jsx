import {
    useEffect,
    useState,
} from "react";

import { Link } from "react-router-dom";
import checkIcon from "../assets/icons/check.png";

function DashboardPage({ tasks }) {

    /* =========================================================
       EXPAND / COLLAPSE STATE
    ========================================================= */

    const [expandedCards, setExpandedCards] = useState({
        progress: true,
        status: true,
        deadlines: true,
        activity: true,
        finished: true,
        team: true,
        leaderboard: true,
    });


    /* =========================================================
       TOGGLE CARD
    ========================================================= */

    const toggleCard = (cardName) => {

        setExpandedCards((previous) => ({
            ...previous,
            [cardName]: !previous[cardName],
        }));

    };


    /* =========================================================
       ACTIVITY STATE
    ========================================================= */

    const [activities, setActivities] = useState(() => {

        return (
            JSON.parse(
                localStorage.getItem(
                    "collabboardActivities"
                )
            ) || []
        );

    });


    /* =========================================================
       UPDATE ACTIVITIES
    ========================================================= */

    useEffect(() => {

        const updateActivities = () => {

            const savedActivities =
                JSON.parse(
                    localStorage.getItem(
                        "collabboardActivities"
                    )
                ) || [];

            setActivities(savedActivities);

        };


        window.addEventListener(
            "collabboardActivityUpdated",
            updateActivities
        );


        window.addEventListener(
            "storage",
            updateActivities
        );


        return () => {

            window.removeEventListener(
                "collabboardActivityUpdated",
                updateActivities
            );


            window.removeEventListener(
                "storage",
                updateActivities
            );

        };

    }, []);


    /* =========================================================
       TASK STATISTICS
    ========================================================= */

    const totalTasks = tasks.length;


    const todoTasks = tasks.filter(
        (task) =>
            task.status === "todo"
    );


    const doingTasks = tasks.filter(
        (task) =>
            task.status === "doing"
    );


    const doneTasks = tasks.filter(
        (task) =>
            task.status === "done"
    );


    const todoCount = todoTasks.length;
    const doingCount = doingTasks.length;
    const doneCount = doneTasks.length;


    /* =========================================================
       PROJECT COMPLETION
    ========================================================= */

    const completionPercentage =
        totalTasks === 0
            ? 0
            : Math.round(
                  (doneCount / totalTasks) * 100
              );


    /* =========================================================
       TODAY
    ========================================================= */

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    /* =========================================================
       OVERDUE TASKS
    ========================================================= */

    const overdueTasks = tasks.filter(
        (task) => {

            if (
                !task.deadline ||
                task.status === "done"
            ) {
                return false;
            }


            const deadline =
                new Date(task.deadline);


            deadline.setHours(
                0,
                0,
                0,
                0
            );


            return deadline < today;

        }
    );


    const overdueCount =
        overdueTasks.length;


    /* =========================================================
       UPCOMING DEADLINES
    ========================================================= */

    const upcomingTasks = tasks
        .filter(
            (task) => {

                if (
                    !task.deadline ||
                    task.status === "done"
                ) {
                    return false;
                }


                const deadline =
                    new Date(task.deadline);


                deadline.setHours(
                    0,
                    0,
                    0,
                    0
                );


                return deadline >= today;

            }
        )
        .sort(
            (a, b) =>
                new Date(a.deadline) -
                new Date(b.deadline)
        )
        .slice(0, 3);


    /* =========================================================
       RECENTLY FINISHED TASKS
    ========================================================= */

    const recentlyFinishedTasks = tasks
        .filter(
            (task) =>
                task.status === "done" &&
                task.completedAt
        )
        .sort(
            (a, b) =>
                new Date(b.completedAt) -
                new Date(a.completedAt)
        )
        .slice(0, 5);


    /* =========================================================
       TEAM PERFORMANCE MOCK DATA
    ========================================================= */

    const teamPerformance = [
        {
            name: "Member 1",
            avatar: "M1",
            total: 8,
            completed: 6,
            percentage: 75,
        },
        {
            name: "Member 2",
            avatar: "M2",
            total: 7,
            completed: 5,
            percentage: 71,
        },
        {
            name: "Member 3",
            avatar: "M3",
            total: 6,
            completed: 4,
            percentage: 67,
        },
        {
            name: "Member 4",
            avatar: "M4",
            total: 5,
            completed: 3,
            percentage: 60,
        },
        {
            name: "Member 5",
            avatar: "M5",
            total: 4,
            completed: 2,
            percentage: 50,
        },
        {
            name: "Member 6",
            avatar: "M6",
            total: 5,
            completed: 1,
            percentage: 20,
        },
    ];


    /* =========================================================
       LEADERBOARD - TOP 3
    ========================================================= */

    const leaderboard = [
        {
            name: "Member 1",
            avatar: "M1",
            percentage: 92,
            completed: 11,
        },
        {
            name: "Member 2",
            avatar: "M2",
            percentage: 84,
            completed: 9,
        },
        {
            name: "Member 3",
            avatar: "M3",
            percentage: 76,
            completed: 8,
        },
    ];


    /* =========================================================
       DEADLINE DISPLAY
    ========================================================= */

    const getDeadlineText = (
        deadline
    ) => {

        const deadlineDate =
            new Date(deadline);


        deadlineDate.setHours(
            0,
            0,
            0,
            0
        );


        const difference =
            deadlineDate - today;


        const daysRemaining =
            Math.ceil(
                difference /
                    (
                        1000 *
                        60 *
                        60 *
                        24
                    )
            );


        if (daysRemaining === 0) {
            return "Due today";
        }


        if (daysRemaining === 1) {
            return "Due tomorrow";
        }


        if (daysRemaining < 7) {
            return `Due in ${daysRemaining} days`;
        }


        return deadlineDate.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
            }
        );

    };


    /* =========================================================
       DEADLINE BADGE
    ========================================================= */

    const getDeadlineBadge = (
        deadline
    ) => {

        const deadlineDate =
            new Date(deadline);


        deadlineDate.setHours(
            0,
            0,
            0,
            0
        );


        const difference =
            deadlineDate - today;


        const daysRemaining =
            Math.ceil(
                difference /
                    (
                        1000 *
                        60 *
                        60 *
                        24
                    )
            );


        if (daysRemaining === 0) {
            return "Today";
        }


        if (daysRemaining === 1) {
            return "Tomorrow";
        }


        return `${daysRemaining} days`;

    };


    /* =========================================================
       ACTIVITY TEXT
    ========================================================= */

    const getActivityText = (
        activity
    ) => {

        if (
            activity.type === "created"
        ) {

            return (
                <>
                    {" created "}
                    <strong>
                        "{activity.taskTitle}"
                    </strong>
                </>
            );

        }


        if (
            activity.type === "updated"
        ) {

            return (
                <>
                    {" updated "}
                    <strong>
                        "{activity.taskTitle}"
                    </strong>
                </>
            );

        }


        if (
            activity.type === "status"
        ) {

            if (
                activity.newStatus === "done"
            ) {

                return (
                    <>
                        {" completed "}
                        <strong>
                            "{activity.taskTitle}"
                        </strong>
                    </>
                );

            }


            const statusNames = {
                todo: "To Do",
                doing: "Doing",
                done: "Done",
            };


            return (
                <>
                    {" moved "}
                    <strong>
                        "{activity.taskTitle}"
                    </strong>
                    {" from "}
                    {statusNames[
                        activity.oldStatus
                    ] || activity.oldStatus}
                    {" to "}
                    {statusNames[
                        activity.newStatus
                    ] || activity.newStatus}
                </>
            );

        }


        if (
            activity.type === "deleted"
        ) {

            return (
                <>
                    {" deleted "}
                    <strong>
                        "{activity.taskTitle}"
                    </strong>
                </>
            );

        }


        return (
            <>
                {" updated the project"}
            </>
        );

    };


    /* =========================================================
       ACTIVITY TIME
    ========================================================= */

    const getActivityTime = (
        timestamp
    ) => {

        if (!timestamp) {
            return "";
        }


        const activityDate =
            new Date(timestamp);


        const now = new Date();


        const difference =
            now.getTime() -
            activityDate.getTime();


        const seconds =
            Math.floor(
                difference / 1000
            );


        const minutes =
            Math.floor(
                seconds / 60
            );


        const hours =
            Math.floor(
                minutes / 60
            );


        const days =
            Math.floor(
                hours / 24
            );


        if (seconds < 60) {
            return "Just now";
        }


        if (minutes < 60) {
            return `${minutes}m`;
        }


        if (hours < 24) {
            return `${hours}h`;
        }


        if (days < 7) {
            return `${days}d`;
        }


        return activityDate.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
            }
        );

    };


    /* =========================================================
       DASHBOARD
    ========================================================= */

    return (

        <div className="dashboard-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="dashboard-header">

                <div>

                    <p className="dashboard-label">
                        PROJECT OVERVIEW
                    </p>


                    <h1>
                        Dashboard
                    </h1>


                    <p className="dashboard-subtitle">
                        Here's an overview of your team's task progress.
                    </p>

                </div>


                <Link
                    to="/board"
                    className="dashboard-board-button"
                >
                    Open Development Board →
                </Link>

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="dashboard-statistics">


                {/* TOTAL TASKS */}

                <div className="dashboard-stat-card">

                    <div className="dashboard-stat-icon dashboard-stat-icon-blue">

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                        >

                            <rect
                                x="6"
                                y="5"
                                width="12"
                                height="16"
                                rx="1.5"
                                stroke="white"
                                strokeWidth="1.8"
                            />

                            <path
                                d="M9 5.5V4.5C9 3.67 9.67 3 10.5 3H13.5C14.33 3 15 3.67 15 4.5V5.5"
                                stroke="white"
                                strokeWidth="1.8"
                            />

                            <path
                                d="M9 10H15"
                                stroke="white"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                            <path
                                d="M9 13H15"
                                stroke="white"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                            <path
                                d="M9 16H13"
                                stroke="white"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                        </svg>

                    </div>


                    <div className="dashboard-stat-content">

                        <span className="dashboard-stat-title">
                            Total Tasks
                        </span>


                        <strong className="dashboard-stat-number">
                            {totalTasks}
                        </strong>


                        <span className="dashboard-stat-description">
                            All tasks in project
                        </span>

                    </div>

                </div>


                {/* COMPLETED */}

                <div className="dashboard-stat-card">

                    <div className="dashboard-stat-icon dashboard-stat-icon-green">

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                        >

                            <circle
                                cx="12"
                                cy="12"
                                r="8.5"
                                stroke="white"
                                strokeWidth="1.8"
                            />

                            <path
                                d="M8 12L10.7 14.7L16 9.5"
                                stroke="white"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                        </svg>

                    </div>


                    <div className="dashboard-stat-content">

                        <span className="dashboard-stat-title">
                            Completed
                        </span>


                        <strong className="dashboard-stat-number">
                            {doneCount}
                        </strong>


                        <span className="dashboard-stat-description">
                            {completionPercentage}% of total tasks
                        </span>

                    </div>

                </div>


                {/* IN PROGRESS */}

                <div className="dashboard-stat-card">

                    <div className="dashboard-stat-icon dashboard-stat-icon-orange">

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                        >

                            <circle
                                cx="12"
                                cy="12"
                                r="8.5"
                                stroke="white"
                                strokeWidth="1.8"
                                strokeDasharray="42 12"
                                strokeLinecap="round"
                            />

                            <path
                                d="M12 3.5V6"
                                stroke="white"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                        </svg>

                    </div>


                    <div className="dashboard-stat-content">

                        <span className="dashboard-stat-title">
                            In Progress
                        </span>


                        <strong className="dashboard-stat-number">
                            {doingCount}
                        </strong>


                        <span className="dashboard-stat-description">
                            Tasks in progress
                        </span>

                    </div>

                </div>


                {/* TO DO */}

                <div className="dashboard-stat-card">

                    <div className="dashboard-stat-icon dashboard-stat-icon-purple">

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                        >

                            <rect
                                x="6"
                                y="5"
                                width="12"
                                height="16"
                                rx="1.5"
                                stroke="white"
                                strokeWidth="1.8"
                            />

                            <path
                                d="M9 5.5V4.5C9 3.67 9.67 3 10.5 3H13.5C14.33 3 15 3.67 15 4.5V5.5"
                                stroke="white"
                                strokeWidth="1.8"
                            />

                            <path
                                d="M9 10H15"
                                stroke="white"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                            <path
                                d="M9 13H15"
                                stroke="white"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                            <path
                                d="M9 16H13"
                                stroke="white"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                        </svg>

                    </div>


                    <div className="dashboard-stat-content">

                        <span className="dashboard-stat-title">
                            To Do
                        </span>


                        <strong className="dashboard-stat-number">
                            {todoCount}
                        </strong>


                        <span className="dashboard-stat-description">
                            Tasks remaining
                        </span>

                    </div>

                </div>


                {/* OVERDUE */}

                <div className="dashboard-stat-card dashboard-stat-overdue">

                    <div className="dashboard-stat-icon dashboard-stat-icon-red">

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                        >

                            <path
                                d="M12 4L20 19H4L12 4Z"
                                stroke="white"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                            />

                            <path
                                d="M12 9V13"
                                stroke="white"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                            <circle
                                cx="12"
                                cy="16"
                                r="0.8"
                                fill="white"
                            />

                        </svg>

                    </div>


                    <div className="dashboard-stat-content">

                        <span className="dashboard-stat-title">
                            Overdue
                        </span>


                        <strong className="dashboard-stat-number">
                            {overdueCount}
                        </strong>


                        <span className="dashboard-stat-description">
                            Tasks past due date
                        </span>

                    </div>

                </div>

            </div>


            {/* =================================================
                MAIN DASHBOARD GRID
            ================================================= */}

            <div className="dashboard-main-grid">


                {/* PROJECT PROGRESS */}

                <div
                    className={`dashboard-card dashboard-progress-card ${
                        expandedCards.progress
                            ? ""
                            : "dashboard-card-collapsed"
                    }`}
                >

                    <div className="dashboard-card-header">

                        <div>

                            <span className="dashboard-card-label">
                                PROJECT PROGRESS
                            </span>


                            <h2>
                                Overall completion
                            </h2>

                        </div>


                        <div className="dashboard-card-header-right">

                            <strong className="dashboard-progress-percentage">
                                {completionPercentage}%
                            </strong>


                            <button
                                type="button"
                                className="dashboard-collapse-button"
                                onClick={() =>
                                    toggleCard(
                                        "progress"
                                    )
                                }
                            >
                                {expandedCards.progress
                                    ? "Collapse"
                                    : "Expand"}
                            </button>

                        </div>

                    </div>


                    {expandedCards.progress && (

                        <>

                            <div className="dashboard-progress-bar">

                                <div
                                    className="dashboard-progress-fill"
                                    style={{
                                        width:
                                            `${completionPercentage}%`,
                                    }}
                                />

                            </div>


                            <div className="dashboard-progress-footer">

                                <span>
                                    {doneCount} of {totalTasks} tasks completed
                                </span>


                                <span>
                                    {completionPercentage}% complete
                                </span>

                            </div>

                        </>

                    )}

                </div>


                {/* TASK STATUS */}

                <div
                    className={`dashboard-card ${
                        expandedCards.status
                            ? ""
                            : "dashboard-card-collapsed"
                    }`}
                >

                    <div className="dashboard-card-header">

                        <div>

                            <span className="dashboard-card-label">
                                TASK STATUS
                            </span>


                            <h2>
                                Task distribution
                            </h2>

                        </div>


                        <button
                            type="button"
                            className="dashboard-collapse-button"
                            onClick={() =>
                                toggleCard(
                                    "status"
                                )
                            }
                        >
                            {expandedCards.status
                                ? "Collapse"
                                : "Expand"}
                        </button>

                    </div>


                    {expandedCards.status && (

                        <div className="dashboard-status-list">

                            <div className="dashboard-status-item">

                                <div className="dashboard-status-name">

                                    <span className="status-dot todo-dot" />

                                    To Do

                                </div>


                                <strong>
                                    {todoCount}
                                </strong>

                            </div>


                            <div className="dashboard-status-item">

                                <div className="dashboard-status-name">

                                    <span className="status-dot doing-dot" />

                                    Doing

                                </div>


                                <strong>
                                    {doingCount}
                                </strong>

                            </div>


                            <div className="dashboard-status-item">

                                <div className="dashboard-status-name">

                                    <span className="status-dot done-dot" />

                                    Done

                                </div>


                                <strong>
                                    {doneCount}
                                </strong>

                            </div>

                        </div>

                    )}

                </div>

            </div>


            {/* =================================================
                BOTTOM GRID
            ================================================= */}

            <div className="dashboard-bottom-grid">


                {/* UPCOMING DEADLINES */}

                <div
                    className={`dashboard-card ${
                        expandedCards.deadlines
                            ? ""
                            : "dashboard-card-collapsed"
                    }`}
                >

                    <div className="dashboard-card-header">

                        <div>

                            <span className="dashboard-card-label">
                                UPCOMING DEADLINES
                            </span>


                            <h2>
                                Tasks coming up
                            </h2>

                        </div>


                        <button
                            type="button"
                            className="dashboard-collapse-button"
                            onClick={() =>
                                toggleCard(
                                    "deadlines"
                                )
                            }
                        >
                            {expandedCards.deadlines
                                ? "Collapse"
                                : "Expand"}
                        </button>

                    </div>


                    {expandedCards.deadlines && (

                        <div className="dashboard-deadlines">

                            {upcomingTasks.length === 0 ? (

                                <p className="dashboard-empty-message">
                                    No upcoming deadlines.
                                </p>

                            ) : (

                                upcomingTasks.map(
                                    (task) => (

                                        <div
                                            className="dashboard-deadline"
                                            key={task.id}
                                        >

                                            <div>

                                                <strong>
                                                    {task.title}
                                                </strong>


                                                <span>
                                                    {getDeadlineText(
                                                        task.deadline
                                                    )}
                                                </span>

                                            </div>


                                            <span className="deadline-badge">

                                                {getDeadlineBadge(
                                                    task.deadline
                                                )}

                                            </span>

                                        </div>

                                    )
                                )

                            )}

                        </div>

                    )}

                </div>


                {/* RECENT ACTIVITY */}

                <div
                    className={`dashboard-card ${
                        expandedCards.activity
                            ? ""
                            : "dashboard-card-collapsed"
                    }`}
                >

                    <div className="dashboard-card-header">

                        <div>

                            <span className="dashboard-card-label">
                                RECENT ACTIVITY
                            </span>


                            <h2>
                                Team activity
                            </h2>

                        </div>


                        <button
                            type="button"
                            className="dashboard-collapse-button"
                            onClick={() =>
                                toggleCard(
                                    "activity"
                                )
                            }
                        >
                            {expandedCards.activity
                                ? "Collapse"
                                : "Expand"}
                        </button>

                    </div>


                    {expandedCards.activity && (

                        <div className="dashboard-activity">

                            {activities.length === 0 ? (

                                <p className="dashboard-empty-message">
                                    No recent activity yet.
                                </p>

                            ) : (

                                activities
                                    .slice(0, 5)
                                    .map(
                                        (activity) => (

                                            <div
                                                className="dashboard-activity-item"
                                                key={activity.id}
                                            >

                                                <div className="activity-avatar">

                                                    {activity.member
                                                        ?.charAt(0)
                                                        ?.toUpperCase() ||
                                                        "T"}

                                                </div>


                                                <div>

                                                    <strong>
                                                        {activity.member ||
                                                            "Team Member"}
                                                    </strong>


                                                    <span>
                                                        {getActivityText(
                                                            activity
                                                        )}
                                                    </span>

                                                </div>


                                                <small>
                                                    {getActivityTime(
                                                        activity.timestamp
                                                    )}
                                                </small>

                                            </div>

                                        )
                                    )

                            )}

                        </div>

                    )}

                </div>


                {/* RECENTLY FINISHED */}

                <div
                    className={`dashboard-card ${
                        expandedCards.finished
                            ? ""
                            : "dashboard-card-collapsed"
                    }`}
                >

                    <div className="dashboard-card-header">

                        <div>

                            <span className="dashboard-card-label">
                                RECENTLY FINISHED
                            </span>


                            <h2>
                                Completed tasks
                            </h2>

                        </div>


                        <button
                            type="button"
                            className="dashboard-collapse-button"
                            onClick={() =>
                                toggleCard(
                                    "finished"
                                )
                            }
                        >
                            {expandedCards.finished
                                ? "Collapse"
                                : "Expand"}
                        </button>

                    </div>


                    {expandedCards.finished && (

                        <div className="dashboard-finished-tasks">

                            {recentlyFinishedTasks.length === 0 ? (

                                <p className="dashboard-empty-message">
                                    No completed tasks yet.
                                </p>

                            ) : (

                                recentlyFinishedTasks.map(
                                    (task) => (

                                        <div
                                            className="dashboard-finished-task"
                                            key={task.id}
                                        >

                                            <div className="finished-task-check">
    <img
        src={checkIcon}
        alt="Completed"
    />
</div>


                                            <div className="finished-task-info">

                                                <strong>
                                                    {task.title}
                                                </strong>


                                                <span>
                                                    {task.assignee ||
                                                        "Team Member"}
                                                </span>

                                            </div>


                                            <span className="finished-task-status">
                                                Completed
                                            </span>

                                        </div>

                                    )
                                )

                            )}

                        </div>

                    )}

                </div>

            </div>


            {/* =================================================
                TEAM TASK SUMMARY
            ================================================= */}

            <div
                className={`dashboard-card dashboard-team-card ${
                    expandedCards.team
                        ? ""
                        : "dashboard-card-collapsed"
                }`}
            >

                <div className="dashboard-card-header">

                    <div>

                        <span className="dashboard-card-label">
                            TEAM TASK SUMMARY
                        </span>


                        <h2>
                            Team performance
                        </h2>

                    </div>


                    <button
                        type="button"
                        className="dashboard-collapse-button"
                        onClick={() =>
                            toggleCard("team")
                        }
                    >
                        {expandedCards.team
                            ? "Collapse"
                            : "Expand"}
                    </button>

                </div>


                {expandedCards.team && (

                    <div className="dashboard-team-list">

                        {teamPerformance.map(
                            (member) => (

                                <div
                                    className="dashboard-team-member"
                                    key={member.name}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "100%",
                                    }}
                                >

                                    {/* AVATAR */}

                                    <div
                                        className="team-member-info"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "12px",
                                            minWidth: "280px",
                                        }}
                                    >

                                        <div className="team-avatar">
                                            {member.avatar}
                                        </div>


                                        <div>

                                            <strong>
                                                {member.name}
                                            </strong>


                                            <span>
                                                {member.total}{" "}
                                                {member.total === 1
                                                    ? "task"
                                                    : "tasks"}
                                                {" · "}
                                                {member.completed}{" "}
                                                completed
                                            </span>

                                        </div>

                                    </div>


                                    {/* PROGRESS */}

                                    <div
                                        className="team-progress"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "14px",
                                            flex: 1,
                                        }}
                                    >

                                        <div
                                            className="team-progress-bar"
                                            style={{
                                                flex: 1,
                                            }}
                                        >

                                            <div
                                                style={{
                                                    width:
                                                        `${member.percentage}%`,
                                                }}
                                            />

                                        </div>


                                        <strong
                                            style={{
                                                minWidth: "45px",
                                                textAlign: "right",
                                            }}
                                        >
                                            {member.percentage}%
                                        </strong>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


            {/* =================================================
                LEADERBOARD
            ================================================= */}

            <div
                className={`dashboard-card dashboard-leaderboard-card ${
                    expandedCards.leaderboard
                        ? ""
                        : "dashboard-card-collapsed"
                }`}
            >

                <div className="dashboard-card-header">

                    <div>

                        <span className="dashboard-card-label">
                            LEADERBOARD
                        </span>


                        <h2>
                            Top Team Members
                        </h2>

                    </div>


                    <button
                        type="button"
                        className="dashboard-collapse-button"
                        onClick={() =>
                            toggleCard(
                                "leaderboard"
                            )
                        }
                    >
                        {expandedCards.leaderboard
                            ? "Collapse"
                            : "Expand"}
                    </button>

                </div>


                {expandedCards.leaderboard && (

                    <div className="dashboard-leaderboard">

                        {leaderboard.map(
                            (member, index) => (

                                <div
                                    className="dashboard-leaderboard-item"
                                    key={member.name}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "100%",
                                        gap: "16px",
                                    }}
                                >

                                    {/* RANK */}

                                    <div
                                        className="leaderboard-rank"
                                        style={{
                                            width: "30px",
                                            textAlign: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {index + 1}
                                    </div>


                                    {/* AVATAR */}

                                    <div
                                        className="leaderboard-avatar"
                                        style={{
                                            width: "42px",
                                            height: "42px",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {member.avatar}
                                    </div>

{/* NAME */}

<div className="leaderboard-member-info">

    <strong>
        {member.name}
    </strong>

    <span>
        {member.completed} completed
    </span>

</div>

                                    {/* PROGRESS */}

                                    <div
                                        className="leaderboard-score"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "40px",
                                            flex: 1,
                                        }}
                                    >

                                        <div
                                            className="leaderboard-progress"
                                            style={{
                                                flex: 1,
                                            }}
                                        >

                                            <div
                                                style={{
                                                    width:
                                                        `${member.percentage}%`,
                                                }}
                                            />

                                        </div>


                                        <strong
                                            style={{
                                                minWidth: "50px",
                                                textAlign: "right",
                                            }}
                                        >
                                            {member.percentage}%
                                        </strong>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>

    );

}


export default DashboardPage;