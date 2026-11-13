import { useNavigate } from "react-router-dom";
import supabase from "../api/supabase";
import { toast } from "sonner";
import { useState } from "react";

function LogoutButton() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [showLogoutDialog, sethowLogoutDialog] = useState(false)

    const handleLogout = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        setLoading(false);

        if (error) {
            toast.error(error.message)
            return;
        }

        navigate('/login', { replace: true });
    };

    return (
        <>

            <button onClick={() => { sethowLogoutDialog(true) }} className="w-full font-semibold text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-700">
                Logout
            </button>
            {showLogoutDialog && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-lg">

                    <h2 className="text-lg font-semibold text-gray-900">
                        Confirm Logout
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                        Are you sure you want to log out?
                    </p>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => sethowLogoutDialog(false)}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                            {loading ? 'Logging out...' : 'Logout'}
                        </button>
                    </div>

                </div>
            </div>}
        </>

    );
}

export default LogoutButton;