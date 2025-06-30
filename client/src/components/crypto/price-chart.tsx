import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { mockChartData } from "@/lib/mock-data";

interface PriceChartProps {
  data?: Array<{ time: string; price: number }>;
  className?: string;
}

export default function PriceChart({ data = mockChartData, className = "" }: PriceChartProps) {
  return (
    <div className={`w-full h-64 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            domain={['dataMin - 1000', 'dataMax + 1000']}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--fw-blue))"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: "hsl(var(--fw-blue))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
