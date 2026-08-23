import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import hideIcon from "../assets/icons/hide.png";
import visibleIcon from "../assets/icons/visible.png";

const roleOptions = [
    "Team Member",
    "Team Lead",
    "Developer",
    "Tester",
    "UI/UX Designer",
];

/* =========================================================
   GET CURRENT LOGGED-IN EMAIL
========================================================= */

function getLoggedInEmail() {
    return (
        sessionStorage.getItem("collabboardEmail") ||
        "member1@collabboard.com"
    );
}


/* =========================================================
   PROFILE STORAGE KEY
========================================================= */

function getProfileStorageKey() {
    const email = getLoggedInEmail();

    return `collabboardProfile_${email.toLowerCase().trim()}`;
}


/* =========================================================
   INITIAL PROFILE
========================================================= */

function getInitialProfile() {
    const storageKey = getProfileStorageKey();

    const savedProfile = localStorage.getItem(storageKey);

    if (savedProfile) {
        try {
            return JSON.parse(savedProfile);
        } catch {
            // Continue with default profile
        }
    }

    const loggedInEmail = getLoggedInEmail();

    return {
        name:
            loggedInEmail === "shimron@example.com"
                ? "Shimron"
                : "Member 1",

        email: loggedInEmail,

        role:
            loggedInEmail === "shimron@example.com"
                ? "Team Lead"
                : "Team Member",

        image: null,
    };
}


/* =========================================================
   PROFILE PAGE
========================================================= */

