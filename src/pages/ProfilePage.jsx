
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

function ProfilePage() {
    const navigate = useNavigate()
    return (
        <div className="bg-slate-200 w-full min-h-[calc(100vh-50px)] flex pt-10 items-start justify-center">
            <div className="w-full max-w-3xl mr-4 ml-4 mx-auto bg-white p-5 rounded-xl">
                <button onClick={() => {
                    navigate('/register')
                }}>Buat Akun Baru</button>
                <LogoutButton />
            </div>
        </div>
    )
}
export default ProfilePage