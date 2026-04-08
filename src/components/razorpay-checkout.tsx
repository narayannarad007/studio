'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { initiateProSubscription } from "@/actions/payments";
import { Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Script from "next/script";

interface RazorpayCheckoutProps {
  userId: string;
  userEmail?: string;
  userPhone?: string;
  userName?: string;
}

export function RazorpayCheckout({ userId, userEmail, userPhone, userName }: RazorpayCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      const response = await initiateProSubscription(userId);
      
      if (!response.success) {
        throw new Error(response.error);
      }

      const options = {
        key: response.keyId,
        subscription_id: response.subscriptionId,
        name: "Career Pilot AI",
        description: "Monthly PRO Subscription",
        image: "/logo.png", // Replace with actual logo path
        handler: function (response: any) {
          toast.success("Payment successful! Syncing your credits...");
          // Webhook handles the heavy lifting, but we redirect for UX
          setTimeout(() => {
            router.push("/dashboard?status=success");
          }, 2000);
        },
        prefill: {
          name: userName || "",
          email: userEmail || "",
          contact: userPhone || ""
        },
        theme: {
          color: "#4f46e5" // primary color
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      
      rzp.on('payment.failed', function (response: any) {
        toast.error("Payment failed: " + response.error.description);
      });

    } catch (error: any) {
      console.error("Checkout failed:", error);
      toast.error("Subscription failed to initialize. Please check your config.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Button 
        onClick={handlePayment} 
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Initializing...
          </>
        ) : (
          <>
            <Zap className="mr-2 h-4 w-4 fill-current" />
            Pay ₹299 Now
          </>
        )}
      </Button>
    </>
  );
}
