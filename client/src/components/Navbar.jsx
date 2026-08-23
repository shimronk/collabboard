import {
    Link,
    NavLink,
} from "react-router-dom";


function Navbar() {

    return (

        <nav className="navbar">

            {/* LOGO */}

            <Link
                to="/"
                className="navbar-logo"
            >

                <span className="logo-icon">
                    ?
                </span>

                CollabBoard

            </Link>


            {/* NAVIGATION */}

            <div className="navbar-links">


                {/* HOME */}

                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    Home
                </NavLink>


                {/* DASHBOARD */}

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    Dashboard
                </NavLink>


                {/* MY TASKS */}

                <NavLink
                    to="/board"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    My Tasks
                </NavLink>


                {/* TEAM */}

                <NavLink
                    to="/team"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    Team
                </NavLink>


                {/* PROFILE */}

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    Profile
                </NavLink>


            </div>

        </nav>

    );

}


export default Navbar;
