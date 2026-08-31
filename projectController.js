import projects from "../data/projects.js";

// ========================================
// GET ALL PROJECTS
// ========================================

export const getProjects = (req, res) => {
  res.status(200).json(projects);
};

// ========================================
// GET PROJECT BY ID
// ========================================

export const getProjectById = (req, res) => {
  const projectId = Number(req.params.id);

  const project = projects.find(
    (project) => project.id === projectId
  );

  if (!project) {
    return res.status(404).json({
      message: "Project not found.",
    });
  }

  res.status(200).json(project);
};

// ========================================
// CREATE PROJECT
// ========================================

export const createProject = (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Project name is required.",
    });
  }

  const newProject = {
    id:
      projects.length > 0
        ? Math.max(...projects.map((project) => project.id)) + 1
        : 1,

    name: name.trim(),
    description: description ? description.trim() : "",

    ownerId: req.user.userId,

    memberIds: [req.user.userId],

    status: "active",
  };

  projects.push(newProject);

  res.status(201).json({
    message: "Project created successfully.",
    project: newProject,
  });
};

// ========================================
// UPDATE PROJECT
// ========================================

export const updateProject = (req, res) => {
  const projectId = Number(req.params.id);

  const project = projects.find(
    (project) => project.id === projectId
  );

  if (!project) {
    return res.status(404).json({
      message: "Project not found.",
    });
  }

  const { name, description, status } = req.body;

  if (name !== undefined) {
    if (!name.trim()) {
      return res.status(400).json({
        message: "Project name cannot be empty.",
      });
    }

    project.name = name.trim();
  }

  if (description !== undefined) {
    project.description = description.trim();
  }

  if (status !== undefined) {
    project.status = status;
  }

  res.status(200).json({
    message: "Project updated successfully.",
    project,
  });
};

// ========================================
// DELETE PROJECT
// ========================================

export const deleteProject = (req, res) => {
  const projectId = Number(req.params.id);

  const projectIndex = projects.findIndex(
    (project) => project.id === projectId
  );

  if (projectIndex === -1) {
    return res.status(404).json({
      message: "Project not found.",
    });
  }

  const deletedProject = projects.splice(projectIndex, 1)[0];

  res.status(200).json({
    message: "Project deleted successfully.",
    project: deletedProject,
  });
};

// ========================================
// ADD MEMBER TO PROJECT
// ========================================

export const addProjectMember = (req, res) => {
  const projectId = Number(req.params.id);
  const userId = Number(req.body.userId);

  const project = projects.find(
    (project) => project.id === projectId
  );

  if (!project) {
    return res.status(404).json({
      message: "Project not found.",
    });
  }

  if (!userId) {
    return res.status(400).json({
      message: "User ID is required.",
    });
  }

  if (project.memberIds.includes(userId)) {
    return res.status(409).json({
      message: "User is already a project member.",
    });
  }

  project.memberIds.push(userId);

  res.status(200).json({
    message: "Member added successfully.",
    project,
  });
};

// ========================================
// REMOVE MEMBER FROM PROJECT
// ========================================

export const removeProjectMember = (req, res) => {
  const projectId = Number(req.params.id);
  const userId = Number(req.params.userId);

  const project = projects.find(
    (project) => project.id === projectId
  );

  if (!project) {
    return res.status(404).json({
      message: "Project not found.",
    });
  }

  project.memberIds = project.memberIds.filter(
    (id) => id !== userId
  );

  res.status(200).json({
    message: "Member removed successfully.",
    project,
  });
};