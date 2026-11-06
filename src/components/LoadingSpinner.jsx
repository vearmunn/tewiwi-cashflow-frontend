import { BeatLoader } from "react-spinners"

function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center">
            <BeatLoader
                color="#2563eb"
                // loading={loading}
                size={10}
                speedMultiplier={1}
            />
        </div>
    )
}
export default LoadingSpinner