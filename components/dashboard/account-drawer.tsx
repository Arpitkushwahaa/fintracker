"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Drawer, 
  DrawerContent, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Wallet, CreditCard, DollarSign, LoaderCircle, LineChart } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Account name must be at least 2 characters.',
  }),
  type: z.enum(['checking', 'savings', 'credit_card', 'investment', 'cash'], {
    required_error: 'Please select an account type.',
  }),
  initialBalance: z.string().refine(
    (val) => !isNaN(parseFloat(val)), {
    message: 'Initial balance must be a valid number.',
  }),
  color: z.string().optional(),
  isDefault: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

type AccountDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormValues) => void
  defaultValues?: Partial<FormValues>
}

const accountTypes = [
  { value: 'checking', label: 'Checking Account', icon: <Wallet className="mr-2 h-4 w-4" /> },
  { value: 'savings', label: 'Savings Account', icon: <DollarSign className="mr-2 h-4 w-4" /> },
  { value: 'credit_card', label: 'Credit Card', icon: <CreditCard className="mr-2 h-4 w-4" /> },
  { value: 'investment', label: 'Investment Account', icon: <LineChart className="mr-2 h-4 w-4" /> },
  { value: 'cash', label: 'Cash', icon: <DollarSign className="mr-2 h-4 w-4" /> },
]

export function AccountDrawer({ 
  open, 
  onOpenChange, 
  onSubmit,
  defaultValues = {
    name: '',
    type: 'checking',
    initialBalance: '0.00',
    color: '#3B82F6',
    isDefault: false,
  } 
}: AccountDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })
  
  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      form.reset(defaultValues)
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Add New Account</DrawerTitle>
            <DrawerDescription>
              Create a new financial account to track your money
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Checking Account" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accountTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center">
                                {type.icon}
                                {type.label}
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
                  name="initialBalance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Balance</FormLabel>
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
                      <FormDescription>
                        For credit cards, enter a negative value for existing debt
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Default Account</FormLabel>
                        <FormDescription>
                          Make this your primary account for transactions
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
                
                <DrawerFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                </DrawerFooter>
              </form>
            </Form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}