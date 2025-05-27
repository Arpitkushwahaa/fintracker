import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DollarSign, BarChart3, PieChart, CreditCard, Shield, Clock, Activity } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Take Control of Your <span className="text-primary">Finances</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Track expenses, manage accounts, and gain insights with our AI-powered financial management platform.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href="/login">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
          
          <div className="mt-16 bg-card rounded-xl shadow-lg border overflow-hidden">
            <div className="relative w-full h-[300px] md:h-[500px]">
              <Image 
                src="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg"
                alt="Finance dashboard"
                fill
                style={{ objectFit: 'cover' }}
                priority
                className="rounded-t-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Powerful Features to Manage Your Finances
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<DollarSign className="h-12 w-12 text-primary" />}
              title="Expense Tracking" 
              description="Effortlessly track and categorize your expenses to understand your spending habits."
            />
            <FeatureCard 
              icon={<BarChart3 className="h-12 w-12 text-primary" />}
              title="Financial Reports" 
              description="Get detailed reports and analytics to gain insights into your financial health."
            />
            <FeatureCard 
              icon={<CreditCard className="h-12 w-12 text-primary" />}
              title="Multiple Accounts" 
              description="Manage all your accounts in one place - checking, savings, credit cards, and more."
            />
            <FeatureCard 
              icon={<Shield className="h-12 w-12 text-primary" />}
              title="Budget Planning" 
              description="Set budgets for different categories and receive alerts when you're nearing limits."
            />
            <FeatureCard 
              icon={<Clock className="h-12 w-12 text-primary" />}
              title="Recurring Transactions" 
              description="Set up recurring transactions for bills and subscriptions to never miss a payment."
            />
            <FeatureCard 
              icon={<Activity className="h-12 w-12 text-primary" />}
              title="AI Insights" 
              description="AI-powered insights to help you optimize your spending and saving habits."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to transform your financial life?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already taken control of their finances with our platform.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg">
            <Link href="/login">Start for Free</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card border rounded-xl p-6 transition-all duration-300 hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}