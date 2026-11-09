import { useState } from "react"
import { createCashObligation, updateCashObligation } from "../api/cash_obligation"
import { toast } from "sonner"
import { useLocation, useNavigate } from "react-router-dom";
import { formatDateForInput } from "../utils/formatDate";

function AddCashObligationPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const initialData = location.state;

    const [description, setDescription] = useState(initialData?.description ?? "")
    const [amount, setAmount] = useState(initialData?.amount ?? "")
    const [date, setDate] = useState(formatDateForInput(initialData?.date) ?? "")
    const [reminderDays, setReminderDays] = useState(initialData?.reminderDays ?? "")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [frequency, setFrequency] = useState(initialData?.isRecurring == true ? "monthly" : "once");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        console.log(frequency)

        if (initialData) {
            const { error, message } = await updateCashObligation(initialData.id, {
                description,
                amount,
                reminder_days: reminderDays,
                date,
                is_recurring: frequency == 'once' ? false : true,
                recurring_day: frequency == 'once' ? null : Number(date.split("-")[2])
            });
            if (error) {
                setError(message)
                toast.error(message);
                setLoading(false)
            }
            toast.success("Cash obligation berhasil diperbarui!");
        } else {
            const { error, message } = await createCashObligation({
                description, amount,
                reminder_days: reminderDays,
                date,
                is_recurring: frequency == 'once' ? false : true,
                recurring_day: frequency == 'once' ? null : Number(date.split("-")[2])
            });
            if (error) {
                setError(message)
                toast.error(message);
                setLoading(false)
            }
            toast.success("Cash obligation berhasil ditambahkan!");
        }
        setLoading(false)
        navigate('/')

    }
    return (
        <div className="bg-slate-200 w-full min-h-[calc(100vh-50px)] flex items-center justify-center">
            <div className="w-full max-w-3xl mr-4 ml-4 mx-auto bg-white p-5 rounded-xl">
                <h1 className="text-2xl font-bold mb-4">Add Upcoming Cash Obligation</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="">
                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <input
                                id="description"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter description..."
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Amount
                            </label>
                            <input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount..."
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                        <div className="mb-4 flex gap-4">
                            <div className="w-full">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Deadline
                                </label>
                                <input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    placeholder="Select date..."
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                            <div className="mb-0 w-full">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Pengingat Sebelum Jatuh Tempo
                                </label>
                                <div className="relative">
                                    <input
                                        id="amount"
                                        type="number"
                                        value={reminderDays}
                                        onChange={(e) => setReminderDays(e.target.value)}
                                        placeholder="contoh: 5 hari"
                                        required
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200  [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none 
    [&::-webkit-outer-spin-button]:appearance-none"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-md text-gray-500">
                                        hari
                                    </span>
                                </div>
                            </div>

                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Jenis Kewajiban
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <ObligationTypeOption
                                    value='once'
                                    title="Sekali Bayar"
                                    subtitle="Dibayar satu kali saja."
                                    checked={frequency === "once"}
                                    onChange={(e) => setFrequency(e.target.value)} />

                                <ObligationTypeOption
                                    value='monthly'
                                    title="Berulang"
                                    subtitle="Pembayaran berulang setiap bulan."
                                    checked={frequency === "monthly"}
                                    onChange={(e) => setFrequency(e.target.value)} />
                            </div>
                            {date && reminderDays && frequency == 'once' && <p className="mt-4 text-sm text-blue-500">Note: Kewajiban ini dibayarkan satu kali, dengan pengingat yang akan muncul di dashboard mulai 7 November 2026.</p>}
                        </div>
                    </div>
                    {error && (
                        <p role="alert" className="mb-4 text-sm text-red-600">
                            {error}
                        </p>
                    )}
                    <div className="flex justify-end  pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Loading..." : initialData ? "Update Cash Obligation" : "Add Cash Obligation"}

                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default AddCashObligationPage

function ObligationTypeOption({ value, checked, onChange, title, subtitle }) {
    return (
        <label className="cursor-pointer">
            <input
                type="radio"
                name="frequency"
                value={value}
                checked={checked}
                onChange={onChange}
                className="peer sr-only"
            />

            <div className="p-4 border border-gray-200 rounded-xl transition-all
                                        peer-checked:border-blue-500
                                        peer-checked:bg-blue-50
                                        hover:border-gray-400">

                <h3 className="font-semibold text-gray-800">
                    {title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                    {subtitle}
                </p>
            </div>
        </label>

    )
}