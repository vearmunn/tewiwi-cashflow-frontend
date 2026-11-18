import { useEffect, useRef, useState } from 'react';
import '../index.css'
import expenseIcon from "../assets/expense.png";
import incomeIcon from "../assets/income.png";
import transactionIcon from "../assets/transaction.png";
import cashflowIcon from "../assets/trend.png";
import SummaryItem from '../components/SummaryItem';
import { formatRupiah } from '../utils/formatRupiah';
import TransactionsPage from './TransactionsPage';
import { getSummary } from '../api/transactionApi';

import CustomDatePicker from '../components/CustomDatePicker';
import { formatDateForInput, formatDateForOutput } from '../utils/formatDate';
import LoadingSpinner from '../components/LoadingSpinner';
import CashObligationSection from '../components/CashObligationSection';
import MyLineChart from '../components/LineChart';
import CategoryPieChart, { PieChartLabel } from '../components/PieChart';
import { EXPENSE_COLORS, INCOME_COLORS } from '../utils/colors';
import summaryIcon from '../assets/summaryIc.png'
import budgetIcon from '../assets/budget.png'
import categoryIcon from '../assets/category.png'

function Dashboard() {
    const [showDateRange, setShowDateRange] = useState(false);
    const dateRangeRef = useRef(null);

    const [summary, setSummary] = useState([]);
    const [rangeDateSummary, setRangeDateSummary] = useState({
        startDate: "",
        endDate: ""
    });
    const [summarySubtitle, setSummarySubtitle] = useState({
        startDate: "",
        endDate: ""
    });
    const [loadingSummary, setLoadingSummary] = useState(true);
    const [errorSummary, setErrorSummary] = useState("");

    const today = new Date();

    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const fetchSummary = async ({ startDate = formatDateForInput(firstDay), endDate = formatDateForInput(lastDay) } = {}) => {
        setLoadingSummary(true)
        const { error, data, message } = await getSummary({ startDate, endDate })

        if (!error) {
            setSummary(data)
            console.log(data)

        } else {
            setErrorSummary(message)
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
        const handleClickOutside = (event) => {
            if (
                dateRangeRef.current &&
                !dateRangeRef.current.contains(event.target)
            ) {
                setShowDateRange(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-gray-50 p-8 min-h-screen">
            {errorSummary && <p>{errorSummary}</p>}

            {loadingSummary ? <LoadingSpinner /> :
                <div className='max-w-7xl mx-auto items-center bg-white rounded-lg border border-gray-200'>
                    <div className='flex max-w-7xl mx-auto mb-5 justify-between p-3'>
                        <div className='flex flex-col'>
                            <div className='flex items-start mb-2'>
                                <div className='bg-secondary/40 rounded-xl p-2 mr-3'>
                                    <img src={summaryIcon} className='w-5 h-5' alt="" srcset="" />
                                </div>
                                <h1 className='text-lg md:text-2xl font-bold mb-4 lg:mb-2 text-center '>Ringkasan Keuangan</h1>
                            </div>
                            {summarySubtitle.startDate == "" && summarySubtitle.endDate == "" ? 'Periode: Bulan ini' : `Periode: ${formatDateForOutput(summarySubtitle.startDate)} - ${formatDateForOutput(summarySubtitle.endDate)}`}
                        </div>

                        <div className="relative" ref={dateRangeRef}>
                            <button
                                onClick={() => setShowDateRange((prev) => !prev)}
                                className="rounded-lg h-fit text-xs md:text-base bg-gray-100 px-4 py-2 text-gray-500 font-semibold hover:bg-gray-300 border border-gray-300 cursor-pointer"
                            >
                                Pilih Periode
                            </button>

                            {showDateRange && (
                                <div className="absolute right-0 top-full mt-2 z-50w-full md:w-100 bg-white p-4 rounded-lg shadow-lg border">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <CustomDatePicker
                                            className="pb-3 md:pb-0"
                                            label="Tanggal Awal"
                                            value={rangeDateSummary.startDate}
                                            onChange={(e) => {
                                                setRangeDateSummary((prev) => ({
                                                    ...prev,
                                                    startDate: e.target.value
                                                }));
                                            }}
                                        />

                                        <CustomDatePicker
                                            label="Tanggal Akhir"
                                            value={rangeDateSummary.endDate}
                                            onChange={(e) => {
                                                setRangeDateSummary((prev) => ({
                                                    ...prev,
                                                    endDate: e.target.value
                                                }));
                                            }}
                                        />
                                    </div>

                                    <button
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 mt-3 w-full cursor-pointer"
                                        onClick={() => {
                                            fetchSummary({
                                                startDate: rangeDateSummary.startDate,
                                                endDate: rangeDateSummary.endDate
                                            });

                                            setSummarySubtitle({
                                                startDate: rangeDateSummary.startDate,
                                                endDate: rangeDateSummary.endDate
                                            });

                                            setShowDateRange(false);
                                        }}
                                    >
                                        Apply
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='max-w-7xl mx-auto items-center grid grid-cols-2 lg:grid-cols-4 gap-4 bg-secondary/20 py-2'>
                        <SummaryItem title='Income' value={formatRupiah(summary.total_income)} icon={incomeIcon} iconColor='bg-green-500' />
                        <SummaryItem title='Expense' value={(formatRupiah(summary.total_expense))} icon={expenseIcon} iconColor='bg-red-400' />
                        <SummaryItem title='Net Cashflow' value={formatRupiah(summary.net_cashflow)} icon={budgetIcon} iconColor='bg-blue-400' />
                        <SummaryItem title='Transactions' value={summary.transaction_number} icon={transactionIcon} iconColor='bg-amber-400' />
                    </div>
                    <div className='bg-white p-3 mt-7 rounded-xl'>
                        <div className='flex'>
                            <div className='bg-secondary/40 rounded-xl p-2 mr-3 h-fit'>
                                <img src={cashflowIcon} className='w-5 h-5' alt="" srcset="" />
                            </div>
                            <h1 className='text-lg md:text-2xl  font-bold mb-4'>Tren Pemasukan dan Pengeluaran</h1>
                        </div>
                        <div className='h-96 mt-5 p-'>
                            <MyLineChart data={summary.data} />
                        </div>
                        <div className='flex mt-10 items-center'>
                            <div className='bg-secondary/40 rounded-xl p-2 mr-3 h-fit'>
                                <img src={categoryIcon} className='w-5 h-5' alt="" srcset="" />
                            </div>
                            <h1 className='text-lg md:text-2xl  font-bold'>Rincian Berdasarkan Kategori</h1>
                        </div>

                        <div className='flex flex-col md:flex-row mt-2'>

                            <div className='w-full'>
                                <div className='h-72 w-full'>
                                    <CategoryPieChart label="Pemasukan" data={summary.sum_income} colors={INCOME_COLORS} />
                                </div>
                                <div className="mt-4 space-y-3">
                                    <PieChartLabel data={summary.sum_income} colors={INCOME_COLORS} />
                                </div>
                            </div>
                            <div className='w-full'>
                                <div className='h-72 w-full'>
                                    <CategoryPieChart label="Pengeluaran" data={summary.sum_expense} colors={EXPENSE_COLORS} />
                                </div>
                                <div className="mt-4 space-y-3">
                                    <PieChartLabel data={summary.sum_expense} colors={EXPENSE_COLORS} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            }
            <CashObligationSection />
            <TransactionsPage isInDashboard={true} limit={10} />
        </div>

    )
}

export default Dashboard;