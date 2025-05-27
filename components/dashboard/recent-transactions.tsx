"use client"

import { formatDistanceToNow } from 'date-fns'
import { CreditCard, Wallet, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface Transaction {
  id: string
  description: string
  amount: number
  date: Date
  category: string
  accountId: string
}

interface Account {
  id: string
  name: string
  balance: number
  type: string
  currency: string
  color: string
  isDefault: boolean
}

export function RecentTransactions({ 
  transactions, 
  accounts 
}: { 
  transactions: Transaction[]
  accounts: Account[] 
}) {
  // Sort transactions by date (most recent first) and take the first 5
  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5)

  const getAccountById = (accountId: string) => {
    return accounts.find(account => account.id === accountId)
  }

  return (
    <div className="space-y-4">
      {recentTransactions.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No transactions yet
        </div>
      ) : (
        recentTransactions.map((transaction) => {
          const account = getAccountById(transaction.accountId)
          const isIncome = transaction.amount > 0
          
          return (
            <div key={transaction.id} className="flex items-center gap-4">
              <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-emerald-100 dark:bg-emerald-900/20' : 'bg-rose-100 dark:bg-rose-900/20'}`}>
                {isIncome ? (
                  <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-rose-500" />
                )}
              </div>
              
              <div className="flex-grow">
                <div className="font-medium">{transaction.description}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <span>{transaction.category}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(transaction.date, { addSuffix: true })}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className={`font-medium ${isIncome ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                </span>
                {account && (
                  <span className="text-xs text-muted-foreground">{account.name}</span>
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}