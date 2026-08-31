import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import hideIcon from "../assets/icons/hide.png";
import visibleIcon from "../assets/icons/visible.png";

import {
    getCurrentUser,
    updateCurrentUser,
    changePassword,
    deleteCurrentUser,
} from "../api/userApi";

const roleOptions = [
    "Team Member",
    "Team Lead",
    "Developer",
    "Tester",
    "UI/UX Designer",
];


/* =========================================================
   PROFILE PAGE
========================================================= */

function ProfilePage() {

    const navigate = useNavigate();

    const roleDropdownRef = useRef(null);

    /* =========================================================
       PROFILE STATE
    ========================================================= */

    const [profile, setProfile] = useState(null);

    const [draftName, setDraftName] =
        useState("");

    const [draftEmail, setDraftEmail] =
        useState("");

    const [draftRole, setDraftRole] =
        useState("");

    const [isLoading, setIsLoading] =
        useState(true);

    const [isEditing, setIsEditing] =
        useState(false);

    const [isRoleOpen, setIsRoleOpen] =
        useState(false);


    /* =========================================================
       PASSWORD STATE
    ========================================================= */

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
       LOAD CURRENT USER FROM BACKEND
    ========================================================= */

    useEffect(() => {

        const loadProfile = async () => {

            try {

                setIsLoading(true);

                const currentUser =
                    await getCurrentUser();

                setProfile(currentUser);

                setDraftName(
                    currentUser.name || ""
                );

                setDraftEmail(
                    currentUser.email || ""
                );

                setDraftRole(
                    currentUser.role || "Team Member"
                );

                /* Keep session data synchronized */

                sessionStorage.setItem(
                    "collabboardEmail",
                    currentUser.email
                );

                sessionStorage.setItem(
                    "collabboardUserId",
                    String(currentUser.id)
                );

                sessionStorage.setItem(
                    "collabboardRole",
                    currentUser.role
                );

            } catch (error) {

                console.error(
                    "Failed to load profile:",
                    error
                );

                alert(
                    error.message ||
                    "Failed to load your profile."
                );

            } finally {

                setIsLoading(false);

            }

        };

        loadProfile();

    }, []);


    /* =========================================================
       CLOSE ROLE DROPDOWN
    ========================================================= */

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                roleDropdownRef.current &&
                !roleDropdownRef.current.contains(
                    event.target
                )
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
       CHANGE PROFILE PHOTO
    ========================================================= */

    const handleImageChange = (event) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {

            alert(
                "Please select an image file."
            );

            return;
        }

        if (file.size > 5 * 1024 * 1024) {

            alert(
                "Profile photo must be smaller than 5MB."
            );

            return;
        }

        const reader =
            new FileReader();

        reader.onload = async () => {

            try {

                const result =
                    await updateCurrentUser({
                        image: reader.result,
                    });

                setProfile(
                    result.user
                );

                setDraftName(
                    result.user.name || ""
                );

                setDraftEmail(
                    result.user.email || ""
                );

                setDraftRole(
                    result.user.role || "Team Member"
                );

                alert(
                    "Profile photo updated successfully."
                );

            } catch (error) {

                console.error(
                    "Failed to update profile photo:",
                    error
                );

                alert(
                    error.message ||
                    "Failed to update profile photo."
                );

            }

        };

        reader.readAsDataURL(file);

    };


    /* =========================================================
       EDIT PROFILE
    ========================================================= */

    const handleEditProfile = () => {

        if (!profile) {
            return;
        }

        setDraftName(
            profile.name || ""
        );

        setDraftEmail(
            profile.email || ""
        );

        setDraftRole(
            profile.role || "Team Member"
        );

        setIsEditing(true);

    };


    /* =========================================================
       SAVE PROFILE CHANGES
    ========================================================= */

    const handleSaveProfile = async () => {

        if (!profile) {
            return;
        }

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

        try {

            const result =
                await updateCurrentUser({
                    name:
                        draftName.trim(),

                    email:
                        draftEmail
                            .trim()
                            .toLowerCase(),
                });

            const updatedProfile =
                result.user;

            setProfile(
                updatedProfile
            );

            setDraftName(
                updatedProfile.name || ""
            );

            setDraftEmail(
                updatedProfile.email || ""
            );

            setDraftRole(
                updatedProfile.role || "Team Member"
            );

            /* Update session information */

            sessionStorage.setItem(
                "collabboardEmail",
                updatedProfile.email
            );

            sessionStorage.setItem(
                "collabboardUserId",
                String(updatedProfile.id)
            );

            sessionStorage.setItem(
                "collabboardRole",
                updatedProfile.role
            );

            setIsRoleOpen(false);

            setIsEditing(false);

            alert(
                "Profile updated successfully."
            );

        } catch (error) {

            console.error(
                "Failed to update profile:",
                error
            );

            alert(
                error.message ||
                "Failed to update your profile."
            );

        }

    };


    /* =========================================================
       CANCEL PROFILE EDIT
    ========================================================= */

    const handleCancelEdit = () => {

        if (!profile) {
            return;
        }

        setDraftName(
            profile.name || ""
        );

        setDraftEmail(
            profile.email || ""
        );

        setDraftRole(
            profile.role || "Team Member"
        );

        setIsRoleOpen(false);

        setIsEditing(false);

    };


    /* =========================================================
       SELECT ROLE
       
       ROLE CHANGE IS DISABLED FOR NORMAL PROFILE EDITING.
       Team Leader can change member roles from Team page.
    ========================================================= */

    const handleRoleSelect = (
        role
    ) => {

        /*
           Intentionally left here so the existing UI structure
           is not broken.

           A user must not be able to change their own role.
        */

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
       
       Backend password API is not connected yet.
    ========================================================= */

    const handleChangePassword = async (
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

    try {

        await changePassword(
            currentPassword,
            newPassword
        );

        alert(
            "Password changed successfully."
        );

        setCurrentPassword("");

        setNewPassword("");

        setConfirmPassword("");

        resetPasswordVisibility();

        setShowPasswordForm(false);

    } catch (error) {

        console.error(
            "Failed to change password:",
            error
        );

        alert(
            error.message ||
            "Failed to change password."
        );
    }
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

        sessionStorage.removeItem(
            "collabboardToken"
        );

        sessionStorage.removeItem(
            "collabboardUserId"
        );

        sessionStorage.removeItem(
            "collabboardRole"
        );

        navigate("/");

    };


    /* =========================================================
       DELETE ACCOUNT
       
       Backend delete-account API is not connected yet.
    ========================================================= */

    const handleDeleteAccount = async () => {

    const confirmed =
        window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        );

    if (!confirmed) {
        return;
    }

    try {

        await deleteCurrentUser();

        sessionStorage.removeItem(
            "collabboardLoggedIn"
        );

        sessionStorage.removeItem(
            "collabboardEmail"
        );

        sessionStorage.removeItem(
            "collabboardToken"
        );

        sessionStorage.removeItem(
            "collabboardUserId"
        );

        sessionStorage.removeItem(
            "collabboardRole"
        );

        alert(
            "Account deleted successfully."
        );

        navigate("/");

    } catch (error) {

        console.error(
            "Failed to delete account:",
            error
        );

        alert(
            error.message ||
            "Failed to delete account."
        );
    }
};


    /* =========================================================
       LOADING STATE
    ========================================================= */

    if (isLoading) {

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
                                Loading your profile...
                            </p>

                        </div>

                    </div>

                </main>

            </div>

        );

    }


    /* =========================================================
       ERROR / NO PROFILE
    ========================================================= */

    if (!profile) {

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
                                Unable to load your profile.
                            </p>

                            <button
                                type="button"
                                className="profile-primary-button"
                                onClick={() =>
                                    window.location.reload()
                                }
                            >
                                Try Again
                            </button>

                        </div>

                    </div>

                </main>

            </div>

        );

    }


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
                                    onChange={
                                        handleImageChange
                                    }
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
                                        Update your name and email.
                                    </p>

                                </div>


                                {!isEditing && (

                                    <button
                                        type="button"
                                        className="profile-secondary-button"
                                        onClick={
                                            handleEditProfile
                                        }
                                    >
                                        Edit Profile
                                    </button>

                                )}

                            </div>


                            <div className="profile-form">


                                {/* NAME */}

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


                                {/* EMAIL */}

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


                                {/* ROLE */}

                                <div
                                    className="profile-form-group profile-role-group"
                                    ref={roleDropdownRef}
                                >

                                    <label>
                                        Role
                                    </label>

                                    {/* Role is displayed only.
                                        Users cannot change their own role. */}

                                    <input
                                        type="text"
                                        value={
                                            profile.role
                                        }
                                        disabled
                                    />

                                </div>


                                {/* EDIT ACTIONS */}

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
                                    onClick={
                                        handleLogout
                                    }
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
