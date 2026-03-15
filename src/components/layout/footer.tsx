import Link from "next/link";
import { Rocket } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built for your next career move.
            </p>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} CareerPilot AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
