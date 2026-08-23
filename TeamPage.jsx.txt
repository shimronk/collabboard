import {
    useEffect,
    useState,
} from "react";

import Navbar from "../components/Navbar";
import editIcon from "../assets/icons/edit.png";
import deleteIcon from "../assets/icons/delete.png";


function Team({ tasks = [] }) {

    /* =========================================================
       GET SAVED MEMBER PROFILES
    ========================================================= */

    const getSavedMembers = () => {

        const savedMembers =
            localStorage.getItem(
                "collabboardTeamMembers"
            );

        if (savedMembers) {

            try {
                return JSON.parse(savedMembers);
            } catch {
                return null;
            }

        }

        return null;
    };


    /* =========================================================
       TEAM MEMBERS
    ========================================================= */

    const defaultMembers = [
        {
            id: 1,
            name: "Member 1",
            role: "Team Leader",
            email: "member1@collabboard.com",
            image: null,
            status: "online",
        },
        {
            id: 2,
            name: "Member 2",
            role: "Developer",
            email: "member2@example.com",
            status: "online",
            image: null,
        },
        {
            id: 3,
            name: "Member 3",
            role: "UI/UX Designer",
            email: "member3@example.com",
            image: null,
            status: "online",
        },
        {
            id: 4,
            name: "Member 4",
            role: "Developer",
            email: "member4@example.com",
            image: null,
            status: "offline",
        },
        {
            id: 5,
            name: "Member 5",
            role: "QA Engineer",
            email: "member5@example.com",
            image: null,
            status: "online",
        },
        {
            id: 6,
            name: "Member 6",
            role: "Developer",
            email: "member6@example.com",
            image: null,
            status: "online",
        },
        {
            id: 7,
            name: "Member 7",
            role: "Developer",
            email: "member7@example.com",
            image: null,
            status: "online",
        },
    ];


    const [members, setMembers] = useState(() => {

        const savedMembers =
            getSavedMembers();

        return savedMembers || defaultMembers;

    });


    /* =========================================================
       SAVE MEMBERS
    ========================================================= */

    useEffect(() => {

        localStorage.setItem(
            "collabboardTeamMembers",
            JSON.stringify(members)
        );

    }, [members]);


    /* =========================================================
       TASKS
    ========================================================= */

    const [teamTasks, setTeamTasks] = useState(() => {

        const savedTasks =
            localStorage.getItem(
                "collabboardTasks"
            );

        if (savedTasks) {

            try {
                return JSON.parse(savedTasks);
            } catch {
                return tasks;
            }

        }

        return tasks;

    });


    /* =========================================================
       LIVE TASK UPDATE
    ========================================================= */

    useEffect(() => {

        const updateTeamTasks = () => {

            const savedTasks =
                localStorage.getItem(
                    "collabboardTasks"
                );

            if (!savedTasks) {
                return;
            }

            try {

                setTeamTasks(
                    JSON.parse(savedTasks)
                );

            } catch {
                // Ignore invalid storage data
            }

        };


        window.addEventListener(
            "collabboardTasksUpdated",
            updateTeamTasks
        );


        window.addEventListener(
            "storage",
            updateTeamTasks
        );


        updateTeamTasks();


        return () => {

            window.removeEventListener(
                "collabboardTasksUpdated",
                updateTeamTasks
            );


            window.removeEventListener(
                "storage",
                updateTeamTasks
            );

        };

    }, []);


    /* =========================================================
       SEARCH
    ========================================================= */

    const [searchTerm, setSearchTerm] =
        useState("");


    /* =========================================================
       ROLE FILTER
    ========================================================= */

    const [roleFilter, setRoleFilter] =
        useState("All Roles");


    /* =========================================================
       MEMBER MODAL
    ========================================================= */

    const [showAddMember, setShowAddMember] =
        useState(false);

    const [openMenuId, setOpenMenuId] =
        useState(null);

    const [editingMember, setEditingMember] =
        useState(null);


    /* =========================================================
       NEW MEMBER DATA
    ========================================================= */

    const [newMember, setNewMember] =
        useState({
            name: "",
            role: "Developer",
            email: "",
            image: null,
        });


    /* =========================================================
       PROFILE PHOTO CHANGE
    ========================================================= */

    const handleProfilePhotoChange = (
        event
    ) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }


        /* Only allow image files */

        if (!file.type.startsWith("image/")) {

            alert(
                "Please select an image file."
            );

            return;

        }


        /* Limit image size to 5MB */

        if (file.size > 5 * 1024 * 1024) {

            alert(
                "Profile photo must be smaller than 5MB."
            );

            return;

        }


        const reader =
            new FileReader();


        reader.onload = () => {

            setNewMember(
                (previous) => ({
                    ...previous,
                    image: reader.result,
                })
            );

        };


        reader.readAsDataURL(file);

    };


    /* =========================================================
       REMOVE PROFILE PHOTO
    ========================================================= */

    const handleRemoveProfilePhoto = () => {

        setNewMember(
            (previous) => ({
                ...previous,
                image: null,
            })
        );

    };


    /* =========================================================
       ADD / EDIT MEMBER
    ========================================================= */

    const handleSaveMember = (
        event
    ) => {

        event.preventDefault();


        if (
            !newMember.name.trim() ||
            !newMember.email.trim()
        ) {

            return;

        }


        /* =====================================================
           EDIT EXISTING MEMBER
        ===================================================== */

        if (editingMember) {

            setMembers(
                (previousMembers) =>

                    previousMembers.map(
                        (member) =>

                            member.id ===
                            editingMember.id

                                ? {
                                      ...member,

                                      name:
                                          newMember.name.trim(),

                                      email:
                                          newMember.email.trim(),

                                      role:
                                          newMember.role,

                                      image:
                                          newMember.image ||
                                          null,
                                  }

                                : member
                    )
            );


            setEditingMember(null);

        }


        /* =====================================================
           ADD NEW MEMBER
        ===================================================== */

        else {

            const member = {

                id: Date.now(),

                name:
                    newMember.name.trim(),

                role:
                    newMember.role,

                email:
                    newMember.email.trim(),

                image:
                    newMember.image || null,

                status:
                    "online",

            };


            setMembers(
                (previousMembers) => [
                    ...previousMembers,
                    member,
                ]
            );

        }


        /* Reset form */

        setNewMember({
            name: "",
            role: "Developer",
            email: "",
            image: null,
        });


        setShowAddMember(false);

    };


    /* =========================================================
       EDIT MEMBER
    ========================================================= */

    const handleEditMember = (
        member
    ) => {

        setEditingMember(member);


        setNewMember({

            name:
                member.name,

            email:
                member.email,

            role:
                member.role,

            image:
                member.image || null,

        });


        setOpenMenuId(null);

        setShowAddMember(true);

    };


    /* =========================================================
       DELETE MEMBER
    ========================================================= */

    const handleDeleteMember = (
        member
    ) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete ${member.name}?`
            );


        if (!confirmed) {
            return;
        }


        setMembers(
            (previousMembers) =>

                previousMembers.filter(
                    (currentMember) =>
                        currentMember.id !==
                        member.id
                )
        );


        setOpenMenuId(null);

    };


    /* =========================================================
       FILTER MEMBERS
    ========================================================= */

    const filteredMembers =
        members.filter((member) => {

            const searchValue =
                searchTerm
                    .toLowerCase()
                    .trim();


            const matchesSearch =
                member.name
                    .toLowerCase()
                    .includes(searchValue) ||

                member.email
                    .toLowerCase()
                    .includes(searchValue);


            const matchesRole =
                roleFilter ===
                    "All Roles" ||

                member.role ===
                    roleFilter;


            return (
                matchesSearch &&
                matchesRole
            );

        });


    /* =========================================================
       TEAM STATISTICS
    ========================================================= */

    const totalMembers =
        members.length;


    const totalTasks =
        teamTasks.length;


    const completedTasks =
        teamTasks.filter(
            (task) =>
                task.status === "done"
        ).length;


    /* =========================================================
       AVATAR INITIALS
    ========================================================= */

    const getInitials = (
        name
    ) => {

        const words =
            name.trim().split(" ");


        if (words.length === 1) {

            return words[0]
                .charAt(0)
                .toUpperCase();

        }


        return (
            words[0].charAt(0) +
            words[
                words.length - 1
            ].charAt(0)
        ).toUpperCase();

    };


    /* =========================================================
       PAGE
    ========================================================= */

    return (

        <>

            <Navbar />


            <div className="team-page">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="team-header">

                    <div>

                        <p className="team-label">
                            WORKSPACE MEMBERS
                        </p>


                        <h1>
                            Team Members
                        </h1>


                        <p className="team-subtitle">
                            Manage your workspace members
                            and their responsibilities.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="team-add-button"
                        onClick={() => {

                            setEditingMember(null);

                            setNewMember({
                                name: "",
                                role: "Developer",
                                email: "",
                                image: null,
                            });

                            setShowAddMember(true);

                        }}
                    >
                        + Add Member
                    </button>

                </div>


                {/* =================================================
                    SEARCH + ROLE FILTER
                ================================================= */}

                <div className="team-toolbar">

                    <div className="team-search">

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                        >

                            <circle
                                cx="11"
                                cy="11"
                                r="7"
                                stroke="currentColor"
                                strokeWidth="2"
                            />

                            <path
                                d="M16 16L21 21"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />

                        </svg>


                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <select
                        className="team-role-filter"
                        value={roleFilter}
                        onChange={(event) =>
                            setRoleFilter(
                                event.target.value
                            )
                        }
                    >

                        <option>
                            All Roles
                        </option>

                        <option>
                            Team Leader
                        </option>

                        <option>
                            Developer
                        </option>

                        <option>
                            UI/UX Designer
                        </option>

                        <option>
                            QA Engineer
                        </option>

                    </select>

                </div>


                {/* =================================================
                    MEMBER CARDS
                ================================================= */}

                <div className="team-members-grid">

                    {filteredMembers.length === 0 ? (

                        <div className="team-empty-state">

                            <div className="team-empty-icon">
                                👥
                            </div>

                            <h3>
                                No members found
                            </h3>

                            <p>
                                Try changing your search
                                or role filter.
                            </p>

                        </div>

                    ) : (

                        filteredMembers.map(
                            (member) => (

                                <div
                                    className="team-member-card"
                                    key={member.id}
                                >


                                    {/* MEMBER TOP */}

                                    <div className="team-member-top">

                                        <div className="team-avatar-wrapper">

                                            <div className="team-member-avatar">

                                                {member.image ? (

                                                    <img
                                                        src={
                                                            member.image
                                                        }
                                                        alt={
                                                            member.name
                                                        }
                                                    />

                                                ) : (

                                                    getInitials(
                                                        member.name
                                                    )

                                                )}

                                            </div>


                                            <span
                                                className={`team-status-dot ${
                                                    member.status ===
                                                    "online"
                                                        ? "online"
                                                        : "offline"
                                                }`}
                                            />

                                        </div>


                                        {/* MENU */}

                                        <div className="team-member-menu">

                                            <button
                                                type="button"
                                                className="team-more-button"
                                                aria-label={`More options for ${member.name}`}
                                                onClick={() =>
                                                    setOpenMenuId(
                                                        openMenuId ===
                                                            member.id
                                                            ? null
                                                            : member.id
                                                    )
                                                }
                                            >
                                                ⋮
                                            </button>


                                            {openMenuId ===
                                                member.id && (

                                                <div className="team-dropdown-menu">
 <button
    type="button"
    onClick={() =>
        handleEditMember(member)
    }
>
    <span className="team-menu-icon">
        <img
            src={editIcon}
            alt=""
        />
    </span>

    Edit Member
</button>


<button
    type="button"
    className="team-delete-option"
    onClick={() =>
        handleDeleteMember(member)
    }
>
    <span className="team-menu-icon">
        <img
            src={deleteIcon}
            alt=""
        />
    </span>

    Delete Member
</button>                             

                                                </div>

                                            )}

                                        </div>

                                    </div>


                                    {/* MEMBER INFORMATION */}

                                    <div className="team-member-details">

                                        <h3>
                                            {member.name}
                                        </h3>


                                        <span className="team-member-role">
                                            {member.role}
                                        </span>


                                        <p>
                                            {member.email}
                                        </p>

                                    </div>


                                    {/* MEMBER STATUS */}

                                    <div className="team-member-footer">

                                        <span
                                            className={`team-online-status ${
                                                member.status ===
                                                "online"
                                                    ? "is-online"
                                                    : "is-offline"
                                            }`}
                                        >

                                            <span />

                                            {member.status ===
                                            "online"
                                                ? "Online"
                                                : "Offline"}

                                        </span>

                                    </div>

                                </div>

                            )
                        )

                    )}

                </div>


                {/* =================================================
                    BOTTOM STATISTICS
                ================================================= */}

                <div className="team-statistics">


                    {/* TOTAL MEMBERS */}

                    <div className="team-stat-card">

                        <div className="team-stat-icon team-stat-icon-blue">

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                            >

                                <circle
                                    cx="9"
                                    cy="8"
                                    r="3"
                                    stroke="white"
                                    strokeWidth="1.8"
                                />

                                <path
                                    d="M3.5 19C3.5 15.9 5.8 13.5 9 13.5C12.2 13.5 14.5 15.9 14.5 19"
                                    stroke="white"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />

                                <circle
                                    cx="17"
                                    cy="9"
                                    r="2.5"
                                    stroke="white"
                                    strokeWidth="1.8"
                                />

                                <path
                                    d="M16 14C18.6 14.2 20.5 16.1 20.5 18.5"
                                    stroke="white"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />

                            </svg>

                        </div>


                        <div>

                            <span>
                                Total Members
                            </span>

                            <strong>
                                {totalMembers}
                            </strong>

                        </div>

                    </div>


                    {/* TOTAL TASKS */}

                    <div className="team-stat-card">

                        <div className="team-stat-icon team-stat-icon-purple">

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


                        <div>

                            <span>
                                Total Tasks
                            </span>

                            <strong>
                                {totalTasks}
                            </strong>

                        </div>

                    </div>


                    {/* COMPLETED TASKS */}

                    <div className="team-stat-card">

                        <div className="team-stat-icon team-stat-icon-green">

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


                        <div>

                            <span>
                                Completed Tasks
                            </span>

                            <strong>
                                {completedTasks}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    ADD / EDIT MEMBER MODAL
                ================================================= */}

                {showAddMember && (

                    <div
                        className="team-modal-overlay"
                        onClick={(event) => {

                            if (
                                event.target ===
                                event.currentTarget
                            ) {

                                setShowAddMember(false);

                                setEditingMember(null);

                            }

                        }}
                    >

                        <div className="team-modal">


                            {/* MODAL HEADER */}

                            <div className="team-modal-header">

                                <div>

                                    <span>
                                        TEAM
                                    </span>

                                    <h2>
                                        {
                                            editingMember
                                                ? "Edit Member"
                                                : "Add Member"
                                        }
                                    </h2>

                                </div>


                                <button
                                    type="button"
                                    className="team-modal-close"
                                    onClick={() => {

                                        setShowAddMember(
                                            false
                                        );

                                        setEditingMember(
                                            null
                                        );

                                    }}
                                >
                                    ×
                                </button>

                            </div>


                            {/* FORM */}

                            <form
                                onSubmit={
                                    handleSaveMember
                                }
                            >


                                {/* =================================================
                                    PROFILE PHOTO
                                ================================================= */}

                                <div className="team-form-group">

                                    <label>
                                        Profile Photo
                                    </label>


                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "16px",
                                            marginTop: "8px",
                                        }}
                                    >

                                        {/* PREVIEW */}

                                        <div
                                            style={{
                                                width: "70px",
                                                height: "70px",
                                                borderRadius: "50%",
                                                overflow: "hidden",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                background:
                                                    "#e5e7eb",
                                                border:
                                                    "3px solid #ffffff",
                                                boxShadow:
                                                    "0 2px 8px rgba(0,0,0,0.12)",
                                                flexShrink: 0,
                                                fontSize: "22px",
                                                fontWeight: "700",
                                                color:
                                                    "#3e4656",
                                            }}
                                        >

                                            {newMember.image ? (

                                                <img
                                                    src={
                                                        newMember.image
                                                    }
                                                    alt="Profile preview"
                                                    style={{
                                                        width:
                                                            "100%",
                                                        height:
                                                            "100%",
                                                        objectFit:
                                                            "cover",
                                                    }}
                                                />

                                            ) : (

                                                getInitials(
                                                    newMember.name ||
                                                    "Member"
                                                )

                                            )}

                                        </div>


                                        {/* PHOTO BUTTONS */}

                                        <div>

                                            <label
                                                htmlFor="team-profile-photo"
                                                style={{
                                                    display:
                                                        "inline-flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    padding:
                                                        "9px 15px",
                                                    borderRadius:
                                                        "8px",
                                                    background:
                                                        "#2563eb",
                                                    color:
                                                        "#ffffff",
                                                    fontSize:
                                                        "14px",
                                                    fontWeight:
                                                        "600",
                                                    cursor:
                                                        "pointer",
                                                }}
                                            >
                                                {newMember.image
                                                    ? "Change Photo"
                                                    : "Choose Photo"}
                                            </label>


                                            <input
                                                id="team-profile-photo"
                                                type="file"
                                                accept="image/*"
                                                onChange={
                                                    handleProfilePhotoChange
                                                }
                                                style={{
                                                    display:
                                                        "none",
                                                }}
                                            />


                                            {newMember.image && (

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleRemoveProfilePhoto
                                                    }
                                                    style={{
                                                        marginLeft:
                                                            "8px",
                                                        padding:
                                                            "9px 12px",
                                                        borderRadius:
                                                            "8px",
                                                        border:
                                                            "1px solid #d1d5db",
                                                        background:
                                                            "#ffffff",
                                                        color:
                                                            "#374151",
                                                        fontSize:
                                                            "14px",
                                                        cursor:
                                                            "pointer",
                                                    }}
                                                >
                                                    Remove
                                                </button>

                                            )}


                                            <p
                                                style={{
                                                    margin:
                                                        "8px 0 0",
                                                    fontSize:
                                                        "12px",
                                                    color:
                                                        "#6b7280",
                                                }}
                                            >
                                                JPG, PNG or WEBP.
                                                Maximum 5MB.
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* =================================================
                                    NAME
                                ================================================= */}

                                <div className="team-form-group">

                                    <label>
                                        Member Name
                                    </label>


                                    <input
                                        type="text"
                                        placeholder="Enter member name"
                                        value={
                                            newMember.name
                                        }
                                        onChange={(event) =>
                                            setNewMember({
                                                ...newMember,
                                                name:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        }
                                    />

                                </div>


                                {/* =================================================
                                    EMAIL
                                ================================================= */}

                                <div className="team-form-group">

                                    <label>
                                        Email
                                    </label>


                                    <input
                                        type="email"
                                        placeholder="Enter email address"
                                        value={
                                            newMember.email
                                        }
                                        onChange={(event) =>
                                            setNewMember({
                                                ...newMember,
                                                email:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        }
                                    />

                                </div>


                                {/* =================================================
                                    ROLE
                                ================================================= */}

                                <div className="team-form-group">

                                    <label>
                                        Role
                                    </label>


                                    <select
                                        value={
                                            newMember.role
                                        }
                                        onChange={(event) =>
                                            setNewMember({
                                                ...newMember,
                                                role:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        }
                                    >

                                        <option>
                                            Developer
                                        </option>

                                        <option>
                                            UI/UX Designer
                                        </option>

                                        <option>
                                            QA Engineer
                                        </option>

                                        <option>
                                            Team Leader
                                        </option>

                                    </select>

                                </div>


                                {/* =================================================
                                    MODAL BUTTONS
                                ================================================= */}

                                <div className="team-modal-actions">

                                    <button
                                        type="button"
                                        className="team-cancel-button"
                                        onClick={() => {

                                            setShowAddMember(
                                                false
                                            );

                                            setEditingMember(
                                                null
                                            );

                                        }}
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        className="team-save-button"
                                    >
                                        {
                                            editingMember
                                                ? "Save Changes"
                                                : "Add Member"
                                        }
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

            </div>

        </>

    );

}


export default Team;
