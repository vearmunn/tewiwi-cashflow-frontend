function CustomDatePicker({ value, onChange, label, className }) {
    return (
        <div className={`flex flex-col ${className}`}>
            <label className="text-sm text-gray-500">
                {label}
            </label>
            <input
                type="date"
                value={value}
                placeholder="Pilih Tanggal"
                onChange={onChange}

                className="rounded-lg border border-gray-300 px-3 py-2"
            />
        </div>
    )
}
export default CustomDatePicker