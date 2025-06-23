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
  const [customerId, setCustomerId] = useState(null);
  
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Backend API Configuration
  const API_CONFIG = {
    baseUrl: 'https://dis.reliefvalidation.com.bd/api/v1',
    apiKey: 'aW5rX2M3Njg1ZjNmNDBmYzVmMjQyMWNiZGExMmYyNmQ3MGMzOmluc19leUp0WlhSaFpHRjBZU0k2SUhzaVkyeHBaVzUwSWpvZ2V5SnBaQ0k2SUNJd1pESTNNalE0WVMweE56RXhMVFExWXpNdFltUmpaUzFqWldOaFlUZzRaV05qWTJNaUxDQWlibUZ0WlNJNklDSlNaV3hwWldZZ1ZtRnNhV1JoZEdsdmJpQk1hVzFwZEdWa0lDZ2dVbFpNS1NKOUxDQWliR2xqWlc1elpWOWpkWE4wYjIxZmNISnZjR1Z5ZEdsbGN5STZJSHNpTDJOdmJuUnlZV04wTDJSdmRDOWthWE12Wlc1aFlteGxaQ0k2SUNKMGNuVmxJaXdnSWk5amIyNTBjbUZqZEM5a2IzUXZaR2x6TDJabFlYUjFjbVZ6TDNKbFlXeFVhVzFsVkhKaGJuTmhZM1JwYjI1U1pYQnZjblJwYm1kU1pYRjFhWEpsWkNJNklDSjBjblZsSWl3Z0lpOWpiMjUwY21GamRDOWtiM1F2Y21WaGJGUnBiV1ZVY21GdWMyRmpkR2x2YmxKbGNHOXlkR2x1WjFKbGNYVnBjbVZrSWpvZ0luUnlkV1VpTENBaUwyTnZiblJ5WVdOMEwyUnZkQzlrYVhNdmJHbGpaVzV6WlZabGNuTnBiMjRpT2lBaU15SjlMQ0FpWTNKbFlYUnBiMjVmZEdsdFpYTjBZVzF3SWpvZ0lqRXhMekEwTHpJd01qUWdNVGc2TlRjNk1UZ2dWVlJESWl3Z0luWmhiR2xrWDNSdklqb2dJakV5THpBMEx6SXdNalVnTURBNk1EQTZNREFnVlZSREluMHNJQ0p6YVdkdVlYUjFjbVVpT2lBaWJHRkdRVGR6U2t4MFlrWTBWbEZPT1RZeVRXcHFWamd4YUVJM1Z5OVBSRTVYZEVKUWFtZ3lLMDVsUTNReE9FZDVWa1pzVTJaREsyZzNkVkJMVjJsRVVYSnFUbEZYSzNNeE5ubzJMM1ZqWkd0dmEwWktRbWM5UFNKOQ=='
  };

  // Create customer session
  const createCustomer = async () => {
    try {
      const response = await axios.post(`${API_CONFIG.baseUrl}/customers`, {}, {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      setCustomerId(response.data.id);
      return response.data.id;
    } catch (err) {
      console.error('Failed to create customer:', err);
      throw err;
    }
  };

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

  const processDocument = async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Create customer if not exists
      let currentCustomerId = customerId;
      if (!currentCustomerId) {
        currentCustomerId = await createCustomer();
      }

      // Step 1: Create document (PUT /document)
      await axios.put(
        `${API_CONFIG.baseUrl}/customers/${currentCustomerId}/document`,
        {
          advice: {
            classification: {
              country: 'BGD',
              type: 'national-id-card'
            }
          },
          sources: ['VIZ', 'MRZ']
        },
        {
          headers: {
            'Authorization': `Bearer ${API_CONFIG.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Step 2: Upload document page (PUT /document/pages)
      // Convert base64 image (remove data:image/jpeg;base64, prefix)
      const base64Image = capturedImage.split(',')[1];
      const pageType = 'front'; // or 'back' if needed
      const uploadPayload = {
        image: { data: base64Image },
        advice: {
          classification: {
            pageTypes: [pageType]
          }
        }
      };
      const result = await axios.put(
        `${API_CONFIG.baseUrl}/customers/${currentCustomerId}/document/pages`,
        uploadPayload,
        {
          headers: {
            'Authorization': `Bearer ${API_CONFIG.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setVerificationResult({
        type: 'document',
        data: result.data,
        success: true
      });
      
      setCurrentStep('face');
    } catch (err) {
      console.error('Document processing failed:', err);
      setError('Document processing failed: ' + (err.response?.data?.error || err.message));
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
      // Convert base64 image (remove data:image/jpeg;base64, prefix)
      const base64Image = capturedImage.split(',')[1];
      // Send to backend: POST /faces
      const result = await axios.post(
        `${API_CONFIG.baseUrl}/faces`,
        {
          image: { data: base64Image }
        },
        {
          headers: {
            'Authorization': `Bearer ${API_CONFIG.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setVerificationResult(prev => ({
        ...prev,
        face: {
          data: result.data,
          success: true
        }
      }));
      
      setCurrentStep('liveness');
    } catch (err) {
      console.error('Face processing failed:', err);
      setError('Face processing failed: ' + (err.response?.data?.error || err.message));
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
      // Convert base64 image (remove data:image/jpeg;base64, prefix)
      const base64Image = capturedImage.split(',')[1];
      // Send to backend: PUT /customers/{customerId}/liveness
      const result = await axios.put(
        `${API_CONFIG.baseUrl}/customers/${customerId}/liveness`,
        {
          image: { data: base64Image }
        },
        {
          headers: {
            'Authorization': `Bearer ${API_CONFIG.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setVerificationResult(prev => ({
        ...prev,
        liveness: {
          data: result.data,
          success: true
        }
      }));
      
      setCurrentStep('complete');
    } catch (err) {
      console.error('Liveness detection failed:', err);
      setError('Liveness detection failed: ' + (err.response?.data?.error || err.message));
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
    setCustomerId(null);
  };

  const renderDocumentCapture = () => (
    <div className="capture-section">
      <h3>Document Capture</h3>
      <p>Please capture or upload a clear image of your identity document</p>
      
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

  const renderResults = () => {
    if (verificationResult) {
      console.log('Full verificationResult:', verificationResult);
    }
    return (
      <div className="results-section">
        <h3>Verification Results</h3>
        {verificationResult && (
          <div className="results-grid">
            {/* Document */}
            <div className={`result-card ${verificationResult.success ? 'success' : 'error'}`}>
              <h4>Document Verification</h4>
              {verificationResult.success ? (
                <div>
                  <p>✅ Document verified successfully</p>
                  <ul>
                    <li>Type: {verificationResult.data?.documentType?.type}</li>
                    <li>Country: {verificationResult.data?.documentType?.country}</li>
                    <li>Edition: {verificationResult.data?.documentType?.edition}</li>
                    <li>Support Level: {verificationResult.data?.documentType?.supportLevel}</li>
                    <li>Detection Confidence: {verificationResult.data?.detection?.confidence ? (verificationResult.data.detection.confidence * 100).toFixed(2) + '%' : 'N/A'}</li>
                    <li>Corner Out of Image: {verificationResult.data?.detection?.cornerOutOfImage ? 'Yes' : 'No'}</li>
                  </ul>
                  <details>
                    <summary>Show Corner Coordinates</summary>
                    <pre>{JSON.stringify(verificationResult.data?.detection?.coordinates, null, 2)}</pre>
                  </details>
                </div>
              ) : (
                <p>❌ Document verification failed</p>
              )}
            </div>
            {/* Face */}
            <div className={`result-card ${verificationResult.face?.success ? 'success' : 'error'}`}>
              <h4>Face Verification</h4>
              {verificationResult.face?.success ? (
                <div>
                  <p>✅ Face verified successfully</p>
                  <ul>
                    <li>Face ID: {verificationResult.face.data?.id}</li>
                    <li>Detection Confidence: {verificationResult.face.data?.detection?.confidence ? (verificationResult.face.data.detection.confidence * 100).toFixed(2) + '%' : 'N/A'}</li>
                  </ul>
                  <details>
                    <summary>Show Face Rectangle</summary>
                    <pre>{JSON.stringify(verificationResult.face.data?.detection?.faceRectangle, null, 2)}</pre>
                  </details>
                </div>
              ) : (
                <p>❌ Face verification failed</p>
              )}
            </div>
            {/* Liveness */}
            <div className={`result-card ${verificationResult.liveness?.success ? 'success' : 'error'}`}>
              <h4>Liveness Detection</h4>
              {verificationResult.liveness?.success ? (
                <div>
                  <p>✅ Liveness verified successfully</p>
                  <ul>
                    <li>Link: {verificationResult.liveness.data?.links?.self}</li>
                  </ul>
                </div>
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
  };

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