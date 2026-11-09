import { useEffect, useState } from "react";
import { deleteCashObligation, getCashObligations } from "../api/cash_obligation";
import LoadingSpinner from "./LoadingSpinner";
import { formatRupiah } from "../utils/formatRupiah";
import { formatDateForOutput } from "../utils/formatDate";
import ConfirmDeleteDialog from "./ConfirmDeletionDialog";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../api/categoryApi";
import { toast } from "sonner";

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
            setCashObligations(data)

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
        <div className='max-w-7xl mx-auto  mt-7 rounded-lg'>
            <div className="flex justify-between">
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
            {!loadingCashObligations && cashObligations.map((item) => {
                return (
                    <div
                        key={item.id}
                        className="flex flex-col gap-3 mt-4 rounded-xl border border-gray-200 bg-white p-4 sm:grid sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-center sm:gap-3">
                        <div className="min-w-0">
                            <h3 className="truncate font-semibold text-gray-800">
                                {item.description}
                            </h3>
                        </div>

                        <p className="text-sm md:text-base text-gray-600">
                            Deadline: {formatDateForOutput(item.date)}
                        </p>
                        <p className="font-bold text-gray-900 md:font-normal md:text-black">
                            {formatRupiah(item.amount)}
                        </p>
                        <div>
                            <button
                                className="cursor-pointer w-full rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto"
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
                            <button className="text-blue-500 ml-4 mr-4 cursor-pointer hover:text-blue-600" onClick={() => {
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