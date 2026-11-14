
import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { formatRupiah } from "../utils/formatRupiah";


export default function CategoryPieChart({ data, colors, label }) {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data.map((item, index) => ({
                        ...item,
                        total_amount: Number(item.total_amount),
                        fill: colors[index % colors.length]
                    }))}
                    dataKey="total_amount"
                    nameKey="category_name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={3}
                    label={renderLabel}
                    labelLine={{
                        stroke: "#000000",
                        strokeWidth: 1.5
                    }}
                // isAnimationActive={false}
                />

                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-current text-sm font-medium"
                >
                    {label}
                </text>

                <Tooltip
                    formatter={(value) => formatRupiah(value)}
                />
            </PieChart>

        </ResponsiveContainer>
    );
}
const renderLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    name,
    percent
}) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;

    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="currentColor"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
            fontSize={12}
        >
            {name} ({(percent * 100).toFixed(1)}%)
        </text>
    );
};

export function PieChartLabel({ data, colors }) {
    return (
        <div className="w-1/2 mx-auto">
            {data.map((item, index) => (
                <div key={index} className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{
                                backgroundColor: colors[index % colors.length]
                            }}
                        />
                        <span>{item.category_name}</span>
                    </div>

                    <span className="font-medium">
                        {formatRupiah(Number(item.total_amount))}
                    </span>
                </div>
            ))
            }</div>
    )
}