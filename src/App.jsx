import { useState } from 'react'
import './App.css'
import IdentityVerification from './components/IdentityVerification'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [showVerification, setShowVerification] = useState(false)

  return (
    <div className="app">
      {!showVerification ? (
        <div className="landing-page">
          <div className="hero-section">
            <div className="hero-content">
              <h1>Identity Verification System</h1>
              <p className="hero-subtitle">
                Powered by Innovatrics Identity Verification Toolkit
              </p>
              {/* <p className="hero-description">
                Secure, fast, and reliable identity verification using advanced biometric technology. 
                Our system combines document verification, facial recognition, and liveness detection 
                to ensure the highest level of security and user experience.
              </p>
              
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">📄</div>
                  <h3>Document Verification</h3>
                  <p>Automated document capture and verification using OCR technology</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">👤</div>
                  <h3>Facial Recognition</h3>
                  <p>Advanced face detection and matching capabilities</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🔒</div>
                  <h3>Liveness Detection</h3>
                  <p>Prevent spoofing attacks with passive liveness detection</p>
                </div>
              </div> */}
              
              <button 
                className="start-verification-btn"
                onClick={() => setShowVerification(true)}
              >
                Start Identity Verification
              </button>
            </div>
          </div>
          
          <div className="info-section">
            <h2>How It Works</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h4>Document Capture</h4>
                <p>Capture or upload a clear image of your identity document</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h4>Face Verification</h4>
                <p>Take a selfie photo for facial recognition</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h4>Liveness Check</h4>
                <p>Complete liveness detection to prevent fraud</p>
              </div>
              <div className="step-card">
                <div className="step-number">4</div>
                <h4>Verification Complete</h4>
                <p>Receive instant verification results</p>
              </div>
            </div>
          </div>
          
          <footer className="app-footer">
            <p>
              Built with React and powered by{' '}
              <a 
                href="https://developers.innovatrics.com/digital-onboarding/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="innovatrics-link"
              >
                Innovatrics Identity Verification Toolkit
              </a>
            </p>
          </footer>
        </div>
      ) : (
        <div className="verification-container">
          <button 
            className="back-btn"
            onClick={() => setShowVerification(false)}
          >
            ← Back to Home
          </button>
          <ErrorBoundary>
            <IdentityVerification />
          </ErrorBoundary>
        </div>
      )}
    </div>
  )
}

export default App
