import '../index.css'
import incomeIcon from "../assets/income.png";
import expenseIcon from "../assets/expense.png";
import { formatRupiah } from '../utils/formatRupiah';

function TransactionItem({ description, category, type, amount, onClickUpdate, onClickDelete }) {
    return (
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] mt-5 pl-2">
            <div className=" flex items-center bg-red-100s">
                <div className={`mr-3 p-2 h-10 w-10 shrink-0 rounded-full ${type == 'income' ? 'bg-green-400' : 'bg-red-400'}`}>
                    <img src={type == 'income' ? incomeIcon : expenseIcon} alt="" />
                </div>
                <p className="text-md font-semibold">{description}</p>
            </div>

            <div className="text-start bg-blue-100s w-full flex items-center justify-end">
                <p className='bg-blue-400s w-3/4'>{category}</p>
            </div>
            <p className="text-end bg-green-100s flex items-center justify-end">{type}</p>
            <p className="text-end bg-amber-100s flex items-center justify-end">{formatRupiah(amount)}</p>
            <div className="text-end bg-gray-200s flex items-center justify-end">
                <button className="text-blue-500 mr-6 cursor-pointer hover:text-blue-600" onClick={onClickUpdate}>Update</button>
                <button className="text-red-500 cursor-pointer hover:text-red-600" onClick={onClickDelete}>Delete</button>
            </div>
        </div>
    )
}
export default TransactionItem