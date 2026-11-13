
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { useEffect, useState } from "react";
import { findUserByID } from "../api/profileApi";
import LoadingSpinner from "../components/LoadingSpinner";
import userPic from '../assets/user.png';

function ProfilePage() {
    const navigate = useNavigate()

    const [profile, setProfile] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUser = async () => {
        const { error, data, message } = await findUserByID()

        if (!error) {
            setProfile(data.data)
        } else {
            setError(message)
        }

        setLoading(false)
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUser();
    }, []);

    return (
        <div className="bg-slate-200 w-full min-h-[calc(100vh-50px)] flex pt-10 items-start justify-center">
            {loading && <LoadingSpinner />}
            {error && <p>{error}</p>}
            {!loading && <div className="w-full flex flex-col items-center justify-center max-w-3xl mr-4 ml-4 mx-auto bg-white p-5 rounded-xl">
                <img src={userPic} alt="" srcset="" width={300} height={300} />
                <h1 className="mb-2 mt-5 text-center text-4xl font-bold text-gray-800">{profile.name}</h1>
                <p className="mb-4">{profile.email} | {profile.role}</p>
                <div className="flex w-full gap-4">
                    {profile.role === "Owner" && <button
                        className="w-full bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-lg text-white font-semibold"
                        onClick={() => {
                            navigate('/register')
                        }}>Buat Akun Baru</button>}
                    <LogoutButton />
                </div>

            </div>}
        </div>
    )
}
export default ProfilePage