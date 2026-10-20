
export default function ConfirmDeleteDialog({
    isOpen,
    onClose,
    onConfirm,
    itemName = "this item",
    loading = false,
}) {
    if (!isOpen) return null;

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
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m0 3h.008M10.29 3.86 1.82 18.5A2 2 0 0 0 3.55 21.5h16.9a2 2 0 0 0 1.73-3L13.73 3.86a2 2 0 0 0-3.44 0Z"
                        />
                    </svg>
                </div>

                <h2
                    id="delete-dialog-title"
                    className="text-lg font-semibold text-gray-900"
                >
                    Delete {itemName}?
                </h2>

                <p
                    id="delete-dialog-description"
                    className="mt-2 text-sm leading-6 text-gray-500"
                >
                    Are you sure you want to delete this {itemName}?
                    This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
