import groups from "../data/groups.js";
import users from "../data/users.js";

// ========================================
// GET ALL GROUPS
// ========================================

export const getGroups = (req, res) => {
  res.status(200).json(groups);
};

// ========================================
// GET GROUP BY ID
// ========================================

export const getGroupById = (req, res) => {
  const groupId = Number(req.params.id);

  const group = groups.find(
    (group) => group.id === groupId
  );

  if (!group) {
    return res.status(404).json({
      message: "Group not found.",
    });
  }

  res.status(200).json(group);
};

// ========================================
// CREATE GROUP
// ========================================

export const createGroup = (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Group name is required.",
    });
  }

  const newGroup = {
    id:
      groups.length > 0
        ? Math.max(...groups.map((group) => group.id)) + 1
        : 1,

    name: name.trim(),

    description: description
      ? description.trim()
      : "",

    createdBy: req.user.userId,

    memberIds: [req.user.userId],
  };

  groups.push(newGroup);

  res.status(201).json({
    message: "Group created successfully.",
    group: newGroup,
  });
};

// ========================================
// UPDATE GROUP
// ========================================

export const updateGroup = (req, res) => {
  const groupId = Number(req.params.id);

  const group = groups.find(
    (group) => group.id === groupId
  );

  if (!group) {
    return res.status(404).json({
      message: "Group not found.",
    });
  }

  const { name, description } = req.body;

  if (name !== undefined) {
    if (!name.trim()) {
      return res.status(400).json({
        message: "Group name cannot be empty.",
      });
    }

    group.name = name.trim();
  }

  if (description !== undefined) {
    group.description = description.trim();
  }

  res.status(200).json({
    message: "Group updated successfully.",
    group,
  });
};

// ========================================
// DELETE GROUP
// ========================================

export const deleteGroup = (req, res) => {
  const groupId = Number(req.params.id);

  const groupIndex = groups.findIndex(
    (group) => group.id === groupId
  );

  if (groupIndex === -1) {
    return res.status(404).json({
      message: "Group not found.",
    });
  }

  const deletedGroup = groups.splice(groupIndex, 1)[0];

  res.status(200).json({
    message: "Group deleted successfully.",
    group: deletedGroup,
  });
};

// ========================================
// ADD MEMBER
// ========================================

export const addGroupMember = (req, res) => {
  const groupId = Number(req.params.id);
  const userId = Number(req.body.userId);

  const group = groups.find(
    (group) => group.id === groupId
  );

  if (!group) {
    return res.status(404).json({
      message: "Group not found.",
    });
  }

  if (!userId) {
    return res.status(400).json({
      message: "User ID is required.",
    });
  }

  const userExists = users.some(
    (user) => user.id === userId
  );

  if (!userExists) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  if (group.memberIds.includes(userId)) {
    return res.status(409).json({
      message: "User is already a group member.",
    });
  }

  group.memberIds.push(userId);

  res.status(200).json({
    message: "Member added successfully.",
    group,
  });
};

// ========================================
// REMOVE MEMBER
// ========================================

export const removeGroupMember = (req, res) => {
  const groupId = Number(req.params.id);
  const userId = Number(req.params.userId);

  const group = groups.find(
    (group) => group.id === groupId
  );

  if (!group) {
    return res.status(404).json({
      message: "Group not found.",
    });
  }

  if (!group.memberIds.includes(userId)) {
    return res.status(404).json({
      message: "User is not a member of this group.",
    });
  }

  group.memberIds = group.memberIds.filter(
    (id) => id !== userId
  );

  res.status(200).json({
    message: "Member removed successfully.",
    group,
  });
};