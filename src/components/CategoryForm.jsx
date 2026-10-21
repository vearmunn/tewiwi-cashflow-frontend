
import { useState } from "react";

export default function CategoryForm({
    isOpen,
    onClose,
    onAdd,
    onUpdate,
    selectedCategory
}) {
    const [categoryName, setCategoryName] = useState(selectedCategory?.name || "")
    const [type, setType] = useState(selectedCategory?.type || "expense")

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (selectedCategory) {
                await onUpdate({ id: selectedCategory.id, name: categoryName, type: type })
            }
            else {
                await onAdd({ name: categoryName, type });
            }

            setCategoryName("")
            setType("")

        } catch (err) {
            alert(err.message || "Failed to add category.")
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
                        Add Category
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

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Type
                            </label>
                            <select
                                name="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Insert category name..."
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
                            {loading ? "Saving..." : selectedCategory ? "Update Category" : "Save Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
