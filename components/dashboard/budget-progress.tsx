"use client"

import { 
  Progress
} from '@/components/ui/progress'

interface Budget {
  id: string
  category: string
  amount: number
  current: number
  period: string
}

export function BudgetProgress({ budgets }: { budgets: Budget[] }) {
  return (
    <div className="space-y-6">
      {budgets.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No budgets created yet
        </div>
      ) : (
        budgets.map((budget) => {
          const progress = (budget.current / budget.amount) * 100
          let progressColor = 'bg-primary'
          
          if (progress >= 90) {
            progressColor = 'bg-destructive'
          } else if (progress >= 75) {
            progressColor = 'bg-amber-500'
          }
          
          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{budget.category}</span>
                <span className="text-sm">
                  ${budget.current.toFixed(2)} / ${budget.amount.toFixed(2)}
                </span>
              </div>
              <Progress 
                value={progress} 
                className="h-2"
                indicatorClassName={progressColor}
              />
              <p className="text-xs text-muted-foreground">
                {progress >= 90 ? (
                  <span className="text-destructive font-medium">Over budget!</span>
                ) : progress >= 75 ? (
                  <span className="text-amber-500 font-medium">Getting close to limit</span>
                ) : (
                  <span>{Math.round(100 - progress)}% remaining for {budget.period}</span>
                )}
              </p>
            </div>
          )
        })
      )}
    </div>
  )
}