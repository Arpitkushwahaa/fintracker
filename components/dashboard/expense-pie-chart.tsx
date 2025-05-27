"use client"

import { useState, useEffect } from 'react'
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip } from 'recharts'

// Sample data - in a real app this would come from API
const data = [
  { name: 'Food', value: 400, color: 'hsl(var(--chart-1))' },
  { name: 'Transportation', value: 300, color: 'hsl(var(--chart-2))' },
  { name: 'Entertainment', value: 200, color: 'hsl(var(--chart-3))' },
  { name: 'Housing', value: 600, color: 'hsl(var(--chart-4))' },
  { name: 'Utilities', value: 150, color: 'hsl(var(--chart-5))' },
]

export function ExpensePieChart() {
  const [chartData, setChartData] = useState<{ name: string; value: number; color: string; }[]>([])
  
  // Simulate data loading from API
  useEffect(() => {
    const timer = setTimeout(() => {
      setChartData(data)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-pulse text-md">Loading chart data...</div>
      </div>
    )
  }
  
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`$${value}`, 'Expenses']}
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '0.5rem',
              padding: '0.5rem',
            }}
          />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            formatter={(value, entry, index) => {
              return <span className="text-xs">{value}</span>
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}