import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentAPI } from '../services/api';
import { useToast } from '../components/ToastContainer';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');

      if (!reference) {
        showError('Payment reference not found');
        navigate('/dashboard');
        return;
      }

      try {
        const response = await paymentAPI.verify(reference);
        
        if (response.payment?.status === 'completed') {
          showSuccess('Payment successful! You can now upload your video.');
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          showError('Payment verification failed');
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        showError('Failed to verify payment');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, showSuccess, showError]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      {isVerifying ? (
        <>
          <h2>Verifying payment...</h2>
          <p>Please wait while we verify your payment.</p>
        </>
      ) : (
        <>
          <h2>Payment verification complete</h2>
          <p>Redirecting to dashboard...</p>
        </>
      )}
    </div>
  );
};

export default PaymentCallback;
