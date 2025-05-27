"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { 
  Pencil, 
  Plus, 
  Trash2, 
  DollarSign, 
  ShoppingCart, 
  Car, 
  Home, 
  Utensils, 
  Film, 
  HeartPulse, 
  Shirt, 
  Plane, 
  Wifi, 
  Gift, 
  Droplets,
  LoaderCircle
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

type Budget = {
  id: string
  category: string
  amount: number
  current: number
  period: 'monthly' | 'weekly' | 'yearly'
}

const budgetFormSchema = z.object({
  category: z.string({
    required_error: "Please select a category.",
  }),
  amount: z.string().refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'Budget amount must be a positive number.',
  }),
  period: z.enum(['monthly', 'weekly', 'yearly'], {
    required_error: "Please select a period.",
  }),
})

type BudgetFormValues = z.infer<typeof budgetFormSchema>

const categories = [
  { value: 'groceries', label: 'Groceries', icon: <ShoppingCart className="h-4 w-4 mr-2" /> },
  { value: 'transportation', label: 'Transportation', icon: <Car className="h-4 w-4 mr-2" /> },
  { value: 'housing', label: 'Housing', icon: <Home className="h-4 w-4 mr-2" /> },
  { value: 'food', label: 'Food & Dining', icon: <Utensils className="h-4 w-4 mr-2" /> },
  { value: 'entertainment', label: 'Entertainment', icon: <Film className="h-4 w-4 mr-2" /> },
  { value: 'healthcare', label: 'Healthcare', icon: <HeartPulse className="h-4 w-4 mr-2" /> },
  { value: 'clothing', label: 'Clothing', icon: <Shirt className="h-4 w-4 mr-2" /> },
  { value: 'travel', label: 'Travel', icon: <Plane className="h-4 w-4 mr-2" /> },
  { value: 'utilities', label: 'Utilities', icon: <Wifi className="h-4 w-4 mr-2" /> },
  { value: 'gifts', label: 'Gifts & Donations', icon: <Gift className="h-4 w-4 mr-2" /> },
  { value: 'other', label: 'Other', icon: <Droplets className="h-4 w-4 mr-2" /> },
]

