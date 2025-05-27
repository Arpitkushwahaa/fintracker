"use client"

import { useState, useEffect } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'

// Mock data - this would come from API in a real app
const data = [
  {
    name: 'Jan',
    income: 4000,
    expenses: 2400,
  },
  {
    name: 'Feb',
    income: 3000,
    expenses: 1398,
  },
  {
    name: 'Mar',
    income: 2000,
    expenses: 1800,
  },
  {
    name: 'Apr',
    income: 2780,
    expenses: 3908,
  },
  {
    name: 'May',
    income: 1890,
    expenses: 2800,
  },
  {
    name: 'Jun',
    income: 2390,
    expenses: 3800,
  },
]

export function MonthlySpendingChart() {
  const [chartData, setChartData] = useState<{ name: string; income: number; expenses: number; }[]>([])
  
  // Simulate data loading from API
  useEffect(() => {
    const timer = setTimeout(() => {
      setChartData(data)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="animate-pulse text-md">Loading chart data...</div>
      </div>
    )
  }
  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: 'hsl(var(--muted))' }}
            axisLine={{ stroke: 'hsl(var(--muted))' }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
            tickLine={{ stroke: 'hsl(var(--muted))' }}
            axisLine={{ stroke: 'hsl(var(--muted))' }}
          />
          <Tooltip
            formatter={(value) => [`$${value}`, '']}
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '0.5rem',
              padding: '0.5rem',
            }}
          />
          <Legend />
          <Bar dataKey="income" name="Income" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}