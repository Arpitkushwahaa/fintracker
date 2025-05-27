"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import { DollarSign, Plus, Filter, ArrowUpDown, Trash2 } from 'lucide-react'

// Mock data - in a real app this would be fetched from API
const TRANSACTIONS = [
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
  },
  {
    id: 'txn_6',
    description: 'Gym Membership',
    amount: -49.99,
    date: new Date(2023, 5, 5),
    category: 'Health',
    accountId: 'acc_1'
  },
  {
    id: 'txn_7',
    description: 'Electricity Bill',
    amount: -120.50,
    date: new Date(2023, 5, 7),
    category: 'Utilities',
    accountId: 'acc_1'
  },
  {
    id: 'txn_8',
    description: 'Freelance Payment',
    amount: 850.00,
    date: new Date(2023, 5, 8),
    category: 'Income',
    accountId: 'acc_2'
  },
  {
    id: 'txn_9',
    description: 'Amazon Purchase',
    amount: -34.99,
    date: new Date(2023, 5, 10),
    category: 'Shopping',
    accountId: 'acc_3'
  },
  {
    id: 'txn_10',
    description: 'Software Subscription',
    amount: -9.99,
    date: new Date(2023, 5, 12),
    category: 'Technology',
    accountId: 'acc_1'
  }
]

const ACCOUNTS = [
  {
    id: 'acc_1',
    name: 'Checking Account',
    type: 'checking',
  },
  {
    id: 'acc_2',
    name: 'Savings Account',
    type: 'savings',
  },
  {
    id: 'acc_3',
    name: 'Credit Card',
    type: 'credit_card',
  },
]

const CATEGORIES = [
  'All',
  'Income',
  'Groceries',
  'Entertainment',
  'Transportation',
  'Food',
  'Health',
  'Utilities',
  'Shopping',
  'Technology',
]

export default function TransactionsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [transactions, setTransactions] = useState<{
    id: string;
    description: string;
    amount: number;
    date: Date;
    category: string;
    accountId: string;
  }[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<{
    id: string;
    description: string;
    amount: number;
    date: Date;
    category: string;
    accountId: string;
  }[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [accountFilter, setAccountFilter] = useState('All')
  const [sortField, setSortField] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  
  // Load transactions
  useEffect(() => {
    // In a real app, this would be an API call
    setTransactions(TRANSACTIONS)
  }, [])
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...transactions]
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(txn => 
        txn.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Apply category filter
    if (categoryFilter !== 'All') {
      result = result.filter(txn => txn.category === categoryFilter)
    }
    
    // Apply account filter
    if (accountFilter !== 'All') {
      result = result.filter(txn => txn.accountId === accountFilter)
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      
      if (sortField === 'date') {
        comparison = a.date.getTime() - b.date.getTime()
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount
      } else if (sortField === 'description') {
        comparison = a.description.localeCompare(b.description)
      }
      
      return sortDirection === 'desc' ? -comparison : comparison
    })
    
    setFilteredTransactions(result)
  }, [transactions, searchQuery, categoryFilter, accountFilter, sortField, sortDirection])
  
  // Toggle row selection
  const toggleRowSelection = (transactionId: string) => {
    setSelectedTransactions(prevSelected => {
      if (prevSelected.includes(transactionId)) {
        return prevSelected.filter(id => id !== transactionId)
      } else {
        return [...prevSelected, transactionId]
      }
    })
  }
  
  // Select/deselect all transactions
  const toggleSelectAll = () => {
    if (selectedTransactions.length === filteredTransactions.length) {
      setSelectedTransactions([])
    } else {
      setSelectedTransactions(filteredTransactions.map(txn => txn.id))
    }
  }
  
  // Delete selected transactions
  const deleteSelectedTransactions = () => {
    // In a real app, this would be an API call
    setTransactions(prevTransactions => 
      prevTransactions.filter(txn => !selectedTransactions.includes(txn.id))
    )
    setSelectedTransactions([])
  }
  
  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }
  
  // Get account name by ID
  const getAccountName = (accountId: string) => {
    const account = ACCOUNTS.find(acc => acc.id === accountId)
    return account ? account.name : 'Unknown Account'
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-pulse text-2xl">Loading...</div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage all your financial transactions
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          {selectedTransactions.length > 0 && (
            <Button 
              variant="destructive" 
              onClick={deleteSelectedTransactions}
              className="flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          )}
          <Button onClick={() => router.push('/transactions/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            A complete list of all your financial transactions
          </CardDescription>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1">
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={accountFilter} onValueChange={setAccountFilter}>
                <SelectTrigger className="w-[180px]">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Accounts</SelectItem>
                  {ACCOUNTS.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={selectedTransactions.length === filteredTransactions.length && filteredTransactions.length > 0}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="flex items-center p-0 h-auto font-medium"
                      onClick={() => toggleSort('date')}
                    >
                      Date
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="flex items-center p-0 h-auto font-medium"
                      onClick={() => toggleSort('description')}
                    >
                      Description
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">
                    <Button 
                      variant="ghost" 
                      className="flex items-center p-0 h-auto font-medium ml-auto"
                      onClick={() => toggleSort('amount')}
                    >
                      Amount
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Checkbox 
                          checked={selectedTransactions.includes(transaction.id)}
                          onCheckedChange={() => toggleRowSelection(transaction.id)}
                          aria-label={`Select transaction ${transaction.description}`}
                        />
                      </TableCell>
                      <TableCell>
                        {format(transaction.date, 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {transaction.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getAccountName(transaction.accountId)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${transaction.amount >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {transaction.amount >= 0 ? '+' : ''}${transaction.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}