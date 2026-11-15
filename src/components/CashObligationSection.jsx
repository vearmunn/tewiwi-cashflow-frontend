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
                        return (
                            <div
                                key={item.id}
                                className="flex flex-col gap-2 py-4 pl-2 sm:grid sm:grid-cols-[1fr_1fr_auto] sm:items-center sm:gap-3">
                                <div className="min-w-0 bg-amber-100s">
                                    <h3 className="truncate font-semibold text-gray-800">
                                        {item.description}
                                    </h3>
                                </div>
                                <p className="font-bold text-gray-900 md:font-normal md:text-black bg-green-100s ml-8">
                                    {formatRupiah(item.amount)}
                                </p>
                                <div className="bg-red-100s flex">
                                    <div className="cursor-pointer w-full rounded-lg bg-green-600 px-5 py-2 hover:bg-green-700 sm:w-auto flex justify-center items-center">
                                        <img src={receiptIcon} className="w-5 h-5 mr-2" alt="" srcset="" />
                                        <button
                                            className=" text-sm font-medium text-white cursor-pointer"
                                            onClick={() => {
                                                navigate("/add-transaction", {
                                                    state: {
                                                        isUpdating: false,
                                                        idObligation: item.id,
                                                        description: item.description,
                                                        amount: item.amount,
                                                        categories: categories,
                                                        isObligation: true
                                                    }
                                                });
                                            }}
                                        >
                                            Catat Pembayaran
                                        </button>
                                    </div>
                                    <button className="text-blue-500 ml-4 mr-4 cursor-pointer hover:text-blue-600s" onClick={() => {
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
                                    }}>Update</button>
                                    <button className="text-red-500 cursor-pointer hover:text-red-600" onClick={() => {
                                        setIsDeleteOpen(true)
                                        setSelectedCashObligation(item)
                                    }}>Delete</button>
                                </div>
                            </div>
                        )
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