import Link from "next/link";
import { Rocket } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-slate-50/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="h-6 w-6 text-primary" />
              <span className="font-headline font-bold text-xl tracking-tight">CareerPilot AI</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your AI-powered copilot for landing your next dream job. Built with love for the modern job seeker.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-slate-500">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/signup" className="hover:text-primary transition-colors">Get Started</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-slate-500">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-slate-500">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/support" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="mailto:support@careerpilotai.com" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 border-t border-slate-200 md:flex-row">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {currentYear} CareerPilot AI. India's favorite job copilot.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
             <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500"></span> Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
