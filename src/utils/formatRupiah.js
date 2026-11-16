export const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(amount);
};
export const formatRupiahField = (value) => {
    if (!value) return '';

    return new Intl.NumberFormat('id-ID').format(value);
};