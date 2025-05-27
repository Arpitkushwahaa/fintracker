"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AccountDrawer } from '@/components/dashboard/account-drawer'
import { useToast } from '@/hooks/use-toast'
import { Plus, Pencil, Trash2, CreditCard, DollarSign, Wallet } from 'lucide-react'

// Mock data - in a real app this would be fetched from API
const ACCOUNTS = [
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
]

export default function AccountsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const [accounts, setAccounts] = useState<{
    id: string;
    name: string;
    balance: number;
    type: string;
    currency: string;
    color: string;
    isDefault: boolean;
  }[]>([])
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)
  
  // Load accounts
  useEffect(() => {
    // In a real app, this would be an API call
    setAccounts(ACCOUNTS)
  }, [])
  
  const setDefaultAccount = (accountId: string) => {
    // In a real app, this would be an API call
    setAccounts(prevAccounts => 
      prevAccounts.map(account => ({
        ...account,
        isDefault: account.id === accountId
      }))
    )
    
    toast({
      title: 'Default account updated',
      description: 'Your default account has been updated successfully.',
    })
  }
  
  const deleteAccount = (accountId: string) => {
    // Check if it's the default account
    const isDefault = accounts.find(acc => acc.id === accountId)?.isDefault
    
    if (isDefault) {
      toast({
        variant: 'destructive',
        title: 'Cannot delete default account',
        description: 'Please set another account as default before deleting this one.',
      })
      return
    }
    
    // In a real app, this would be an API call
    setAccounts(prevAccounts => 
      prevAccounts.filter(account => account.id !== accountId)
    )
    
    toast({
      title: 'Account deleted',
      description: 'The account has been deleted successfully.',
    })
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-pulse text-2xl">Loading...</div>
      </div>
    )
  }
  
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">
            Manage your financial accounts
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => setIsAddAccountOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalBalance < 0 ? 'text-destructive' : ''}`}>
              ${totalBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Card key={account.id} className="overflow-hidden">
            <div className="h-2" style={{ backgroundColor: account.color }} />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: account.color + '20' }}
                  >
                    {account.type === 'checking' && <Wallet className="h-5 w-5" style={{ color: account.color }} />}
                    {account.type === 'savings' && <DollarSign className="h-5 w-5" style={{ color: account.color }} />}
                    {account.type === 'credit_card' && <CreditCard className="h-5 w-5" style={{ color: account.color }} />}
                  </div>
                  <div>
                    <CardTitle>{account.name}</CardTitle>
                    <CardDescription>
                      {account.type.charAt(0).toUpperCase() + account.type.slice(1).replace('_', ' ')}
                    </CardDescription>
                  </div>
                </div>
                {account.isDefault && (
                  <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${account.balance < 0 ? 'text-destructive' : ''}`}>
                {account.balance < 0 ? '-' : ''}${Math.abs(account.balance).toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {account.currency}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              {!account.isDefault ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setDefaultAccount(account.id)}
                >
                  Set as Default
                </Button>
              ) : (
                <span></span>
              )}
              
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => deleteAccount(account.id)}
                  disabled={account.isDefault}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
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