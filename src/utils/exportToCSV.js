import { formatDateShort } from "./formatDate";

export const exportTransactionsToCSV = (transactions, categories) => {
    const headers = [
        "Tanggal",
        "Deskripsi",
        "Kategori",
        "Tipe",
        "Jumlah",
    ];

    const rows = transactions.map((transaction) => [
        formatDateShort(transaction.date),
        transaction.description,
        categories.find((item) => item.id === transaction.category_id).name,
        transaction.category_type,
        transaction.amount,
    ]);

    const csvContent = [
        headers,
        ...rows,
    ]
        .map((row) =>
            row.map((value) => {
                // Escape double quotes and wrap values in quotes
                const escaped = String(value ?? "").replace(/"/g, '""');
                return `"${escaped}"`;
            }).join(",")
        )
        .join("\n");

    // Add BOM for Excel compatibility
    const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "tewiwi-transactions.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};