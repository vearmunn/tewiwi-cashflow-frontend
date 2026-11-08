import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDateForInput } from "../utils/formatDate";
import { createTransaction, updateTransaction } from "../api/transactionApi";
import { toast } from "sonner";

function AddTransactionPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const initialData = location.state;

    const [description, setDescription] = useState(initialData?.description || "")
    const [selectedCategoryId, setSelectedCategoryId] = useState(initialData?.category_id || initialData.categories[0].id)
    const [amount, setAmount] = useState(initialData?.amount || "")
    const [date, setDate] = useState(formatDateForInput(initialData?.date) || "")

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (initialData.isUpdating) {
            const { error, message } = await updateTransaction(initialData.id, { description: description, categoryId: selectedCategoryId, amount: amount, date: new Date(`${date}T00:00:00+07:00`).toISOString() })
            if (error) {
                toast.error(message);
                setLoading(false)
            }
            toast.success("Transaksi berhasil diperbarui!");
            navigate(-1)
        }
        else {
            const { error, message } = await createTransaction({ description: description, categoryId: selectedCategoryId, amount: amount, date: new Date(`${date}T00:00:00+07:00`).toISOString() });
            if (error) {
                toast.error(message);
                setLoading(false)

            }
            toast.success("Transaksi berhasil dibuat!");
        }
        setLoading(false)
        setDescription("")
        setSelectedCategoryId(initialData.categories[0])
        setAmount(0)
        setDate("")
    }
    return (
        <div className="bg-slate-200 w-full min-h-[calc(100vh-50px)] flex items-center justify-center">
            <div className="w-full max-w-3xl mr-4 ml-4 mx-auto bg-white p-5 rounded-xl">
                <h1 className="text-2xl font-bold mb-4">Add New Transaction</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <select
                                name="category"
                                value={selectedCategoryId}
                                onChange={(e) => setSelectedCategoryId(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                            >

                                {initialData.categories.map((category) => (<option value={category.id} key={category.id}>{category.name}</option>))}
                            </select>
                        </div>

                        <div>
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
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Amount
                            </label>
                            <input
                                id="amount"
                                type="text"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount..."
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Date
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
                    </div>

                    <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : initialData.isUpdating ? "Update Transaction" : "Save Transaction"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default AddTransactionPage