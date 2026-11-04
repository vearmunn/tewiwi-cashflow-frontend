import '../index.css'
import incomeIcon from "../assets/income.png";
import expenseIcon from "../assets/expense.png";
import { formatDateForOutput } from '../utils/formatDate';
import { formatRupiah } from '../utils/formatRupiah';

function TransactionItem({ description, date, category, type, amount, onClickUpdate, onClickDelete }) {
    return (
        <div className="grid grid-cols-5 mt-6">
            <div className=" flex items-center">
                <div className={`mr-3 p-2 h-10 w-10 shrink-0 rounded-full ${type == 'income' ? 'bg-green-400' : 'bg-red-400'}`}>
                    <img src={type == 'income' ? incomeIcon : expenseIcon} alt="" />
                </div>
                <div>
                    <p className="text-md font-semibold">{description}</p>
                    <p className="text-sm text-gray-400">{formatDateForOutput(date)}</p>
                </div>
            </div>

            <p className="text-end">{category}</p>
            <p className="text-end">{type}</p>
            <p className="text-end">{formatRupiah(amount)}</p>
            <div className="text-end">
                <button className="text-blue-500 mr-6 cursor-pointer hover:text-blue-600" onClick={onClickUpdate}>Update</button>
                <button className="text-red-500 cursor-pointer hover:text-red-600" onClick={onClickDelete}>Delete</button>
            </div>
        </div>
    )
}
export default TransactionItem