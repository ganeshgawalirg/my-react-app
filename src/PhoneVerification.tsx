import React, { useState } from 'react';

interface PhoneVerificationProps {
  onVerified: () => void;
  darkMode: boolean;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ onVerified, darkMode }) => {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSendOtp = () => {
    // Basic phone number validation
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setError('');
    console.log(`Sending mock OTP to ${phoneNumber}`);
    setStep('otp');
  };

  const handleVerifyOtp = () => {
    // Mock OTP verification
    if (otp === '123456') {
      setError('');
      console.log('OTP verified successfully!');
      onVerified();
    } else {
      setError('Invalid OTP. Please use 123456 for this demo.');
    }
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: darkMode ? '#1a1a1a' : '#f0f2f5',
    color: darkMode ? '#fff' : '#000',
    fontFamily: 'sans-serif',
  };

  const cardStyles: React.CSSProperties = {
    padding: '40px',
    borderRadius: '16px',
    background: darkMode ? '#2d2d2d' : '#fff',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    margin: '12px 0',
    borderRadius: '8px',
    border: darkMode ? '1px solid #555' : '1px solid #ddd',
    fontSize: '1rem',
    background: darkMode ? '#3d3d3d' : '#fff',
    color: darkMode ? '#fff' : '#000',
  };
  
  const buttonStyles: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px'
  };

  return (
    <div style={containerStyles}>
      <div style={cardStyles}>
        {step === 'phone' ? (
          <>
            <h1 style={{ marginBottom: '10px', fontSize: '1.8rem' }}>Verify Your Number</h1>
            <p style={{ marginBottom: '20px', color: darkMode ? '#ccc' : '#666' }}>
              We'll send a verification code to your phone.
            </p>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter 10-digit phone number"
              style={inputStyles}
            />
            <button onClick={handleSendOtp} style={buttonStyles}>Send OTP</button>
          </>
        ) : (
          <>
            <h1 style={{ marginBottom: '10px', fontSize: '1.8rem' }}>Enter OTP</h1>
            <p style={{ marginBottom: '20px', color: darkMode ? '#ccc' : '#666' }}>
              Enter the 6-digit code we sent to your number.
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              style={inputStyles}
            />
            <button onClick={handleVerifyOtp} style={buttonStyles}>Verify</button>
          </>
        )}
        {error && <p style={{ color: '#ef4444', marginTop: '15px' }}>{error}</p>}
      </div>
    </div>
  );
};

export default PhoneVerification; 