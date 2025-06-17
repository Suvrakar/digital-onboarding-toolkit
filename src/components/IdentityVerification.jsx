import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import './IdentityVerification.css';
// import '@innovatrics/dot-document-auto-capture'; // Removed Innovatrics UI component and events

const IdentityVerification = () => {
  const [currentStep, setCurrentStep] = useState('document'); // document, face, liveness
  const [capturedImage, setCapturedImage] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Configuration for Innovatrics API (using Vite's import.meta.env)
  const INNOVATRICS_CONFIG = {
    apiKey: import.meta.env.VITE_INNOVATRICS_API_KEY || 'your-api-key-here',
    baseUrl: import.meta.env.VITE_INNOVATRICS_BASE_URL || 'https://api.innovatrics.com',
    projectId: import.meta.env.VITE_INNOVATRICS_PROJECT_ID || 'your-project-id'
  };

  // Check if we're in demo mode (no real API credentials)
  const isDemoMode = true; // FORCED DEMO MODE FOR TESTING PURPOSES

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      return imageSrc;
    }
    return null;
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock API response for demo mode
  const mockApiResponse = (type) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            message: `${type} verification completed successfully (Demo Mode)`,
            confidence: Math.random() * 0.3 + 0.7, // Random confidence between 0.7-1.0
            timestamp: new Date().toISOString()
          }
        });
      }, 2000); // Simulate 2 second processing time
    });
  };

  const processDocument = async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      let result;
      
      if (isDemoMode) {
        result = await mockApiResponse('Document');
        setVerificationResult({
          type: 'document',
          data: result.data,
          success: true
        });
      } else {
        const response = await fetch(capturedImage);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append('document', blob, 'document.jpg');
        formData.append('projectId', INNOVATRICS_CONFIG.projectId);
        
        result = await axios.post(
          `${INNOVATRICS_CONFIG.baseUrl}/document/process`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${INNOVATRICS_CONFIG.apiKey}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        setVerificationResult({
          type: 'document',
          data: result.data,
          success: result.data.success
        });
      }
      
      setCurrentStep('face');
    } catch (err) {
      setError('Document processing failed: ' + err.message);
      setVerificationResult({
        type: 'document',
        success: false,
        error: err.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processFace = async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      let result;
      
      if (isDemoMode) {
        result = await mockApiResponse('Face');
      } else {
        const response = await fetch(capturedImage);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append('face', blob, 'face.jpg');
        formData.append('projectId', INNOVATRICS_CONFIG.projectId);
        
        result = await axios.post(
          `${INNOVATRICS_CONFIG.baseUrl}/face/process`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${INNOVATRICS_CONFIG.apiKey}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }
      
      setVerificationResult(prev => ({
        ...prev,
        face: {
          data: result.data,
          success: true
        }
      }));
      
      setCurrentStep('liveness');
    } catch (err) {
      setError('Face processing failed: ' + err.message);
      setVerificationResult(prev => ({
        ...prev,
        face: {
          success: false,
          error: err.message
        }
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const processLiveness = async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      let result;
      
      if (isDemoMode) {
        result = await mockApiResponse('Liveness');
      } else {
        const response = await fetch(capturedImage);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append('liveness', blob, 'liveness.jpg');
        formData.append('projectId', INNOVATRICS_CONFIG.projectId);
        
        result = await axios.post(
          `${INNOVATRICS_CONFIG.baseUrl}/liveness/process`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${INNOVATRICS_CONFIG.apiKey}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }
      
      setVerificationResult(prev => ({
        ...prev,
        liveness: {
          data: result.data,
          success: true
        }
      }));
      
      setCurrentStep('complete');
    } catch (err) {
      setError('Liveness detection failed: ' + err.message);
      setVerificationResult(prev => ({
        ...prev,
        liveness: {
          success: false,
          error: err.message
        }
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const resetVerification = () => {
    setCurrentStep('document');
    setCapturedImage(null);
    setVerificationResult(null);
    setError(null);
  };

  const renderDocumentCapture = () => (
    <div className="capture-section">
      <h3>Document Capture</h3>
      <p>Please capture or upload a clear image of your identity document</p>
      
      {isDemoMode && (
        <div className="demo-notice">
          <p>🔧 <strong>Demo Mode:</strong> This is a demonstration. API calls are simulated.</p>
        </div>
      )}
      
      <div className="capture-options">
        <div className="webcam-section">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={400}
            height={300}
            className="webcam"
          />
          <button 
            onClick={captureImage}
            className="capture-btn"
            disabled={isProcessing}
            style={{ marginTop: '1rem' }}
          >
            Capture Document
          </button>
        </div>
        
        <div className="upload-section">
          <p>Or upload from device:</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="file-input"
          />
        </div>
      </div>
      
      {capturedImage && (
        <div className="preview-section">
          <h4>Captured Image:</h4>
          <img src={capturedImage} alt="Captured document" className="preview-image" />
          <button 
            onClick={processDocument}
            className="process-btn"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Process Document'}
          </button>
        </div>
      )}
    </div>
  );

  const renderFaceCapture = () => (
    <div className="capture-section">
      <h3>Face Capture</h3>
      <p>Please take a clear selfie photo</p>
      
      {isDemoMode && (
        <div className="demo-notice">
          <p>🔧 <strong>Demo Mode:</strong> This is a demonstration. API calls are simulated.</p>
        </div>
      )}
      
      <div className="webcam-section">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={400}
          height={300}
          className="webcam"
        />
        <button 
          onClick={captureImage}
          className="capture-btn"
          disabled={isProcessing}
        >
          Capture Face
        </button>
      </div>
      
      {capturedImage && (
        <div className="preview-section">
          <h4>Captured Face:</h4>
          <img src={capturedImage} alt="Captured face" className="preview-image" />
          <button 
            onClick={processFace}
            className="process-btn"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Process Face'}
          </button>
        </div>
      )}
    </div>
  );

  const renderLivenessDetection = () => (
    <div className="capture-section">
      <h3>Liveness Detection</h3>
      <p>Please follow the instructions for liveness verification</p>
      
      {isDemoMode && (
        <div className="demo-notice">
          <p>🔧 <strong>Demo Mode:</strong> This is a demonstration. API calls are simulated.</p>
        </div>
      )}
      
      <div className="liveness-instructions">
        <h4>Instructions:</h4>
        <ul>
          <li>Look directly at the camera</li>
          <li>Blink naturally when prompted</li>
          <li>Keep your face centered in the frame</li>
          <li>Ensure good lighting</li>
        </ul>
      </div>
      
      <div className="webcam-section">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={400}
          height={300}
          className="webcam"
        />
        <button 
          onClick={captureImage}
          className="capture-btn"
          disabled={isProcessing}
        >
          Capture for Liveness
        </button>
      </div>
      
      {capturedImage && (
        <div className="preview-section">
          <h4>Captured Image:</h4>
          <img src={capturedImage} alt="Captured for liveness" className="preview-image" />
          <button 
            onClick={processLiveness}
            className="process-btn"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Verify Liveness'}
          </button>
        </div>
      )}
    </div>
  );

  const renderResults = () => (
    <div className="results-section">
      <h3>Verification Results</h3>
      
      {isDemoMode && (
        <div className="demo-notice">
          <p>🔧 <strong>Demo Mode:</strong> These are simulated results for demonstration purposes.</p>
        </div>
      )}
      
      {verificationResult && (
        <div className="results-grid">
          <div className={`result-card ${verificationResult.document?.success ? 'success' : 'error'}`}>
            <h4>Document Verification</h4>
            {verificationResult.document?.success ? (
              <p>✅ Document verified successfully</p>
            ) : (
              <p>❌ Document verification failed</p>
            )}
          </div>
          
          <div className={`result-card ${verificationResult.face?.success ? 'success' : 'error'}`}>
            <h4>Face Verification</h4>
            {verificationResult.face?.success ? (
              <p>✅ Face verified successfully</p>
            ) : (
              <p>❌ Face verification failed</p>
            )}
          </div>
          
          <div className={`result-card ${verificationResult.liveness?.success ? 'success' : 'error'}`}>
            <h4>Liveness Detection</h4>
            {verificationResult.liveness?.success ? (
              <p>✅ Liveness verified successfully</p>
            ) : (
              <p>❌ Liveness verification failed</p>
            )}
          </div>
        </div>
      )}
      
      <button onClick={resetVerification} className="reset-btn">
        Start New Verification
      </button>
    </div>
  );

  return (
    <div className="identity-verification">
      <div className="verification-header">
        <h2>Identity Verification</h2>
        <div className="progress-bar">
          <div className={`progress-step ${currentStep === 'document' ? 'active' : ''}`}>
            Document
          </div>
          <div className={`progress-step ${currentStep === 'face' ? 'active' : ''}`}>
            Face
          </div>
          <div className={`progress-step ${currentStep === 'liveness' ? 'active' : ''}`}>
            Liveness
          </div>
          <div className={`progress-step ${currentStep === 'complete' ? 'active' : ''}`}>
            Complete
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="verification-content">
        {currentStep === 'document' && renderDocumentCapture()}
        {currentStep === 'face' && renderFaceCapture()}
        {currentStep === 'liveness' && renderLivenessDetection()}
        {currentStep === 'complete' && renderResults()}
      </div>
    </div>
  );
};

export default IdentityVerification; 