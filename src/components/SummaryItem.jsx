function SummaryItem({ icon, title, value, iconColor }) {
    return (
        <div className={`p-4 flex  lg:justify-center`}>
            <div className={`${iconColor} p-1 h-7 w-7 rounded-lg mr-2`}>
                <img src={icon} className={`brightness-0 invert`} />
            </div>
            <div>
                <div className='flex justify-between items-center'>
                    <p>{title}</p>
                </div>
                <p className='text-xl lg:text-2xl font-semibold'>{value}</p>
            </div>
        </div>
    )
}
export default SummaryItem