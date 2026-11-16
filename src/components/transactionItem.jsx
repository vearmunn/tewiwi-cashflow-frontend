import '../index.css'
import incomeIcon from "../assets/income.png";
import expenseIcon from "../assets/expense.png";
import { formatRupiah } from '../utils/formatRupiah';

function TransactionItem({ description, category, type, amount, onClickUpdate, onClickDelete }) {
    return (
        <>
            <div className='hidden md:block'>
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] mt-5 pl-2 ">
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
            </div>


            <div className='block md:hidden'>
                <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 h-10 w-10 shrink-0 rounded-full ${type == 'income' ? 'bg-green-400' : 'bg-red-400'}`}>
                            <img src={type == 'income' ? incomeIcon : expenseIcon} alt="" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-800">
                                {description}
                            </p>
                            <p className="text-sm text-gray-500">
                                {category}
                            </p>
                        </div>

                        <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${type == 'income'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}>
                            {type}
                        </span>
                    </div>

                    <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Amount</p>
                        <p className="text-lg font-bold text-gray-800">
                            {formatRupiah(amount)}
                        </p>
                    </div>

                    <div className="flex justify-end gap-4 border-t border-gray-100 pt-3">
                        <button
                            className="text-sm text-blue-500 font-medium hover:text-blue-600"
                            onClick={onClickUpdate}
                        >
                            Update
                        </button>

                        <button
                            className="text-sm text-red-500 font-medium hover:text-red-600"
                            onClick={onClickDelete}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </>

    )
}
export default TransactionItem