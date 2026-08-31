export const defaultUsers = [
    {
        id: 1,
        username: "kasun",
        name: "Kasun Perera",
        email: "kasun@collabboard.com",
        avatar: null,
    },
    {
        id: 2,
        username: "nethmi",
        name: "Nethmi Silva",
        email: "nethmi@collabboard.com",
        avatar: null,
    },
    {
        id: 3,
        username: "sachini",
        name: "Sachini Fernando",
        email: "sachini@collabboard.com",
        avatar: null,
    },
    {
        id: 4,
        username: "amila",
        name: "Amila Jayasinghe",
        email: "amila@collabboard.com",
        avatar: null,
    },
    {
        id: 5,
        username: "tharindu",
        name: "Tharindu Perera",
        email: "tharindu@collabboard.com",
        avatar: null,
    },
];


export const defaultGroups = [
    {
        id: 1,
        name: "CollabBoard Development",
        description: "Main development team",
        userIds: [1, 2, 3],
    },
    {
        id: 2,
        name: "UI UX Team",
        description: "Design and interface team",
        userIds: [2, 3, 4],
    },
];


export const defaultProjects = [
    {
        id: 1,
        name: "CollabBoard",
        description: "Main CollabBoard application",
        ownerId: 1,
        userIds: [1, 2, 3, 4],
        createdAt: "2026-08-20",
    },
    {
        id: 2,
        name: "Mobile Application",
        description: "Future mobile version",
        ownerId: 1,
        userIds: [1, 2, 5],
        createdAt: "2026-08-21",
    },
];


export const defaultTasks = [
    {
        id: 1,
        projectId: 1,
        title: "Design Login Page",
        description: "Create the initial login interface",
        status: "todo",
        priority: "High",
        assigneeIds: [2, 3],
        deadline: "2026-08-23",
    },
    {
        id: 2,
        projectId: 1,
        title: "Create Dashboard",
        description: "Build the main dashboard interface",
        status: "doing",
        priority: "High",
        assigneeIds: [1, 2],
        deadline: "2026-08-30",
    },
    {
        id: 3,
        projectId: 1,
        title: "Member Insights",
        description: "Create member productivity insights page",
        status: "todo",
        priority: "Medium",
        assigneeIds: [2, 3, 4],
        deadline: "2026-08-28",
    },
    {
        id: 4,
        projectId: 2,
        title: "Mobile UI Research",
        description: "Research mobile interface",
        status: "done",
        priority: "Low",
        assigneeIds: [1, 5],
        deadline: "2026-08-25",
    },
];
