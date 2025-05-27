"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, LoaderCircle, Upload } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'

// Mock data - in a real app these would come from API
const accounts = [
  { id: 'acc_1', name: 'Checking Account' },
  { id: 'acc_2', name: 'Savings Account' },
  { id: 'acc_3', name: 'Credit Card' },
]

const categories = [
  'Income',
  'Groceries',
  'Entertainment',
  'Transportation',
  'Food',
  'Health',
  'Utilities',
  'Shopping',
  'Technology',
  'Housing',
  'Education',
  'Travel',
  'Other',
]

const formSchema = z.object({
  accountId: z.string({ required_error: "Please select an account" }),
  type: z.enum(['income', 'expense'], { required_error: "Please select a transaction type" }),
  category: z.string({ required_error: "Please select a category" }),
  amount: z.string()
    .refine(value => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
      message: "Amount must be a positive number",
    }),
  description: z.string().min(2, { message: "Description must be at least 2 characters" }),
  date: z.date({ required_error: "Please select a date" }),
  isRecurring: z.boolean().default(false),
  recurringType: z.string().optional(),
  receiptImage: z.any().optional(),
})

export default function NewTransactionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [receiptData, setReceiptData] = useState(null)
  const [isProcessingReceipt, setIsProcessingReceipt] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'expense',
      amount: '',
      description: '',
      date: new Date(),
      isRecurring: false,
    },
  })
  
  const isRecurring = form.watch('isRecurring')
  const transactionType = form.watch('type')
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      // In a real app, this would be an API call
      console.log('Transaction data:', data)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Transaction created',
        description: 'Your transaction has been successfully recorded.',
      })
      
      router.push('/transactions')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create transaction. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const processReceipt = async (file: File) => {
    setIsProcessingReceipt(true)
    try {
      // In a real app, this would send the image to an AI service for processing
      // Here we're just simulating a response after a delay
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock AI response
      const mockResponse = {
        merchantName: 'Grocery Store ABC',
        total: '87.53',
        date: new Date(),
        items: [
          { name: 'Vegetables', price: '23.45' },
          { name: 'Bread', price: '4.99' },
          { name: 'Milk', price: '3.29' },
          { name: 'Cereal', price: '5.49' },
          { name: 'Chicken', price: '12.99' },
          { name: 'Pasta', price: '2.49' },
          { name: 'Cheese', price: '8.99' },
          { name: 'Juice', price: '4.49' },
          { name: 'Yogurt', price: '6.99' },
          { name: 'Fruits', price: '14.36' },
        ],
      }
      
      setReceiptData(mockResponse)
      
      // Update form values
      form.setValue('description', mockResponse.merchantName)
      form.setValue('amount', mockResponse.total)
      form.setValue('category', 'Groceries')
      form.setValue('date', mockResponse.date)
      
      toast({
        title: 'Receipt scanned successfully',
        description: 'Receipt data has been extracted and filled in the form.',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Receipt scanning failed',
        description: 'Could not process the receipt. Please enter details manually.',
      })
    } finally {
      setIsProcessingReceipt(false)
    }
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processReceipt(file)
    }
  }
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Transaction</h1>
          <p className="text-muted-foreground">Record a new financial transaction</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
            <CardDescription>
              Enter the details of your new transaction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select transaction type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="accountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              $
                            </span>
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter transaction description" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isRecurring"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Recurring Transaction</FormLabel>
                        <FormDescription>
                          Set up this transaction to repeat automatically
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {isRecurring && (
                  <FormField
                    control={form.control}
                    name="recurringType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recurring Frequency</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Transaction'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Receipt Scanner</CardTitle>
            <CardDescription>
              Upload a receipt to automatically extract transaction details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Upload className="h-10 w-10 text-muted-foreground/50" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Drag & drop a receipt image or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Supports: JPG, PNG, PDF
                  </p>
                </div>
                <label className="relative">
                  <Button variant="secondary" disabled={isProcessingReceipt}>
                    {isProcessingReceipt ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Processing Receipt...
                      </>
                    ) : (
                      'Upload Receipt'
                    )}
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isProcessingReceipt}
                  />
                </label>
              </div>
            </div>
            
            {receiptData && (
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">Receipt Data</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Merchant:</span>
                    <span className="font-medium">{receiptData.merchantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{format(receiptData.date, 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-medium">${receiptData.total}</span>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <h4 className="font-medium mb-1">Items:</h4>
                    <ul className="space-y-1 max-h-40 overflow-y-auto">
                      {receiptData.items.map((item, index) => (
                        <li key={index} className="flex justify-between text-xs">
                          <span>{item.name}</span>
                          <span>${item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            <p>
              Our AI-powered receipt scanner extracts transaction details automatically, saving you time on manual data entry.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}