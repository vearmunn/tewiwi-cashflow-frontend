
import { useState } from "react";
import formatDateForInput from "../utils/formatDate";

export default function TransactionForm({
    isOpen,
    onClose,
    onAdd,
    onUpdate,
    categories,
    selectedTransaction
}) {
    const [description, setDescription] = useState(selectedTransaction?.description || "")
    const [selectedCategoryId, setSelectedCategoryId] = useState(selectedTransaction?.category_id || categories[0].id)
    const [amount, setAmount] = useState(selectedTransaction?.amount || "")
    const [date, setDate] = useState(formatDateForInput(selectedTransaction?.date) || "")

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (selectedTransaction) {
                await onUpdate({ id: selectedTransaction.id, description: description, categoryId: selectedCategoryId, amount: amount, date: new Date(`${date}T00:00:00+07:00`).toISOString() })
            }
            else {
                await onAdd({ description: description, categoryId: selectedCategoryId, amount: amount, date: new Date(`${date}T00:00:00+07:00`).toISOString(), });
            }

            setDescription("")
            setSelectedCategoryId(categories[0])
            setAmount(0)
            setDate("")

        } catch (err) {
            console.log(err.message || "Failed to add transactions.")
        } finally {
            setLoading(false);
            onClose();
        }
    };


    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !loading) {
                    onClose();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="category-modal-title"
                className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
            >
                <div className="mb-6 flex items-center justify-between">
                    <h2
                        id="category-modal-title"
                        className="text-xl font-bold text-gray-800"
                    >
                        Add Transaction
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close modal"
                        className="text-2xl text-gray-400 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>

                {error && (
                    <p role="alert" className="mb-4 text-sm text-red-600">
                        {error}
                    </p>
                )}

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

                                {categories.map((category) => (<option value={category.id} key={category.id}>{category.name}</option>))}
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
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : selectedTransaction ? "Update Transaction" : "Save Transaction"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
