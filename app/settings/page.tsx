"use client"

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserCircle, Save, Bell, Shield, CreditCard, Mail, Smartphone } from 'lucide-react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  })
})

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(false),
  monthlyReports: z.boolean().default(true),
  securityAlerts: z.boolean().default(true),
})

const securityFormSchema = z.object({
  currentPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;
type SecurityFormValues = z.infer<typeof securityFormSchema>;

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pushPermission, setPushPermission] = useState<string>("default")

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || ""
    },
  })

  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: false,
      monthlyReports: true,
      securityAlerts: true,
    },
  })

  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || "",
        email: user.email || ""
      })
    }
  }, [user, profileForm])
  
  // Initialize avatar from user data
  useEffect(() => {
    if (user?.image) {
      setAvatarSrc(user.image);
    }
  }, [user?.image])
  
  // Check notification permission status
  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPushPermission(Notification.permission);
    }
  }, [])

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-pulse text-2xl">Loading...</div>
      </div>
    )
  }

  function onProfileSubmit(data: ProfileFormValues) {
    // In a real app, this would call an API
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated.",
    })
  }

  function onNotificationsSubmit(data: NotificationsFormValues) {
    // In a real app, this would call an API
    toast({
      title: "Notification preferences updated",
      description: "Your notification preferences have been saved.",
    })
  }
  
  // Handle push notification permission
  async function handlePushToggle(checked: boolean) {
    if (checked && typeof Notification !== 'undefined') {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        setPushPermission(permission);
        
        if (permission === 'granted') {
          notificationsForm.setValue('pushNotifications', true);
          toast({
            title: "Push notifications enabled",
            description: "You will now receive push notifications.",
          });
        } else {
          notificationsForm.setValue('pushNotifications', false);
          toast({
            title: "Push notifications disabled",
            description: "Permission was denied. You can change this in your browser settings.",
            variant: "destructive"
          });
        }
      } else if (Notification.permission === 'denied') {
        toast({
          title: "Permission required",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive"
        });
        notificationsForm.setValue('pushNotifications', false);
      }
    }
    return checked && pushPermission === 'granted';
  }

  function onSecuritySubmit(data: SecurityFormValues) {
    // In a real app, this would call an API
    toast({
      title: "Password changed",
      description: "Your password has been updated successfully.",
    })
    securityForm.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        <div className="hidden md:block">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-1">
                <Button 
                  variant={activeTab === "profile" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("profile")}
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button 
                  variant={activeTab === "notifications" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
                <Button 
                  variant={activeTab === "security" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("security")}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="md:hidden mb-6"
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Manage your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <div className="flex flex-col items-center">
                        <Avatar className="h-24 w-24 mb-2 border-2 border-border bg-card">
                          <AvatarImage src={avatarSrc || user.image || ''} alt={user.name || 'User'} />
                          <AvatarFallback className="bg-muted text-foreground">
                            <UserCircle className="h-12 w-12" />
                          </AvatarFallback>
                        </Avatar>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setAvatarSrc(e.target?.result as string);
                                toast({
                                  title: "Avatar updated",
                                  description: "Your profile picture has been updated.",
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Change Avatar
                        </Button>
                      </div>
                      <div className="flex-1 space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationsForm}>
                  <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={notificationsForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center">
                                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                <FormLabel className="text-base">Email Notifications</FormLabel>
                              </div>
                              <FormDescription>
                                Receive notifications via email
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
                      <FormField
                        control={notificationsForm.control}
                        name="pushNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center">
                                <Smartphone className="mr-2 h-4 w-4 text-muted-foreground" />
                                <FormLabel className="text-base">Push Notifications</FormLabel>
                              </div>
                              <FormDescription>
                                Receive notifications on your device
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={async (checked) => {
                                  const result = await handlePushToggle(checked);
                                  field.onChange(result);
                                }}
                                disabled={pushPermission === 'denied'}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationsForm.control}
                        name="monthlyReports"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center">
                                <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                                <FormLabel className="text-base">Monthly Reports</FormLabel>
                              </div>
                              <FormDescription>
                                Receive monthly financial reports
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
                      <FormField
                        control={notificationsForm.control}
                        name="securityAlerts"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center">
                                <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                                <FormLabel className="text-base">Security Alerts</FormLabel>
                              </div>
                              <FormDescription>
                                Receive alerts about suspicious activity
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
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...securityForm}>
                  <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                    <FormField
                      control={securityForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={securityForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={securityForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Separator />
                    <div className="flex justify-end">
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Update Password
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