function ProfilePage() {

    const navigate = useNavigate();

    const roleDropdownRef = useRef(null);

    const [profile, setProfile] = useState(
        getInitialProfile
    );

    const [draftName, setDraftName] = useState(
        profile.name
    );

    const [draftEmail, setDraftEmail] = useState(
        profile.email
    );

    const [draftRole, setDraftRole] = useState(
        profile.role
    );

    const [isEditing, setIsEditing] = useState(false);

    const [isRoleOpen, setIsRoleOpen] = useState(false);

    const [showPasswordForm, setShowPasswordForm] =
        useState(false);

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    /* =========================================================
       CLOSE ROLE DROPDOWN
    ========================================================= */

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                roleDropdownRef.current &&
                !roleDropdownRef.current.contains(event.target)
            ) {
                setIsRoleOpen(false);
            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    /* =========================================================
   SAVE PROFILE
========================================================= */

const saveProfileToStorage = (updatedProfile) => {
    const storageKey = getProfileStorageKey();

    localStorage.setItem(
        storageKey,
        JSON.stringify(updatedProfile)
    );

    localStorage.setItem(
        `collabboardProfile_${updatedProfile.email
            .toLowerCase()
            .trim()}`,
        JSON.stringify(updatedProfile)
    );

    window.dispatchEvent(
        new Event("collabboardProfileUpdated")
    );
};


    /* =========================================================
       CHANGE PROFILE PHOTO
    ========================================================= */

    const handleImageChange = (event) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        const reader =
            new FileReader();

        reader.onload = () => {

            const updatedProfile = {

                ...profile,

                image: reader.result,

            };

            setProfile(
                updatedProfile
            );

            saveProfileToStorage(
                updatedProfile
            );

  

        };

        reader.readAsDataURL(file);

    };


    /* =========================================================
       EDIT PROFILE
    ========================================================= */

    const handleEditProfile = () => {

        setDraftName(
            profile.name
        );

        setDraftEmail(
            profile.email
        );

        setDraftRole(
            profile.role
        );

        setIsEditing(true);

    };


    /* =========================================================
       SAVE PROFILE CHANGES
    ========================================================= */

    const handleSaveProfile = () => {

        if (!draftName.trim()) {

            alert(
                "Please enter your name."
            );

            return;
        }

        if (!draftEmail.trim()) {

            alert(
                "Please enter your email."
            );

            return;
        }

        const oldStorageKey =
            getProfileStorageKey();

        const updatedProfile = {

            ...profile,

            name:
                draftName.trim(),

            email:
                draftEmail.trim(),

            role:
                draftRole,

        };


        /*
           If the email was changed,
           remove the old profile key.
        */

        if (
            profile.email
                .toLowerCase()
                .trim() !==
            updatedProfile.email
                .toLowerCase()
                .trim()
        ) {

            localStorage.removeItem(
                oldStorageKey
            );

        }


        setProfile(
            updatedProfile
        );

        saveProfileToStorage(
            updatedProfile
        );


        setIsRoleOpen(false);

        setIsEditing(false);


        /*
           Notify TeamPage.
        */

        window.dispatchEvent(
            new Event("profileUpdated")
        );


        alert(
            "Profile updated successfully."
        );

    };


    /* =========================================================
       CANCEL PROFILE EDIT
    ========================================================= */

    const handleCancelEdit = () => {

        setDraftName(
            profile.name
        );

        setDraftEmail(
            profile.email
        );

        setDraftRole(
            profile.role
        );

        setIsRoleOpen(false);

        setIsEditing(false);

    };


    /* =========================================================
       SELECT ROLE
    ========================================================= */

    const handleRoleSelect = (
        role
    ) => {

        setDraftRole(role);

        setIsRoleOpen(false);

    };


    /* =========================================================
       PASSWORD VISIBILITY
    ========================================================= */

    const resetPasswordVisibility = () => {

        setShowCurrentPassword(false);

        setShowNewPassword(false);

        setShowConfirmPassword(false);

    };


    /* =========================================================
       CHANGE PASSWORD
    ========================================================= */

    const handleChangePassword = (
        event
    ) => {

        event.preventDefault();

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            alert(
                "Please complete all password fields."
            );

            return;
        }

        if (
            newPassword.length < 6
        ) {

            alert(
                "New password must contain at least 6 characters."
            );

            return;
        }

        if (
            newPassword !==
            confirmPassword
        ) {

            alert(
                "New passwords do not match."
            );

            return;
        }

        alert(
            "Password changed successfully."
        );

        setCurrentPassword("");

        setNewPassword("");

        setConfirmPassword("");

        resetPasswordVisibility();

        setShowPasswordForm(false);

    };


    /* =========================================================
       CANCEL PASSWORD
    ========================================================= */

    const handleCancelPassword = () => {

        setCurrentPassword("");

        setNewPassword("");

        setConfirmPassword("");

        resetPasswordVisibility();

        setShowPasswordForm(false);

    };


    /* =========================================================
       LOGOUT
    ========================================================= */

    const handleLogout = () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to logout?"
            );

        if (!confirmed) {
            return;
        }

        sessionStorage.removeItem(
            "collabboardLoggedIn"
        );

        sessionStorage.removeItem(
            "collabboardEmail"
        );

        navigate("/");

    };


    /* =========================================================
       DELETE ACCOUNT
    ========================================================= */

    const handleDeleteAccount = () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete your account? This action cannot be undone."
            );

        if (!confirmed) {
            return;
        }

        const storageKey =
            getProfileStorageKey();

        localStorage.removeItem(
            storageKey
        );

        sessionStorage.removeItem(
            "collabboardLoggedIn"
        );

        sessionStorage.removeItem(
            "collabboardEmail"
        );

        alert(
            "Account deleted successfully."
        );

        navigate("/");

    };


    /* =========================================================
       PAGE
    ========================================================= */

    return (

        <div className="app">

            <Navbar />

            <main className="profile-page">

                <div className="profile-page-header">

                    <div>

                        <p className="page-label">
                            ACCOUNT
                        </p>

                        <h1>
                            Profile
                        </h1>

                        <p className="page-subtitle">
                            Manage your personal information and account settings.
                        </p>

                    </div>

                </div>


                <div className="profile-layout">


                    {/* =================================================
                       PROFILE CARD
                    ================================================= */}

                    <section className="profile-card">

                        <div className="profile-picture-area">

                            {profile.image ? (

                                <img
                                    src={profile.image}
                                    alt="Profile"
                                    className="profile-picture"
                                />

                            ) : (

                                <div className="profile-picture-placeholder">

                                    {profile.name
                                        ? profile.name
                                            .charAt(0)
                                            .toUpperCase()
                                        : "U"}

                                </div>

                            )}


                            <label className="change-photo-button">

                                Change Photo

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    hidden
                                />

                            </label>

                        </div>


                        <div className="profile-card-info">

                            <h2>
                                {profile.name}
                            </h2>

                            <p className="profile-email">
                                {profile.email}
                            </p>

                            <span className="profile-role">
                                {profile.role}
                            </span>

                        </div>

                    </section>


                    <div className="profile-settings">


                        {/* =================================================
                           PERSONAL INFORMATION
                        ================================================= */}

                        <section className="profile-settings-card personal-information-card">

                            <div className="profile-section-header">

                                <div>

                                    <h2>
                                        Personal Information
                                    </h2>

                                    <p>
                                        Update your name, email and role.
                                    </p>

                                </div>


                                {!isEditing && (

                                    <button
                                        type="button"
                                        className="profile-secondary-button"
                                        onClick={handleEditProfile}
                                    >
                                        Edit Profile
                                    </button>

                                )}

                            </div>


                            <div className="profile-form">


                                <div className="profile-form-group">

                                    <label htmlFor="profile-name">
                                        Full Name
                                    </label>

                                    <input
                                        id="profile-name"
                                        type="text"
                                        value={
                                            isEditing
                                                ? draftName
                                                : profile.name
                                        }
                                        disabled={!isEditing}
                                        onChange={(event) =>
                                            setDraftName(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="profile-form-group">

                                    <label htmlFor="profile-email">
                                        Email Address
                                    </label>

                                    <input
                                        id="profile-email"
                                        type="email"
                                        value={
                                            isEditing
                                                ? draftEmail
                                                : profile.email
                                        }
                                        disabled={!isEditing}
                                        onChange={(event) =>
                                            setDraftEmail(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div
                                    className="profile-form-group profile-role-group"
                                    ref={roleDropdownRef}
                                >

                                    <label>
                                        Role
                                    </label>


                                    {isEditing ? (

                                        <div className="profile-role-selector">

                                            <button
                                                type="button"
                                                className={`profile-role-select-button ${
                                                    isRoleOpen
                                                        ? "profile-role-select-open"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setIsRoleOpen(
                                                        (current) =>
                                                            !current
                                                    )
                                                }
                                            >

                                                <span>
                                                    {draftRole}
                                                </span>

                                                <span
                                                    className={`profile-role-arrow ${
                                                        isRoleOpen
                                                            ? "profile-role-arrow-open"
                                                            : ""
                                                    }`}
                                                >
                                                    ▼
                                                </span>

                                            </button>


                                            {isRoleOpen && (

                                                <div className="profile-role-options">

                                                    {roleOptions.map(
                                                        (role) => (

                                                            <button
                                                                key={role}
                                                                type="button"
                                                                className={`profile-role-option ${
                                                                    draftRole ===
                                                                    role
                                                                        ? "profile-role-option-active"
                                                                        : ""
                                                                }`}
                                                                onClick={() =>
                                                                    handleRoleSelect(
                                                                        role
                                                                    )
                                                                }
                                                            >
                                                                {role}
                                                            </button>

                                                        )
                                                    )}

                                                </div>

                                            )}

                                        </div>

                                    ) : (

                                        <input
                                            type="text"
                                            value={
                                                profile.role
                                            }
                                            disabled
                                        />

                                    )}

                                </div>


                                {isEditing && (

                                    <div className="profile-actions">

                                        <button
                                            type="button"
                                            className="profile-cancel-button"
                                            onClick={
                                                handleCancelEdit
                                            }
                                        >
                                            Cancel
                                        </button>


                                        <button
                                            type="button"
                                            className="profile-primary-button"
                                            onClick={
                                                handleSaveProfile
                                            }
                                        >
                                            Save Changes
                                        </button>

                                    </div>

                                )}

                            </div>

                        </section>


                        {/* =================================================
                           PASSWORD
                        ================================================= */}

                        <section className="profile-settings-card">

                            <div className="profile-section-header">

                                <div>

                                    <h2>
                                        Password
                                    </h2>

                                    <p>
                                        Change your account password.
                                    </p>

                                </div>


                                {!showPasswordForm && (

                                    <button
                                        type="button"
                                        className="profile-secondary-button"
                                        onClick={() =>
                                            setShowPasswordForm(
                                                true
                                            )
                                        }
                                    >
                                        Change Password
                                    </button>

                                )}

                            </div>


                            {showPasswordForm && (

                                <form
                                    className="password-form"
                                    onSubmit={
                                        handleChangePassword
                                    }
                                >

                                    <div className="profile-form-group">

                                        <label htmlFor="current-password">
                                            Current Password
                                        </label>


                                        <div className="password-input-wrapper">

                                            <input
                                                id="current-password"
                                                type={
                                                    showCurrentPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Enter current password"
                                                value={
                                                    currentPassword
                                                }
                                                onChange={(event) =>
                                                    setCurrentPassword(
                                                        event.target.value
                                                    )
                                                }
                                            />


                                            <button
                                                type="button"
                                                className="password-toggle-button"
                                                onClick={() =>
                                                    setShowCurrentPassword(
                                                        (current) =>
                                                            !current
                                                    )
                                                }
                                                aria-label={
                                                    showCurrentPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >

                                                <img
                                                    src={
                                                        showCurrentPassword
                                                            ? hideIcon
                                                            : visibleIcon
                                                    }
                                                    alt=""
                                                    className="password-toggle-icon"
                                                />

                                            </button>

                                        </div>

                                    </div>


                                    <div className="profile-password-row">


                                        <div className="profile-form-group">

                                            <label htmlFor="new-password">
                                                New Password
                                            </label>


                                            <div className="password-input-wrapper">

                                                <input
                                                    id="new-password"
                                                    type={
                                                        showNewPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="Minimum 6 characters"
                                                    value={
                                                        newPassword
                                                    }
                                                    onChange={(event) =>
                                                        setNewPassword(
                                                            event.target.value
                                                        )
                                                    }
                                                />


                                                <button
                                                    type="button"
                                                    className="password-toggle-button"
                                                    onClick={() =>
                                                        setShowNewPassword(
                                                            (current) =>
                                                                !current
                                                        )
                                                    }
                                                    aria-label={
                                                        showNewPassword
                                                            ? "Hide password"
                                                            : "Show password"
                                                    }
                                                >

                                                    <img
                                                        src={
                                                            showNewPassword
                                                                ? hideIcon
                                                                : visibleIcon
                                                        }
                                                        alt=""
                                                        className="password-toggle-icon"
                                                    />

                                                </button>

                                            </div>

                                        </div>


                                        <div className="profile-form-group">

                                            <label htmlFor="confirm-new-password">
                                                Confirm Password
                                            </label>


                                            <div className="password-input-wrapper">

                                                <input
                                                    id="confirm-new-password"
                                                    type={
                                                        showConfirmPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="Enter password again"
                                                    value={
                                                        confirmPassword
                                                    }
                                                    onChange={(event) =>
                                                        setConfirmPassword(
                                                            event.target.value
                                                        )
                                                    }
                                                />


                                                <button
                                                    type="button"
                                                    className="password-toggle-button"
                                                    onClick={() =>
                                                        setShowConfirmPassword(
                                                            (current) =>
                                                                !current
                                                        )
                                                    }
                                                    aria-label={
                                                        showConfirmPassword
                                                            ? "Hide password"
                                                            : "Show password"
                                                    }
                                                >

                                                    <img
                                                        src={
                                                            showConfirmPassword
                                                                ? hideIcon
                                                                : visibleIcon
                                                        }
                                                        alt=""
                                                        className="password-toggle-icon"
                                                    />

                                                </button>

                                            </div>

                                        </div>

                                    </div>


                                    <div className="profile-actions">

                                        <button
                                            type="button"
                                            className="profile-cancel-button"
                                            onClick={
                                                handleCancelPassword
                                            }
                                        >
                                            Cancel
                                        </button>


                                        <button
                                            type="submit"
                                            className="profile-primary-button"
                                        >
                                            Update Password
                                        </button>

                                    </div>

                                </form>

                            )}

                        </section>


                        {/* =================================================
                           ACCOUNT
                        ================================================= */}

                        <section className="profile-settings-card danger-zone">

                            <div className="account-section-header">

                                <h2>
                                    Account
                                </h2>

                                <p>
                                    Manage your current session and account.
                                </p>

                            </div>


                            <div className="account-buttons">

                                <button
                                    type="button"
                                    className="logout-button"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>


                                <button
                                    type="button"
                                    className="delete-account-button"
                                    onClick={
                                        handleDeleteAccount
                                    }
                                >
                                    Delete Account
                                </button>

                            </div>

                        </section>

                    </div>

                </div>

            </main>

        </div>

    );

}

export default ProfilePage;
