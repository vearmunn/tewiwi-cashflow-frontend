import { useEffect, useRef, useState } from "react";
import ConfirmDeleteDialog from "../components/ConfirmDeletionDialog";
import CustomContainer from "../components/CustomContainer"
import TransactionItem from "../components/transactionItem"
import { getCategories } from "../api/categoryApi";
import { NavLink, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import CustomDatePicker from "../components/CustomDatePicker";
import LoadingSpinner from "../components/LoadingSpinner";
import { deleteTransaction, getTransactions } from "../api/transactionApi";
import { exportTransactionsToPDF } from "../utils/exportToPDF";
import { exportTransactionsToCSV } from "../utils/exportToCSV";
import { formatDateForOutput } from "../utils/formatDate";
import pdfIcon from "../assets/pdf.svg";
import csvIcon from "../assets/csv.svg";
import receiptIcon from "../assets/receipt.png";

function TransactionsPage({ isInDashboard = false, limit = null }) {
    const navigate = useNavigate()
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [categories, setCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [grouppedTransactions, setGrouppedTransactions] = useState([])
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingTransactions, setLoadingTransactions] = useState(true);
    const [error, setError] = useState("");
    const timeoutRef = useRef(null);
    const [filter, setFilter] = useState({
        search: "",
        categoryId: "",
        type: "",
        startDate: "",
        endDate: ""
    });


    const fetchCategories = async () => {
        setLoadingCategories(true)
        const { error, data, message } = await getCategories()

        if (!error) {
            setCategories(data)

        } else {
            setError(message)
        }

        setLoadingCategories(false)
    }



    const fetchTransactions = async ({ keywords = "", categoryId = "", type = "", startDate = "", endDate = "" } = {}) => {
        setLoadingTransactions(true)
        const { error, data, message } = await getTransactions({ limit, search: keywords, categoryId, type, startDate, endDate })

        if (!error) {
            setTransactions(data)
            setGrouppedTransactions(data.reduce((groups, transaction) => {
                const date = transaction.date.split('T')[0];

                if (!groups[date]) {
                    groups[date] = [];
                }

                groups[date].push(transaction);

                return groups;
            }, {}))

        } else {
            setError(message)
        }

        setLoadingTransactions(false)
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTransactions();
        fetchCategories();
    }, []);


    const handleDeleteClick = (transaction) => {
        setSelectedTransaction(transaction);
        setIsDeleteOpen(true);
        setError("");
    };

    const handleDeleteTransaction = async () => {
        if (!selectedTransaction) return;
        setLoadingTransactions(true)
        const { error, message } = await deleteTransaction(selectedTransaction.id);
        if (error) {
            setError(message)
            return
        }
        setIsDeleteOpen(false);
        setSelectedTransaction(null);
        await fetchTransactions();
        setLoadingTransactions(false)
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setFilter((prev) => ({
            ...prev,
            search: value
        }))

        clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            fetchTransactions({ keywords: value, categoryId: filter.categoryId, type: filter.type, startDate: filter.startDate, endDate: filter.endDate });
        }, 500);
    };

    return (
        <div className="bg-gray-50 pt-8 min-h-screen">
            <CustomContainer>
                <div className="flex justify-between items-center">
                    <div className="flex">
                        <div className='bg-secondary/40 rounded-xl p-2 mr-3 h-fit'>
                            <img src={receiptIcon} className='w-5 h-5' alt="" srcset="" />
                        </div>
                        <h1 className='text-lg md:text-2xl font-bold'>{isInDashboard ? 'Transaksi Terbaru' : 'Transaksi'}</h1>
                    </div>
                    {isInDashboard && <NavLink to="/transactions" className='font-semibold text-blue-500 hover:text-blue-700 text-end text-sm md:text-base'>
                        Lihat Semua
                    </NavLink>}
                    {!isInDashboard && <div className="flex">
                        <button
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-semibold"
                            onClick={() => {
                                navigate('/add-transaction', {
                                    state: {
                                        isUpdating: false,
                                        categories: categories
                                    }
                                })
                            }}
                        >
                            + Tambah
                        </button>
                        <div className="flex justify-end">
                            <div className="flex rounded-lg bg-red-500 ml-3 px-4 py-2 hover:bg-red-700 justify-center items-center">
                                <img src={pdfIcon} className="w-5 h-5 mr-1" alt="" srcset="" />
                                <button
                                    className=" text-white font-semibold"
                                    onClick={() => {
                                        exportTransactionsToPDF(transactions, categories)
                                    }}
                                >
                                    Export PDF
                                </button>
                            </div>
                            <div className="flex rounded-lg bg-green-500 ml-3 px-4 py-2 hover:bg-green-700 justify-center items-center">
                                <img src={csvIcon} className="w-5 h-5 mr-1" alt="" srcset="" />
                                <button
                                    className=" text-white "
                                    onClick={() => {
                                        exportTransactionsToCSV(transactions, categories)
                                    }}
                                >
                                    Export CSV
                                </button>
                            </div>

                        </div>

                    </div>}
                </div>
                {!isInDashboard && <div>
                    {/* <h1 className='text-2xl font-bold'>Filter</h1> */}
                    <br />
                    <SearchBar
                        search={filter.search}
                        placeholder="Cari transaksi..."
                        handleChange={handleSearchChange}
                    />
                    <div className="flex mt-4 gap-5">
                        <div className="flex flex-col w-full">
                            <label className="text-sm text-gray-500">
                                Filter Tipe
                            </label>
                            <select
                                name="type"
                                value={filter.type}
                                onChange={(e) => {
                                    setFilter((prev) => ({
                                        ...prev,
                                        type: e.target.value
                                    }))
                                    fetchTransactions({ keywords: filter.search, categoryId: filter.categoryId, type: e.target.value, startDate: filter.startDate, endDate: filter.endDate })
                                }}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"

                            >
                                <option value="" disabled className="text-gray-500">Filter type</option>
                                <option value="income" className="">Income</option>
                                <option value="expense" >Expense</option>
                                <option value="" className="text-gray-500">Reset</option>
                            </select>
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="text-sm text-gray-500">
                                Filter Kategori
                            </label>
                            <select
                                name="category"
                                value={filter.categoryId}
                                onChange={(e) => {
                                    setFilter((prev) => ({
                                        ...prev,
                                        categoryId: e.target.value
                                    }))
                                    fetchTransactions({ keywords: filter.search, categoryId: e.target.value, type: filter.type, startDate: filter.startDate, endDate: filter.endDate })
                                }}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"

                            >
                                <option value="" disabled >Pilih kategori</option>
                                {categories.map((category) => (<option value={category.id} key={category.id}>{category.name}</option>))}
                                <option value="" className="text-gray-500">Reset</option>
                            </select>
                        </div>

                        <CustomDatePicker
                            className="w-full"
                            label="Filter Tanggal Awal"
                            value={filter.startDate}
                            onChange={(e) => {
                                setFilter((prev) => ({
                                    ...prev,
                                    startDate: e.target.value
                                }))

                                if (filter.startDate && filter.endDate) {
                                    fetchTransactions({ keywords: filter.search, categoryId: filter.categoryId, type: filter.type, startDate: e.target.value, endDate: filter.endDate })
                                }
                            }}
                        />

                        <CustomDatePicker
                            className="w-full"
                            label="Filter Tanggal Akhir"
                            value={filter.endDate}
                            onChange={(e) => {
                                setFilter((prev) => ({
                                    ...prev,
                                    endDate: e.target.value
                                }))
                                if (filter.startDate && filter.endDate) {
                                    fetchTransactions({ keywords: filter.search, categoryId: filter.categoryId, type: filter.type, startDate: filter.startDate, endDate: e.target.value })
                                }
                            }}
                        />

                    </div>
                    <br />
                </div>}
                {error && <p>{error}</p>}
                <div className='flex items-center justify-between'>
                    {loadingTransactions && <LoadingSpinner />}

                </div>

                {!loadingTransactions && !loadingCategories && Object.entries(grouppedTransactions).map(([date, items]) => (
                    <div key={date} className="mb-5 mt-5">
                        <div className="flex justify-between items-centers bg-gray-100 py-2 px-3 rounded-lg">
                            <h3 className="font-semibold text-sm text-gray-600 ">
                                {formatDateForOutput(date)}
                            </h3>
                            <p className="text-xs text-gray-500">{items.length} transaksi</p>
                        </div>
                        {items.map((transaction) => (
                            <TransactionItem
                                key={transaction.id}
                                description={transaction.description}
                                category={categories.find((item) => item.id === transaction.category_id).name}
                                type={transaction.category_type}
                                amount={transaction.amount}
                                onClickDelete={() => handleDeleteClick(transaction)}
                                onClickUpdate={() => {
                                    navigate('/add-transaction', {
                                        state: {
                                            isUpdating: true,
                                            id: transaction.id,
                                            date: transaction.date,
                                            description: transaction.description,
                                            category_id: categories.find((item) => item.id === transaction.category_id).id,
                                            type: transaction.category_type,
                                            amount: transaction.amount,
                                            categories: categories
                                        }
                                    })
                                }}
                            />
                        ))}
                    </div>
                ))
                }
                <ConfirmDeleteDialog
                    isOpen={isDeleteOpen}
                    onClose={() => {
                        setIsDeleteOpen(false);
                        setSelectedTransaction(null);
                    }}
                    onConfirm={handleDeleteTransaction}
                    itemName={selectedTransaction?.description || "transaction"}
                    loading={loadingTransactions}
                />
            </CustomContainer>
        </div>
    )
}
export default TransactionsPage