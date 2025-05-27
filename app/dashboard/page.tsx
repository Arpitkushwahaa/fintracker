"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AccountDrawer } from '@/components/dashboard/account-drawer'
import { OverviewStats } from '@/components/dashboard/overview-stats'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { ExpensePieChart } from '@/components/dashboard/expense-pie-chart'
import { MonthlySpendingChart } from '@/components/dashboard/monthly-spending-chart'
import { BudgetProgress } from '@/components/dashboard/budget-progress'
import { DollarSign, Plus, CreditCard, Wallet, LineChart } from 'lucide-react'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const userName = user?.firstName || user?.username || 'User'
  const router = useRouter()
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)
  const [accounts, setAccounts] = useState([
    {
      id: 'acc_1',
      name: 'Checking Account',
      balance: 2340.65,
      type: 'checking',
      currency: 'USD',
      color: '#22C55E',
      isDefault: true
    },
    {
      id: 'acc_2',
      name: 'Savings Account',
      balance: 12500.00,
      type: 'savings',
      currency: 'USD',
      color: '#3B82F6',
      isDefault: false
    },
    {
      id: 'acc_3',
      name: 'Credit Card',
      balance: -450.32,
      type: 'credit_card',
      currency: 'USD',
      color: '#EF4444',
      isDefault: false
    }
  ])
  
  const [transactions, setTransactions] = useState([
    {
      id: 'txn_1',
      description: 'Grocery Store',
      amount: -82.45,
      date: new Date(2023, 5, 1),
      category: 'Groceries',
      accountId: 'acc_1'
    },
    {
      id: 'txn_2',
      description: 'Salary Deposit',
      amount: 3200.00,
      date: new Date(2023, 5, 1),
      category: 'Income',
      accountId: 'acc_1'
    },
    {
      id: 'txn_3',
      description: 'Netflix Subscription',
      amount: -15.99,
      date: new Date(2023, 5, 2),
      category: 'Entertainment',
      accountId: 'acc_3'
    },
    {
      id: 'txn_4',
      description: 'Gas Station',
      amount: -45.30,
      date: new Date(2023, 5, 3),
      category: 'Transportation',
      accountId: 'acc_1'
    },
    {
      id: 'txn_5',
      description: 'Restaurant Dinner',
      amount: -65.20,
      date: new Date(2023, 5, 4),
      category: 'Food',
      accountId: 'acc_3'
    }
  ])
  
  const [budgets, setBudgets] = useState([
    {
      id: 'bdg_1',
      category: 'Groceries',
      amount: 500,
      current: 350,
      period: 'monthly'
    },
    {
      id: 'bdg_2',
      category: 'Entertainment',
      amount: 200,
      current: 180,
      period: 'monthly'
    },
    {
      id: 'bdg_3',
      category: 'Transportation',
      amount: 300,
      current: 150,
      period: 'monthly'
    }
  ])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-pulse text-2xl">Loading...</div>
      </div>
    )
  }
  
  if (!user) {
    return null; // This prevents flash of content before redirect happens
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userName}! Here's an overview of your finances.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Button onClick={() => router.push('/transactions/new')}>
            <DollarSign className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
          <Button variant="outline" onClick={() => setIsAddAccountOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </div>
      </div>

      <OverviewStats totalBalance={totalBalance} totalIncome={totalIncome} totalExpenses={totalExpenses} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Monthly Spending</CardTitle>
            <CardDescription>Your spending pattern over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlySpendingChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>By category this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpensePieChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Accounts</CardTitle>
            <CardDescription>Manage your financial accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accounts.map((account) => (
                <div 
                  key={account.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                      style={{ backgroundColor: account.color + '20' }}
                    >
                      {account.type === 'checking' && <Wallet className="h-5 w-5" style={{ color: account.color }} />}
                      {account.type === 'savings' && <DollarSign className="h-5 w-5" style={{ color: account.color }} />}
                      {account.type === 'credit_card' && <CreditCard className="h-5 w-5" style={{ color: account.color }} />}
                    </div>
                    <div>
                      <div className="font-medium">
                        {account.name}
                        {account.isDefault && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {account.type.charAt(0).toUpperCase() + account.type.slice(1).replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  <div className={`font-medium ${account.balance < 0 ? 'text-destructive' : 'text-primary'}`}>
                    {account.balance < 0 ? '-' : ''}${Math.abs(account.balance).toFixed(2)}
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => setIsAddAccountOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
            <CardDescription>Monthly budget tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetProgress budgets={budgets} />
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => router.push('/budgets')}
            >
              Manage Budgets
            </Button>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activities</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={transactions} accounts={accounts} />
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => router.push('/transactions')}
            >
              View All Transactions
            </Button>
          </CardContent>
        </Card>
      </div>

      <AccountDrawer 
        open={isAddAccountOpen} 
        onOpenChange={setIsAddAccountOpen}
        onSubmit={(data) => {
          // This would be an API call in a real app
          const newAccount = {
            id: `acc_${accounts.length + 1}`,
            name: data.name,
            balance: parseFloat(data.initialBalance),
            type: data.type,
            currency: 'USD',
            color: data.color || '#3B82F6',
            isDefault: data.isDefault,
          }
          
          // Update other accounts if this is set as default
          const updatedAccounts = [...accounts]
          if (data.isDefault) {
            updatedAccounts.forEach(account => {
              account.isDefault = false
            })
          }
          
          setAccounts([...updatedAccounts, newAccount])
          toast({
            title: 'Account Created',
            description: `${data.name} has been added to your accounts.`,
          })
        }}
      />
    </div>
  )
}