import { useNavigate } from "react-router-dom";

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
    };

    return (
        <button onClick={handleLogout} className="font-semibold text-red-500 hover:text-red-700">
            Logout
        </button>
    );
}

export default LogoutButton;