export default function BudgetsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('all')
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false)
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Sample budget data - in a real app, this would come from an API
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: 'bdg_1',
      category: 'groceries',
      amount: 500,
      current: 350,
      period: 'monthly'
    },
    {
      id: 'bdg_2',
      category: 'entertainment',
      amount: 200,
      current: 180,
      period: 'monthly'
    },
    {
      id: 'bdg_3',
      category: 'transportation',
      amount: 300,
      current: 150,
      period: 'monthly'
    },
    {
      id: 'bdg_4',
      category: 'housing',
      amount: 1200,
      current: 1200,
      period: 'monthly'
    },
    {
      id: 'bdg_5',
      category: 'utilities',
      amount: 150,
      current: 120,
      period: 'monthly'
    }
  ])

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category: '',
      amount: '',
      period: 'monthly',
    },
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (selectedBudget && isEditBudgetOpen) {
      form.reset({
        category: selectedBudget.category,
        amount: selectedBudget.amount.toString(),
        period: selectedBudget.period,
      })
    }
  }, [selectedBudget, isEditBudgetOpen, form])

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-pulse text-2xl">Loading...</div>
      </div>
    )
  }

  const handleAddBudget = (data: BudgetFormValues) => {
    setIsSubmitting(true)
    try {
      // This would be an API call in a real app
      const newBudget: Budget = {
        id: `bdg_${budgets.length + 1}`,
        category: data.category,
        amount: parseFloat(data.amount),
        current: 0,
        period: data.period,
      }
      
      setBudgets([...budgets, newBudget])
      toast({
        title: 'Budget Created',
        description: `Your ${getCategoryLabel(data.category)} budget has been created.`,
      })
      setIsAddBudgetOpen(false)
      form.reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditBudget = (data: BudgetFormValues) => {
    setIsSubmitting(true)
    try {
      if (selectedBudget) {
        // This would be an API call in a real app
        const updatedBudgets = budgets.map(budget => {
          if (budget.id === selectedBudget.id) {
            return {
              ...budget,
              category: data.category,
              amount: parseFloat(data.amount),
              period: data.period,
            }
          }
          return budget
        })
        
        setBudgets(updatedBudgets)
        toast({
          title: 'Budget Updated',
          description: `Your ${getCategoryLabel(data.category)} budget has been updated.`,
        })
        setIsEditBudgetOpen(false)
        setSelectedBudget(null)
        form.reset()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteBudget = () => {
    if (selectedBudget) {
      // This would be an API call in a real app
      const updatedBudgets = budgets.filter(budget => budget.id !== selectedBudget.id)
      setBudgets(updatedBudgets)
      toast({
        title: 'Budget Deleted',
        description: `Your ${getCategoryLabel(selectedBudget.category)} budget has been deleted.`,
      })
      setIsDeleteDialogOpen(false)
      setSelectedBudget(null)
    }
  }

  const getCategoryLabel = (value: string) => {
    const category = categories.find(cat => cat.value === value)
    return category ? category.label : value
  }

  const getCategoryIcon = (value: string) => {
    const category = categories.find(cat => cat.value === value)
    return category ? category.icon : <DollarSign className="h-4 w-4 mr-2" />
  }

  const getProgressColor = (current: number, total: number) => {
    const percentage = (current / total) * 100
    if (percentage < 50) return 'bg-primary'
    if (percentage < 75) return 'bg-amber-500'
    return 'bg-destructive'
  }

  const filteredBudgets = activeTab === 'all' 
    ? budgets 
    : budgets.filter(budget => budget.period === activeTab)

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground">
            Manage your spending limits and track your progress
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => {
            form.reset()
            setIsAddBudgetOpen(true)
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Budget
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredBudgets.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center">
            <div className="flex justify-center mb-4">
              <DollarSign className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No budgets found</h3>
            <p className="text-muted-foreground mb-4">
              You haven't created any budgets for this period yet.
            </p>
            <Button onClick={() => {
              form.reset()
              setIsAddBudgetOpen(true)
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Create Budget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBudgets.map((budget) => (
            <Card key={budget.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="mr-2 p-2 rounded-full bg-primary/10">
                      {getCategoryIcon(budget.category)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{getCategoryLabel(budget.category)}</CardTitle>
                      <CardDescription>{budget.period.charAt(0).toUpperCase() + budget.period.slice(1)}</CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        setSelectedBudget(budget)
                        setIsEditBudgetOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        setSelectedBudget(budget)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Spent: ${budget.current.toFixed(2)}</span>
                    <span className="text-sm font-medium">${budget.amount.toFixed(2)}</span>
                  </div>
                  <Progress 
                    value={(budget.current / budget.amount) * 100} 
                    className={`h-2 ${getProgressColor(budget.current, budget.amount)}`}
                  />
                  <div className="text-sm text-muted-foreground text-right">
                    {Math.round((budget.current / budget.amount) * 100)}% of budget
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-1">
                <div className="w-full text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remaining:</span>
                    <span className={`font-medium ${budget.amount - budget.current <= 0 ? 'text-destructive' : ''}`}>
                      ${Math.max(0, budget.amount - budget.current).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Add Budget Dialog */}
      <Dialog open={isAddBudgetOpen} onOpenChange={setIsAddBudgetOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Budget</DialogTitle>
            <DialogDescription>
              Create a new budget to track your spending in a category.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddBudget)} className="space-y-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center">
                              {category.icon}
                              {category.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-8"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Period</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Budget'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Budget Dialog */}
      <Dialog open={isEditBudgetOpen} onOpenChange={setIsEditBudgetOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>
              Update your budget settings.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditBudget)} className="space-y-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center">
                              {category.icon}
                              {category.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-8"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Period</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Budget'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Budget Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the budget for {selectedBudget && getCategoryLabel(selectedBudget.category)}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBudget} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
