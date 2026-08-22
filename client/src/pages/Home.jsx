import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import rightArrowIcon from "../assets/icons/right-arrow.png";
import {
    ClipboardCheck,
    BarChart3,
    UsersRound
} from "lucide-react";

function Home() {
    return (
        <div className="app">
            <Navbar />

            <main className="home-content">
                <section className="hero-section">
                    <p className="page-label">
                        WELCOME TO COLLABBOARD
                    </p>

                    <h1>
                        Work together.
                        <br />
                        <span>
                            Get things done.
                        </span>
                    </h1>

                    <p className="hero-description">
                        A collaborative task management workspace
                        designed to help your team organize work,
                        track progress, and achieve goals together.
                    </p>

                    <Link
                        to="/login"
                        className="hero-button"
                    >
                        <span>
                            Open Development Board
                        </span>

                        <img
                            src={rightArrowIcon}
                            alt=""
                            className="hero-button-arrow"
                        />
                    </Link>
                </section>

                <section className="home-features">
                   <div className="feature-card">
    <div className="feature-icon">
        <ClipboardCheck size={42} strokeWidth={1.8} />
    </div>

    <div className="feature-content">
        <span className="feature-number">01</span>

        <h3>Organize Tasks</h3>

        <p>
            Keep your team's work organized across clear task boards and lists.
        </p>
    </div>
</div>

<div className="feature-card">
    <div className="feature-icon">
        <BarChart3 size={42} strokeWidth={1.8} />
    </div>

    <div className="feature-content">
        <span className="feature-number">02</span>

        <h3>Track Progress</h3>

        <p>
            Move tasks between To Do, Doing, and Done. Track progress in real time.
        </p>
    </div>
</div>

<div className="feature-card">
    <div className="feature-icon">
        <UsersRound size={42} strokeWidth={1.8} />
    </div>

    <div className="feature-content">
        <span className="feature-number">03</span>

        <h3>Work Together</h3>

        <p>
            Assign work, collaborate with your team, and stay focused on what matters.
        </p>
    </div>
</div> 
                </section>
            </main>
        </div>
    );
}

export default Home;