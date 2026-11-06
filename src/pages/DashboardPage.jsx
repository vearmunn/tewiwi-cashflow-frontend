import { useEffect, useState } from 'react';
import '../index.css'
import expenseIcon from "../assets/expense.png";
import incomeIcon from "../assets/income.png";
import transactionIcon from "../assets/transaction.png";
import cashflowIcon from "../assets/cashflow.png";
import SummaryItem from '../components/SummaryItem';
import { formatRupiah } from '../utils/formatRupiah';
import TransactionsPage from './TransactionsPage';
import { getSummary } from '../api/transactionApi';
import Charts from '../components/Charts';
import CustomDatePicker from '../components/CustomDatePicker';
import { formatDateForOutput } from '../utils/formatDate';
import LoadingSpinner from '../components/LoadingSpinner';

function Dashboard() {
    // const [isOpen, setIsOpen] = useState(false);
    // const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    // const [selectedTransaction, setSelectedTransaction] = useState(null);
    // const [categories, setCategories] = useState([]);
    const [summary, setSummary] = useState([]);
    const [rangeDateSummary, setRangeDateSummary] = useState({
        startDate: "",
        endDate: ""
    });
    const [summarySubtitle, setSummarySubtitle] = useState({
        startDate: "",
        endDate: ""
    });
    // const [summary, setSummary] = useState(null)
    // const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingSummary, setLoadingSummary] = useState(true);
    const [error, setError] = useState("");

    // const fetchCategories = async () => {
    //     setLoadingCategories(true)
    //     const { error, data, message } = await getCategories()

    //     if (!error) {
    //         setCategories(data)

    //     } else {
    //         setError(message)
    //     }

    //     setLoadingCategories(false)
    // }

    const fetchSummary = async ({ startDate = "", endDate = "" } = {}) => {
        setLoadingSummary(true)
        const { error, data, message } = await getSummary({ startDate, endDate })

        if (!error) {
            setSummary(data)
            console.log(data)
            // setSummary({
            //     'income': calculateTransaction(data, 'income'),
            //     'expense': calculateTransaction(data, 'expense')
            // })
        } else {
            setError(message)
        }

        setLoadingSummary(false)
    }

    useEffect(() => {
        // const now = new Date();

        // const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        // const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchSummary()
        // fetchSummary({ startDate: thisMonthStart.toISOString(), endDate: thisMonthEnd.toISOString() });
        // fetchCategories();
    }, []);

    // const handleAddClick = () => {
    //     setSelectedTransaction(null);
    //     setIsOpen(true);
    //     setError("");
    // };

    // const handleAddTransaction = async (transaction) => {
    //     setLoadingTransactions(true)
    //     const { error, message } = await createTransaction(transaction);
    //     if (error) {
    //         setError(message)
    //         setLoadingTransactions(false)
    //     }
    //     // setIsOpen(false)
    //     await fetchTransactions();
    //     setLoadingTransactions(false)
    // };

    // const handleUpdateClick = (transaction) => {
    //     setSelectedTransaction(transaction);
    //     setIsOpen(true);
    //     setError("");
    // };

    // const handleUpdateTransaction = async (transaction) => {
    //     setLoadingTransactions(true)
    //     const { error, message } = await updateTransaction(transaction.id, { description: transaction.description, amount: transaction.amount, categoryId: transaction.categoryId, date: transaction.date });
    //     if (error) {
    //         setError(message)
    //         setLoadingTransactions(false)
    //     }
    //     setIsOpen(false)
    //     await fetchTransactions();
    //     setLoadingTransactions(false)
    // };

    // const handleDeleteClick = (transaction) => {
    //     setSelectedTransaction(transaction);
    //     setIsDeleteOpen(true);
    //     setError("");
    // };

    // const handleDeleteTransaction = async () => {
    //     if (!selectedTransaction) return;
    //     setLoadingTransactions(true)
    //     const { error, message } = await deleteTransaction(selectedTransaction.id);
    //     if (error) {
    //         setError(message)
    //         return
    //     }
    //     setIsDeleteOpen(false);
    //     setSelectedTransaction(null);
    //     await fetchTransactions();
    //     setLoadingTransactions(false)
    // };

    return (
        <div className="bg-slate-200 p-8 min-h-screen">
            {error && <p>{error}</p>}

            <div className='flex flex-col md:flex-row max-w-7xl mx-auto mb-5 justify-between'>
                <div className='flex items-end'>
                    <h1 className='text-2xl font-bold mb-2'>Summary</h1>
                    {summarySubtitle.startDate == "" || summarySubtitle.endDate == ""
                        ? <h1 className='text-2xl font-bold ml-2 mb-2'>Keseluruhan</h1>
                        : <h1 className='text-2xl font-bold ml-2 mb-2'>{formatDateForOutput(summarySubtitle.startDate)} - {formatDateForOutput(summarySubtitle.endDate)}</h1>}
                </div>

                <div className='bg-white p-3 rounded-lg'>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <CustomDatePicker
                            className="pb-3 md:pb-0"
                            label="Tanggal Awal"
                            value={rangeDateSummary.startDate}
                            onChange={(e) => {
                                setRangeDateSummary((prev) => ({
                                    ...prev,
                                    startDate: e.target.value
                                }))
                            }} />

                        <CustomDatePicker
                            label="Tanggal Akhir"
                            value={rangeDateSummary.endDate}
                            onChange={(e) => {
                                setRangeDateSummary((prev) => ({
                                    ...prev,
                                    endDate: e.target.value
                                }))
                            }} />
                    </div>
                    <button
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 mt-3 w-full cursor-pointer"
                        onClick={() => {
                            fetchSummary({ startDate: rangeDateSummary.startDate, endDate: rangeDateSummary.endDate });
                            setSummarySubtitle({ startDate: rangeDateSummary.startDate, endDate: rangeDateSummary.endDate })
                        }}
                    >
                        Apply
                    </button>

                </div>
            </div>
            {loadingSummary ? <LoadingSpinner /> :

                <div className='max-w-7xl mx-auto items-center'>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                        <SummaryItem title='Income' value={formatRupiah(summary.total_income)} icon={incomeIcon} iconColor='bg-green-500' />
                        <SummaryItem title='Expense' value={(formatRupiah(summary.total_expense))} icon={expenseIcon} iconColor='bg-red-400' />
                        <SummaryItem title='Net Cashflow' value={formatRupiah(summary.net_cashflow)} icon={cashflowIcon} iconColor='bg-blue-400' />
                        <SummaryItem title='Transactions' value={summary.transaction_number} icon={transactionIcon} iconColor='bg-amber-400' />

                    </div>

                    <div className='bg-white p-3 mt-5 rounded-xl'>
                        <h1 className='text-2xl font-bold mb-4'>Income and Expense Trends</h1>
                        <div className='h-96 mt-5 p-'>
                            <Charts data={summary.data} />
                        </div>
                    </div>
                </div>

            }


            <TransactionsPage isInDashboard={true} limit={10} />
        </div>

    )
}

export default Dashboard;