import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatRupiah } from "./formatRupiah";
import { formatDateForOutput, formatDateShort } from "./formatDate";

export const exportTransactionsToPDF = (transactions, categories) => {
    const doc = new jsPDF();

    // Document title
    doc.setFontSize(18);
    doc.text("Tewiwi Cashflow - Transaction Report", 14, 20);

    // Tanggal Periode
    const firstDate = new Date(
        Math.min(...transactions.map((item) => new Date(item.date)))
    );

    const lastDate = new Date(
        Math.max(...transactions.map((item) => new Date(item.date)))
    );
    doc.setFontSize(10);
    doc.text(
        `Periode: ${formatDateForOutput(firstDate)} - ${formatDateForOutput(lastDate)}`,
        14,
        28
    );

    // Prepare table data
    const tableData = transactions.map((transaction) => [
        formatDateShort(transaction.date),
        transaction.description,
        categories.find((item) => item.id === transaction.category_id).name,
        transaction.category_type,
        formatRupiah(transaction.amount),
    ]);

    // Generate table
    autoTable(doc, {
        startY: 35,
        head: [[
            "Tanggal",
            "Deskripsi",
            "Kategori",
            "Tipe",
            "Jumlah",
        ]],
        body: tableData,
        theme: "grid",
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
        },
        columnStyles: {
            4: { halign: "right" },
        },
    });

    // Save PDF
    doc.save("tewiwi-transactions.pdf");
};