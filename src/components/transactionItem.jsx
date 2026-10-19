import '../index.css'

function TransactionItem({ description, date, category, type, amount }) {
    return (
        <div className="grid grid-cols-4 mt-6">
            <div className=" flex items-center">
                <div className="mr-3 h-12 w-12 shrink-0 rounded-full bg-red-400"></div>
                <div>
                    <p className="text-md font-semibold">{description}</p>
                    <p className="text-sm text-gray-400">{date}</p>
                </div>
            </div>

            <p className="text-end">{category}</p>
            <p className="text-end">{type}</p>
            <p className="text-end">{amount}</p>
        </div>
    )
}
export default TransactionItem