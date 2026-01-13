import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { CreditCard, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthProvider";
import { paymentsAPI } from "@/services/api";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  amount: number;
  contestId: string;
}

export function PaymentModal({ open, onClose, onComplete, amount, contestId }: PaymentModalProps) {
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();

  const handlePayment = async () => {
    if (!user) {
      toast.error("You must be logged in to make a payment");
      return;
    }

    setProcessing(true);

    try {
      // 1. Initialize payment in backend to get a reference and link to contest
      const initData = await paymentsAPI.initialize({
        amount,
        payment_method: "paystack",
        contestId: contestId
      });

      if (initData.is_free) {
        setProcessing(false);
        toast.success(initData.message || "Promotion applied! Entry confirmed.");
        onClose();
        onComplete();
        return;
      }

      if (!initData.access_code) {
        throw new Error("Failed to get access code from payment gateway");
      }

      // 2. Open Paystack Inline Popup using the access_code
      const publicKey = (import.meta as any).env.VITE_PAYSTACK_PUBLIC_KEY;

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: user.email,
        amount: amount * 100, // Paystack expects amount in kobo
        access_code: initData.access_code,
        callback: function (response: any) {
          console.log("Paystack callback response:", response);

          // Handle verification asynchronously without making callback async
          paymentsAPI.verify(response.reference)
            .then(() => {
              toast.success('Payment successful and verified!');
              onComplete();
              // Reload page to refresh all data
              setTimeout(() => window.location.reload(), 1000);
            })
            .catch((err) => {
              console.error("Verification error:", err);
              toast.error('Payment verification failed. Please contact support.');
              onComplete();
            })
            .finally(() => {
              setProcessing(false);
            });
        },
        onClose: function () {
          setProcessing(false);
          toast.info("Payment window closed");
        },
      });

      // Close our modal before opening Paystack
      onClose();
      handler.openIframe();
    } catch (error: any) {
      console.error("Payment initialization failed", error);
      toast.error(error.message || "Failed to initialize payment");
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-secondary" />
            Complete Payment
          </DialogTitle>
          <DialogDescription>
            A secure payment window will open to complete your transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gradient-to-br from-primary to-secondary text-white p-6 rounded-lg mb-4">
          <p className="text-sm opacity-90 mb-1">Amount to Pay</p>
          <p className="text-3xl">₦{amount.toLocaleString()}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-md mb-4">
          <Lock className="w-4 h-4" />
          <span>Your payment information is secure and encrypted</span>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={processing}>
            Cancel
          </Button>
          <Button onClick={handlePayment} className="flex-1 bg-secondary hover:bg-secondary/90" disabled={processing}>
            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : `Pay ₦${amount.toLocaleString()}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

