# Identity Verification System

A modern React application that integrates the [Innovatrics Identity Verification Toolkit](https://developers.innovatrics.com/digital-onboarding/) for secure online identity verification and digital onboarding.

## Features

- **Document Verification**: Automated document capture and verification using Innovatrics DOT Web Document Auto Capture component and OCR technology
- **Facial Recognition**: Advanced face detection and matching capabilities
- **Liveness Detection**: Passive liveness detection to prevent spoofing attacks
- **Modern UI**: Beautiful, responsive design with excellent user experience
- **Multi-step Process**: Guided verification flow with progress tracking
- **Demo Mode**: Test the application without real API credentials

## Technology Stack

- **Frontend**: React 19 with Vite
- **UI Components**: Custom CSS with modern design
- **Camera Integration**: @innovatrics/dot-document-auto-capture for document scanning, react-webcam for face/liveness capture
- **API Communication**: Axios for HTTP requests
- **Identity Verification**: Innovatrics Identity Verification Toolkit

## Prerequisites

Before running this application, you need:

1. **Innovatrics Account**: Access to the [Innovatrics Customer Portal](https://developers.innovatrics.com/digital-onboarding/)
2. **API Credentials**: API key, project ID, and base URL from Innovatrics
3. **Node.js**: Version 16 or higher
4. **Modern Browser**: Chrome, Firefox, Safari, or Edge with camera access

## Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd rvl
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables** (optional for demo mode):
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your Innovatrics credentials:
   ```env
   VITE_INNOVATRICS_API_KEY=your-actual-api-key
   VITE_INNOVATRICS_BASE_URL=https://api.innovatrics.com
   VITE_INNOVATRICS_PROJECT_ID=your-actual-project-id
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

## Demo Mode

The application includes a **Demo Mode** that allows you to test the full user interface and workflow without real Innovatrics API credentials. 

### How Demo Mode Works

- **Automatic Detection**: Demo mode is automatically activated when no valid API credentials are provided (i.e., `VITE_INNOVATRICS_API_KEY` is empty or set to `your-api-key-here` in `.env`)
- **Simulated API Calls**: All API calls are simulated with realistic response times (2 seconds)
- **Realistic Responses**: Mock responses include success/failure scenarios and confidence scores
- **Visual Indicators**: Demo mode is clearly indicated with orange notification banners

### Testing Without Credentials

You can run the application immediately without setting up environment variables:

```bash
npm install
npm run dev
```

The application will automatically run in demo mode, allowing you to:
- Test the camera capture functionality
- Experience the complete verification flow
- See how the UI responds to different scenarios
- Understand the user experience

### Switching to Production Mode

To use real Innovatrics APIs:

1. Obtain credentials from Innovatrics
2. Create a `.env` file with your credentials (ensure `VITE_INNOVATRICS_API_KEY` is set to your actual key)
3. Restart the development server

The application will automatically switch to production mode when valid credentials are detected.

## Getting Innovatrics Credentials

1. **Contact Innovatrics**: Reach out to their sales team at info@innovatrics.com or +421 2 2071 4056
2. **Access Customer Portal**: Once approved, you'll get access to their customer portal
3. **Download Components**: Download the web components from the portal
4. **Get API Credentials**: Obtain your API key, project ID, and base URL

## Usage

### 1. Landing Page
The application starts with a beautiful landing page that explains the verification process and features.

### 2. Document Verification (using Innovatrics DOT Web Document Auto Capture)
- Users can capture documents using their device camera via the integrated Innovatrics component
- Alternatively, they can upload document images
- The system processes the document using Innovatrics OCR technology (simulated in demo mode)

### 3. Face Verification
- Users take a selfie photo using their device camera
- The system performs facial recognition and matching

### 4. Liveness Detection
- Users complete liveness verification to prevent fraud
- The system uses passive liveness detection technology

### 5. Results
- Users receive instant verification results
- All steps are clearly displayed with success/failure indicators

## API Integration

The application integrates with three main Innovatrics APIs:

### Document Auto Capture
```javascript
// Endpoint: /document/process
// Purpose: Process identity documents using OCR
```

### Face Auto Capture
```javascript
// Endpoint: /face/process
// Purpose: Process facial images for recognition
```

### MagnifEye Liveness
```javascript
// Endpoint: /liveness/process
// Purpose: Perform liveness detection
```

## Project Structure

```
src/
├── components/
│   ├── IdentityVerification.jsx    # Main verification component
│   ├── IdentityVerification.css    # Component styles
│   ├── ErrorBoundary.jsx           # Error handling component
│   └── ErrorBoundary.css           # Error boundary styles
├── App.jsx                         # Main application component
├── App.css                         # Application styles
└── main.jsx                        # Application entry point
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_INNOVATRICS_API_KEY` | Your Innovatrics API key | No (demo mode available) |
| `VITE_INNOVATRICS_BASE_URL` | Innovatrics API base URL | No (demo mode available) |
| `VITE_INNOVATRICS_PROJECT_ID` | Your Innovatrics project ID | No (demo mode available) |
| `VITE_ENVIRONMENT` | Environment (dev/staging/prod) | No |

### API Configuration

The application is configured to work with Innovatrics' web components:

- **Web Document Auto Capture**: For document scanning
- **Web Face Auto Capture**: For selfie capture
- **Web MagnifEye Liveness**: For liveness detection

## Security Considerations

1. **API Key Security**: Never commit your API keys to version control
2. **HTTPS**: Always use HTTPS in production for secure data transmission
3. **Data Privacy**: Ensure compliance with local data protection regulations
4. **Camera Permissions**: Handle camera access permissions gracefully

## Troubleshooting

### Common Issues

1. **Camera Not Working**:
   - Ensure HTTPS is enabled (required for camera access)
   - Check browser permissions for camera access
   - Try refreshing the page

2. **API Errors**:
   - Verify your API credentials in `.env`
   - Check your Innovatrics account status
   - Ensure you have the correct project ID

3. **Build Errors**:
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

### Browser Compatibility

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Verification Steps**: Add to the `currentStep` state in `IdentityVerification.jsx`
2. **Custom Styling**: Modify the CSS files for design changes
3. **API Integration**: Add new API calls following the existing pattern

## Support

- **Innovatrics Documentation**: [https://developers.innovatrics.com/digital-onboarding/](https://developers.innovatrics.com/digital-onboarding/)
- **Innovatrics Contact**: info@innovatrics.com
- **Innovatrics Phone**: +421 2 2071 4056

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

Built with ❤️ using React and powered by [Innovatrics Identity Verification Toolkit](https://developers.innovatrics.com/digital-onboarding/)
