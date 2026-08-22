import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const isLoggedIn =
        sessionStorage.getItem("collabboardLoggedIn") === "true";

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;