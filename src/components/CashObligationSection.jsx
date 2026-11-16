import { useEffect, useState } from "react";
import { deleteCashObligation, getCashObligations } from "../api/cash_obligation";
import LoadingSpinner from "./LoadingSpinner";
import { formatRupiah } from "../utils/formatRupiah";
import { formatDateForOutput } from "../utils/formatDate";
import ConfirmDeleteDialog from "./ConfirmDeletionDialog";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../api/categoryApi";
import { toast } from "sonner";
import receiptIcon from "../assets/receipt.svg";

function CashObligationSection() {
    const navigate = useNavigate();
    const [cashObligations, setCashObligations] = useState([]);
    const [loadingCashObligations, setLoadingCashObligations] = useState(true);
    const [errorCashObligations, setErrorCashObligations] = useState("");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCashObligation, setSelectedCashObligation] = useState()
    const [categories, setCategories] = useState([])

    const fetchCategories = async () => {
        setLoadingCashObligations(true)
        const { error, data, message } = await getCategories()

        if (!error) {
            setCategories(data)

        } else {
            toast.error(message)
        }

        setLoadingCashObligations(false)
    }

    const fetchCashObligations = async ({ upcoming = false } = {}) => {
        setLoadingCashObligations(true)
        const { error, data, message } = await getCashObligations({ upcoming })

        if (!error) {
            setCashObligations(data.reduce((groups, item) => {
                const date = item.date.split('T')[0];

                if (!groups[date]) {
                    groups[date] = [];
                }

                groups[date].push(item);

                return groups;
            }, {}))

        } else {
            setErrorCashObligations(message)
            toast.error(message)
        }

        setLoadingCashObligations(false)
    }

    const handleDeleteCashObligation = async (cashObligationId) => {
        setLoadingCashObligations(true)
        const { error, message } = await deleteCashObligation(cashObligationId);
        if (error) {
            setErrorCashObligations(message)
            return
        }
        setIsDeleteOpen(false);
        setSelectedCashObligation(null)
        await fetchCashObligations();
        setLoadingCashObligations(false)
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchCashObligations()
        fetchCategories()
    }, [])

    return (
        <div className='max-w-7xl mx-auto  mt-7 rounded-lg bg-white p-3'>
            <div className="flex justify-between mb-5">
                <h1 className='text-2xl font-bold'>Upcoming Cash Obligations</h1>
                <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => { navigate("/add-cash-obligation"); }}
                >
                    + Add Cash Obligation
                </button>
            </div>

            {errorCashObligations && <p>{errorCashObligations}</p>}
            {loadingCashObligations && <LoadingSpinner />}
            {!loadingCashObligations && Object.entries(cashObligations).map(([date, items]) => (
                <div key={date} >
                    <div className="flex justify-between items-centers bg-orange-100 py-2 px-3 rounded-lg">
                        <h3 className="font-semibold text-sm text-orange-600 ">
                            Deadline: {formatDateForOutput(date)}
                        </h3>
                        {/* <p className="text-xs text-gray-500">{items.length} transaksi</p> */}
                    </div>
                    {items.map((item) => {
                        return <CashObligationItem
                            item={item}
                            onUpdate={() => {
                                navigate("/add-cash-obligation", {
                                    state: {
                                        id: item.id,
                                        description: item.description,
                                        amount: item.amount,
                                        date: item.date,
                                        reminderDays: item.reminder_days_before,
                                        isRecurring: item.is_recurring
                                    }
                                });
                            }}
                            onDelete={() => {
                                setIsDeleteOpen(true)
                                setSelectedCashObligation(item)
                            }}
                            onFinish={() => {
                                navigate("/add-transaction", {
                                    state: {
                                        isUpdating: false,
                                        idObligation: item.id,
                                        description: item.description,
                                        amount: item.amount,
                                        categories: categories,
                                        isRecurring: item.is_recurring,
                                        isObligation: true
                                    }
                                });
                            }} />
                    })}
                </div>

            ))}
            <ConfirmDeleteDialog
                isOpen={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedCashObligation(null)
                }}
                onConfirm={() => handleDeleteCashObligation(selectedCashObligation.id)}
                itemName={selectedCashObligation?.description || ''}
                loading={loadingCashObligations}
            />
        </div>
    )
}
export default CashObligationSection

function CashObligationItem({ item, onFinish, onUpdate, onDelete }) {
    return (

        <>
            <div className="hidden md:block">
                <div
                    key={item.id}
                    className="grid grid-cols-[1fr_1fr_auto] items-center gap-3 py-4 pl-2">
                    <div className="min-w-0">
                        <h3 className="font-semibold text-gray-800">
                            {item.description}
                        </h3>
                    </div>
                    <p className="font-medium text-gray-900">
                        {formatRupiah(item.amount)}
                    </p>
                    <div className="flex items-center">
                        <button
                            className="flex items-center justify-center rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 cursor-pointer"
                            onClick={onFinish}
                        >
                            <img src={receiptIcon} className="mr-2 h-5 w-5" alt="" />
                            Catat Pembayaran
                        </button>

                        <button
                            className="ml-4 mr-4 cursor-pointer text-blue-500 hover:text-blue-600"
                            onClick={onUpdate}
                        >
                            Update
                        </button>

                        <button
                            className="cursor-pointer text-red-500 hover:text-red-600"
                            onClick={onDelete}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            <div className="block md:hidden">
                <div
                    key={item.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm mt-4"
                >
                    <div className="mb-3">
                        <h3 className="font-semibold text-gray-800">
                            {item.description}
                        </h3>
                    </div>
                    <div className="mb-4">
                        <p className="mb-1 text-xs text-gray-500">Amount</p>
                        <p className="text-lg font-bold text-gray-900">
                            {formatRupiah(item.amount)}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-3">
                        <button
                            className="flex flex-1 items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 cursor-pointer"
                            onClick={onFinish}
                        >
                            <img src={receiptIcon} className="mr-2 h-5 w-5" alt="" />
                            Catat Pembayaran
                        </button>

                        <button
                            className="cursor-pointer text-sm font-medium text-blue-500 hover:text-blue-600"
                            onClick={onUpdate}
                        >
                            Update
                        </button>

                        <button
                            className="cursor-pointer text-sm font-medium text-red-500 hover:text-red-600"
                            onClick={onDelete}
                        >
                            Delete
                        </button>
                    </div>
                </div>

            </div>
        </>

    )
}