import { useState } from "react";
import { paymentAPI } from "../services/api";
import { useToast } from "./ToastContainer";
import "../scss/payment-form.scss";

// Extend Window interface for Paystack
declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface PaymentFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    amount: "10000",
    currency: "NGN",
    paymentMethod: "card",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [requiresPin, setRequiresPin] = useState(false);
  const [requiresOtp, setRequiresOtp] = useState(false);
  const { showError, showSuccess } = useToast();

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "cardNumber") {
      setFormData({
        ...formData,
        [name]: formatCardNumber(value),
      });
    } else if (name === "expiryDate") {
      setFormData({
        ...formData,
        [name]: formatExpiryDate(value),
      });
    } else if (name === "cvv") {
      setFormData({
        ...formData,
        [name]: value.replace(/\D/g, "").substring(0, 4),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPin(e.target.value.replace(/\D/g, "").substring(0, 4));
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value.replace(/\D/g, "").substring(0, 6));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (requiresPin && pin.length !== 4) {
      showError("Please enter a valid 4-digit PIN");
      return;
    }

    if (requiresOtp && otp.length !== 6) {
      showError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsProcessing(true);
    try {
      // If PIN or OTP is required, submit with those
      if (requiresPin || requiresOtp) {
        const response = await paymentAPI.charge(
          parseFloat(formData.amount),
          formData.currency,
          formData.paymentMethod,
          undefined, // authorization_code
          requiresPin ? pin : undefined,
          requiresOtp ? otp : undefined,
          formData.bankName,
          formData.accountNumber,
          formData.accountName
        );

        if (response.status === "success") {
          showSuccess("Payment completed successfully!");
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 1500);
        } else if (response.status === "send_pin") {
          setRequiresPin(true);
          showError("Please enter your card PIN");
        } else if (response.status === "send_otp") {
          setRequiresOtp(true);
          showError("Please enter the OTP sent to your phone/email");
        } else {
          showError(response.error || "Payment failed. Please try again.");
        }
        setIsProcessing(false);
        return;
      }

      // For card payments, use Paystack inline payment
      if (formData.paymentMethod === "card") {
        // Validate card details
        if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, "").length < 13) {
          showError("Please enter a valid card number");
          setIsProcessing(false);
          return;
        }
        if (!formData.cardName) {
          showError("Please enter cardholder name");
          setIsProcessing(false);
          return;
        }
        if (!formData.expiryDate || formData.expiryDate.length !== 5) {
          showError("Please enter a valid expiry date (MM/YY)");
          setIsProcessing(false);
          return;
        }
        if (!formData.cvv || formData.cvv.length < 3) {
          showError("Please enter a valid CVV");
          setIsProcessing(false);
          return;
        }

        // Get user email from localStorage
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          showError("User session expired. Please login again.");
          setIsProcessing(false);
          return;
        }
        const user = JSON.parse(userStr);
        const userEmail = user.email;

        // Check if Paystack is loaded
        if (!window.PaystackPop) {
          showError("Payment service is not available. Please refresh the page.");
          setIsProcessing(false);
          return;
        }

        // Get Paystack public key from environment or use a fallback
        const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
        if (!paystackKey) {
          console.error("Paystack public key is not configured. Please add VITE_PAYSTACK_PUBLIC_KEY to your .env file");
          showError("Payment configuration error. Please contact support.");
          setIsProcessing(false);
          return;
        }

        // Initialize payment to get reference
        let initResponse;
        try {
          initResponse = await paymentAPI.initialize(
            parseFloat(formData.amount),
            formData.currency,
            formData.paymentMethod,
            formData.bankName,
            formData.accountNumber,
            formData.accountName
          );
        } catch (initError: any) {
          const errorMsg = initError?.response?.data?.error || "Failed to initialize payment";
          console.error("Payment initialization error:", initError);
          showError(errorMsg);
          setIsProcessing(false);
          return;
        }

        if (!initResponse || !initResponse.reference) {
          showError(initResponse?.error || "Failed to initialize payment. Please try again.");
          setIsProcessing(false);
          return;
        }

        // Use Paystack inline payment
        try {
          // Define callback function separately to ensure it's a proper function
          const paymentCallback = function(response: any) {
            // Verify payment
            (async () => {
              try {
                const verifyResponse = await paymentAPI.verify(response.reference);
                if (verifyResponse.payment?.status === "completed") {
                  showSuccess("Payment completed successfully!");
                  setTimeout(() => {
                    onSuccess();
                    onClose();
                  }, 1500);
                } else {
                  showError("Payment verification failed");
                  setIsProcessing(false);
                }
              } catch (error) {
                console.error("Payment verification error:", error);
                showError("Failed to verify payment");
                setIsProcessing(false);
              }
            })();
          };

          // Define onClose callback separately
          const paymentOnClose = function() {
            setIsProcessing(false);
            showError("Payment window closed");
          };

          const handler = window.PaystackPop.setup({
            key: paystackKey,
            email: userEmail,
            amount: parseFloat(formData.amount) * 100, // Convert to kobo
            ref: initResponse.reference,
            metadata: {
              custom_fields: [
                {
                  display_name: "Cardholder Name",
                  variable_name: "cardholder_name",
                  value: formData.cardName,
                },
              ],
            },
            callback: paymentCallback,
            onClose: paymentOnClose,
          });

          handler.openIframe();
        } catch (paystackError) {
          console.error("Paystack setup error:", paystackError);
          showError("Failed to open payment window. Please try again.");
          setIsProcessing(false);
        }
      } else {
        // For other payment methods, use initialize (redirect)
        const response = await paymentAPI.initialize(
          parseFloat(formData.amount),
          formData.currency,
          formData.paymentMethod,
          formData.bankName,
          formData.accountNumber,
          formData.accountName
        );

        if (response.authorization_url) {
          window.location.href = response.authorization_url;
        } else {
          showError("Failed to initialize payment");
          setIsProcessing(false);
        }
      }
    } catch (err: unknown) {
      console.error("Payment error:", err);
      let errorMessage = "Payment initialization failed. Please try again.";
      
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { error?: string; message?: string } } };
        errorMessage = axiosError.response?.data?.error || 
                      axiosError.response?.data?.message || 
                      errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      showError(errorMessage);
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="payment-modal">
        <div className="payment-header">
          <h2>Payment</h2>
          <button onClick={onClose} className="close-button" type="button">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          {!requiresPin && !requiresOtp && (
            <>
              <div className="payment-form-group">
                <label htmlFor="amount">Amount (NGN)</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  step="1"
                  min="1"
                  required
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="10000"
                  disabled={isProcessing}
                />
              </div>

              <div className="payment-form-group">
                <label htmlFor="paymentMethod">Payment Method</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  disabled={isProcessing}
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              {formData.paymentMethod === "card" && (
                <>
                  <div className="payment-form-group">
                    <label htmlFor="cardName">Cardholder Name</label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      required
                      value={formData.cardName}
                      onChange={handleChange}
                      placeholder="Enter cardholder name as it appears on the card"
                      autoComplete="cc-name"
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="payment-form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      required
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      autoComplete="cc-number"
                      inputMode="numeric"
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="payment-grid">
                    <div className="payment-form-group">
                      <label htmlFor="expiryDate">Expiry Date</label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        required
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        autoComplete="cc-exp"
                        inputMode="numeric"
                        disabled={isProcessing}
                      />
                    </div>

                    <div className="payment-form-group">
                      <label htmlFor="cvv">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        required
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        maxLength={4}
                        autoComplete="cc-csc"
                        inputMode="numeric"
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="payment-form-section">
                <h3>Account Details</h3>
                <p className="helper-text">
                  Provide your bank account details for prize payments
                </p>
                
                <div className="payment-form-group">
                  <label htmlFor="bankName">Bank Name</label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="Enter your bank name"
                    disabled={isProcessing}
                  />
                </div>

                <div className="payment-form-group">
                  <label htmlFor="accountNumber">Account Number</label>
                  <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="Enter your account number"
                    inputMode="numeric"
                    disabled={isProcessing}
                  />
                </div>

                <div className="payment-form-group">
                  <label htmlFor="accountName">Account Name</label>
                  <input
                    type="text"
                    id="accountName"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    placeholder="Enter account holder name"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </>
          )}

          {requiresPin && (
            <div className="payment-form-group">
              <label htmlFor="pin">Card PIN</label>
              <input
                type="password"
                id="pin"
                name="pin"
                required
                value={pin}
                onChange={handlePinChange}
                placeholder="Enter your 4-digit card PIN"
                maxLength={4}
                inputMode="numeric"
                autoComplete="off"
                disabled={isProcessing}
              />
              <p className="helper-text" style={{ marginTop: "0.5rem" }}>
                Enter the PIN associated with your card
              </p>
            </div>
          )}

          {requiresOtp && (
            <div className="payment-form-group">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                required
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                inputMode="numeric"
                autoComplete="off"
                disabled={isProcessing}
              />
              <p className="helper-text" style={{ marginTop: "0.5rem" }}>
                Enter the OTP sent to your phone or email
              </p>
            </div>
          )}

          <div className="button-group">
            <button
              type="button"
              onClick={onClose}
              className="button-cancel"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="button-submit"
            >
              {isProcessing
                ? "Processing..."
                : requiresPin
                ? "Submit PIN"
                : requiresOtp
                ? "Submit OTP"
                : "Pay Now"}
            </button>
          </div>
        </form>

        <p className="payment-footer">
          Secure payment powered by Paystack. Your card details are encrypted and secure.
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;
