import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { formatDateShort } from "../utils/formatDate";
import { formatRupiah } from "../utils/formatRupiah";

function MyLineChart({ data }) {

    return (

        < ResponsiveContainer >
            <LineChart width={500} height={800} data={data} margin={{
                top: 5,
                right: 50,
                left: 0,
                bottom: 12
            }}>
                <CartesianGrid strokeDasharray="5 5" />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: 14 }}
                    tickFormatter={(value) => formatDateShort(value)}
                    angle={-45}
                    textAnchor="end"
                    height={60} />
                <YAxis domain={[0, 'auto']}
                    width={70}
                    tickCount={6}
                    tickFormatter={(value) => `Rp${value / 1000}k`} />
                <Tooltip formatter={(value) => formatRupiah(value)} labelFormatter={(value) => formatDateShort(value)} />

                <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#16a34a"
                    name="Income"
                />

                <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#dc2626"
                    name="Expense"
                />
                <Legend wrapperStyle={{
                    position: 'relative',
                    marginTop: '10px',
                }} />

            </LineChart>
        </ResponsiveContainer >
    )
}
export default MyLineChart