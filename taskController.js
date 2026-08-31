import tasks from "../data/tasks.js";

// ========================================
// VALIDATION CONSTANTS
// ========================================

const VALID_STATUSES = [
  "todo",
  "doing",
  "done",
];

const VALID_PRIORITIES = [
  "low",
  "medium",
  "high",
];


// ========================================
// GET ALL TASKS
// ========================================

export const getTasks = (req, res) => {
  res.status(200).json(tasks);
};


// ========================================
// GET SINGLE TASK
// ========================================

export const getTaskById = (req, res) => {
  const taskId = Number(req.params.id);

  const task = tasks.find(
    (task) => task.id === taskId
  );

  if (!task) {
    return res.status(404).json({
      message: "Task not found.",
    });
  }

  res.status(200).json(task);
};


// ========================================
// CREATE TASK
// ========================================

export const createTask = (req, res) => {
  const {
    title,
    description,
    status,
    priority,
    assigneeIds,
    deadline,
    projectId,
  } = req.body;

  // Required fields
  if (!title || !description) {
    return res.status(400).json({
      message:
        "Title and description are required.",
    });
  }

  const cleanTitle = title.trim();
  const cleanDescription =
    description.trim();

  // Make sure title isn't empty after trimming
  if (!cleanTitle) {
    return res.status(400).json({
      message: "Title cannot be empty.",
    });
  }

  // Make sure description isn't empty after trimming
  if (!cleanDescription) {
    return res.status(400).json({
      message:
        "Description cannot be empty.",
    });
  }

  // Validate status
  const taskStatus =
    status || "todo";

  if (
    !VALID_STATUSES.includes(
      taskStatus
    )
  ) {
    return res.status(400).json({
      message:
        "Invalid status. Allowed values: todo, doing, done.",
    });
  }

  // Validate and normalize priority
  const taskPriority = String(
    priority || "medium"
  ).toLowerCase();

  if (
    !VALID_PRIORITIES.includes(
      taskPriority
    )
  ) {
    return res.status(400).json({
      message:
        "Invalid priority. Allowed values: low, medium, high.",
    });
  }

  // Validate assigneeIds
  if (
    assigneeIds !== undefined &&
    !Array.isArray(assigneeIds)
  ) {
    return res.status(400).json({
      message:
        "assigneeIds must be an array.",
    });
  }

  // Create new task
  const newTask = {
    id:
      tasks.length > 0
        ? Math.max(
            ...tasks.map(
              (task) => task.id
            )
          ) + 1
        : 1,

    title: cleanTitle,

    description:
      cleanDescription,

    status: taskStatus,

    priority:
      taskPriority,

    assigneeIds:
      Array.isArray(assigneeIds)
        ? assigneeIds
        : [],

    deadline:
      deadline || null,

    projectId:
      projectId !== undefined
        ? projectId
        : null,

    createdBy:
      req.user.userId,
  };

  tasks.push(newTask);

  res.status(201).json({
    message:
      "Task created successfully.",
    task: newTask,
  });
};


// ========================================
// UPDATE TASK
// ========================================

export const updateTask = (req, res) => {
  const taskId =
    Number(req.params.id);

  const task = tasks.find(
    (task) =>
      task.id === taskId
  );

  if (!task) {
    return res.status(404).json({
      message:
        "Task not found.",
    });
  }

  const {
    title,
    description,
    status,
    priority,
    assigneeIds,
    deadline,
    projectId,
  } = req.body;


  // ========================================
  // UPDATE TITLE
  // ========================================

  if (title !== undefined) {
    const cleanTitle =
      String(title).trim();

    if (!cleanTitle) {
      return res.status(400).json({
        message:
          "Title cannot be empty.",
      });
    }

    task.title =
      cleanTitle;
  }


  // ========================================
  // UPDATE DESCRIPTION
  // ========================================

  if (description !== undefined) {
    const cleanDescription =
      String(description).trim();

    if (!cleanDescription) {
      return res.status(400).json({
        message:
          "Description cannot be empty.",
      });
    }

    task.description =
      cleanDescription;
  }


  // ========================================
  // UPDATE STATUS
  // ========================================

  if (status !== undefined) {
    if (
      !VALID_STATUSES.includes(
        status
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid status. Allowed values: todo, doing, done.",
      });
    }

    task.status =
      status;
  }


  // ========================================
  // UPDATE PRIORITY
  // ========================================

  if (priority !== undefined) {
    const normalizedPriority =
      String(priority).toLowerCase();

    if (
      !VALID_PRIORITIES.includes(
        normalizedPriority
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid priority. Allowed values: low, medium, high.",
      });
    }

    task.priority =
      normalizedPriority;
  }


  // ========================================
  // ASSIGN / REASSIGN TASK
  // TEAM LEADER ONLY
  // ========================================

  if (
    assigneeIds !== undefined
  ) {

    // Only Team Lead can assign/reassign
    if (
      req.user.role !== "Team Lead"
    ) {
      return res.status(403).json({
        message:
          "Only the Team Lead can assign tasks to members.",
      });
    }

    // Must be an array
    if (
      !Array.isArray(assigneeIds)
    ) {
      return res.status(400).json({
        message:
          "assigneeIds must be an array.",
      });
    }

    task.assigneeIds =
      assigneeIds;
  }


  // ========================================
  // UPDATE DEADLINE
  // ========================================

  if (
    deadline !== undefined
  ) {
    task.deadline =
      deadline || null;
  }


  // ========================================
  // UPDATE PROJECT
  // ========================================

  if (
    projectId !== undefined
  ) {
    task.projectId =
      projectId || null;
  }


  res.status(200).json({
    message:
      "Task updated successfully.",
    task,
  });
};


// ========================================
// DELETE TASK
// ========================================

export const deleteTask = (req, res) => {
  const taskId =
    Number(req.params.id);

  const taskIndex =
    tasks.findIndex(
      (task) =>
        task.id === taskId
    );

  if (taskIndex === -1) {
    return res.status(404).json({
      message:
        "Task not found.",
    });
  }

  const deletedTask =
    tasks.splice(
      taskIndex,
      1
    )[0];

  res.status(200).json({
    message:
      "Task deleted successfully.",
    task: deletedTask,
  });
};