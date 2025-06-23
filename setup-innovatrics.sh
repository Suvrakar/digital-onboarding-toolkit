#!/bin/bash

echo "🚀 Innovatrics Digital Identity Service Setup"
echo "=============================================="
echo ""

# Check if required files exist
echo "📋 Checking for required Innovatrics files..."

# Check for JAR file
if [ -f "innovatrics-backend/app.jar" ]; then
    echo "✅ app.jar found"
else
    echo "❌ app.jar not found - please copy dot-digital-identity-service.jar to innovatrics-backend/app.jar"
fi

# Check for libraries
if [ -f "innovatrics-backend/libs/libdot-sam.so" ]; then
    echo "✅ libdot-sam.so found"
else
    echo "❌ libdot-sam.so not found"
fi

if [ -f "innovatrics-backend/libs/libiface.so" ]; then
    echo "✅ libiface.so found"
else
    echo "❌ libiface.so not found"
fi

if [ -f "innovatrics-backend/libs/libinnoonnxruntime.so" ]; then
    echo "✅ libinnoonnxruntime.so found"
else
    echo "❌ libinnoonnxruntime.so not found"
fi

# Check for solvers directory
if [ -d "innovatrics-backend/libs/solvers" ] && [ "$(ls -A innovatrics-backend/libs/solvers)" ]; then
    echo "✅ solvers directory found with files"
else
    echo "❌ solvers directory not found or empty"
fi

# Check for license
if [ -f "innovatrics-backend/config/license.lic" ]; then
    echo "✅ license.lic found"
else
    echo "❌ license.lic not found - please copy your Innovatrics license to innovatrics-backend/config/license.lic"
fi

echo ""
echo "📖 Setup Instructions:"
echo "======================"
echo ""
echo "1. Copy dot-digital-identity-service.jar to innovatrics-backend/app.jar"
echo "2. Copy all .so files to innovatrics-backend/libs/"
echo "3. Copy solvers/ directory to innovatrics-backend/libs/solvers/"
echo "4. Copy your license.lic to innovatrics-backend/config/license.lic"
echo "5. Update API keys in innovatrics-backend/config/application.yml"
echo ""
echo "6. Build and run:"
echo "   docker-compose build"
echo "   docker-compose up -d"
echo ""
echo "7. Test the service:"
echo "   curl http://localhost:8082/api/v1/health"
echo ""

# Check if all files are present
if [ -f "innovatrics-backend/app.jar" ] && \
   [ -f "innovatrics-backend/libs/libdot-sam.so" ] && \
   [ -f "innovatrics-backend/libs/libiface.so" ] && \
   [ -f "innovatrics-backend/libs/libinnoonnxruntime.so" ] && \
   [ -d "innovatrics-backend/libs/solvers" ] && \
   [ -f "innovatrics-backend/config/license.lic" ]; then
    echo "🎉 All files are present! Ready to build and run."
    echo ""
    echo "Run these commands:"
    echo "docker-compose build"
    echo "docker-compose up -d"
else
    echo "⚠️  Some files are missing. Please obtain the Innovatrics distribution package first."
fi 