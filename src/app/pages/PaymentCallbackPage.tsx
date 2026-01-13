import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { paymentsAPI } from "@/services/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function PaymentCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        const verifyPayment = async () => {
            const reference = searchParams.get("reference");

            if (!reference) {
                toast.error("No payment reference found");
                navigate("/");
                return;
            }

            try {
                const response = await paymentsAPI.verify(reference);

                // Check verification response structure
                // Backend returns: { message, payment: { ... status: 'completed' } }
                if (response.payment?.status === "completed") {
                    toast.success("Payment successful! You can now upload your video.");
                } else {
                    toast.warning("Payment verification incomplete. Status: " + response.payment?.status);
                }
            } catch (error: any) {
                console.error("Payment verification error:", error);
                toast.error(error.message || "Failed to verify payment");
            } finally {
                setIsVerifying(false);
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        };

        verifyPayment();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            {isVerifying ? (
                <>
                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                    <h2 className="text-xl font-semibold">Verifying Payment...</h2>
                    <p className="text-muted-foreground">Please wait while we confirm your transaction.</p>
                </>
            ) : (
                <>
                    <h2 className="text-xl font-semibold">Verification Complete</h2>
                    <p className="text-muted-foreground">Redirecting you back to the dashboard...</p>
                </>
            )}
        </div>
    );
}
