function SummaryItem({ icon, title, value, iconColor }) {
    return (
        <div className={`p-4 rounded-lg shadow-md bg-white`}>
            <div className='flex justify-between items-center'>
                <p>{title}</p>
                <div className={`${iconColor} p-1 h-8 w-8 rounded-lg`}>
                    <img src={icon} className={`brightness-0 invert`} />
                </div>

            </div>
            <p className='text-2xl font-semibold'>{value}</p>
        </div>
    )
}
export default SummaryItem