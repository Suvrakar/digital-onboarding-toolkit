#!/bin/bash

echo "🚀 Official Innovatrics Digital Identity Service Setup"
echo "====================================================="
echo ""

# Check if Docker is logged into Innovatrics registry
echo "📋 Checking Docker registry access..."

# Try to pull a small test image to check access
if docker pull registry.dot.innovatrics.com/dot/dis:1.44.0 > /dev/null 2>&1; then
    echo "✅ Successfully connected to Innovatrics registry"
    echo "✅ Docker image is accessible"
else
    echo "❌ Cannot access Innovatrics registry"
    echo ""
    echo "🔑 You need to login to the Innovatrics registry first:"
    echo "   docker login registry.dot.innovatrics.com"
    echo ""
    echo "📞 Contact your Innovatrics sales representative for:"
    echo "   - Registry username and password"
    echo "   - Access to the container registry"
    exit 1
fi

# Check for required directories
echo ""
echo "📁 Checking required directories..."

if [ -d "license" ]; then
    echo "✅ license directory exists"
else
    echo "❌ license directory missing - creating..."
    mkdir -p license
fi

if [ -d "logs" ]; then
    echo "✅ logs directory exists"
else
    echo "❌ logs directory missing - creating..."
    mkdir -p logs
fi

if [ -d "innovatrics-backend/config" ]; then
    echo "✅ config directory exists"
else
    echo "❌ config directory missing - creating..."
    mkdir -p innovatrics-backend/config
fi

# Check for license file
echo ""
echo "📄 Checking license file..."
if [ -f "license/license.lic" ]; then
    echo "✅ license.lic found"
else
    echo "❌ license.lic not found"
    echo "   Please copy your Innovatrics license to license/license.lic"
fi

# Check for configuration
echo ""
echo "⚙️  Checking configuration..."
if [ -f "innovatrics-backend/config/application.yml" ]; then
    echo "✅ application.yml found"
else
    echo "❌ application.yml not found - creating default..."
    cat > innovatrics-backend/config/application.yml << 'EOF'
server:
  port: 8080
  servlet:
    context-path: /api/v1

spring:
  application:
    name: dot-digital-identity-service

# Innovatrics Digital Identity Service Configuration
innovatrics:
  dot:
    # License configuration
    license:
      path: /srv/dot-digital-identity-service/license/license.lic
      
    # Authentication configuration
    auth:
      api-key:
        enabled: true
        keys:
          - "your-api-key-here"
      
    # Document processing configuration
    document:
      supported-types:
        - "ID_CARD"
        - "PASSPORT"
        - "DRIVERS_LICENSE"
      
    # Face processing configuration
    face:
      detection:
        min-face-size: 80
        max-face-size: 400
        
    # Liveness detection configuration
    liveness:
      magnifeye:
        enabled: true
        threshold: 0.5
        
    # Caching configuration
    cache:
      type: "ehcache"
      ehcache:
        max-elements: 1000
        time-to-live: 3600
        
    # Logging configuration
    logging:
      level: "INFO"
      transaction-logging:
        enabled: true
        retention-days: 30

# Health check configuration
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: when-authorized
EOF
fi

echo ""
echo "🚀 Ready to run Innovatrics Digital Identity Service!"
echo "=================================================="
echo ""
echo "📋 Next steps:"
echo "1. Ensure license/license.lic contains your Innovatrics license"
echo "2. Update API keys in innovatrics-backend/config/application.yml"
echo "3. Run: docker-compose up -d"
echo "4. Test: curl http://localhost:8082/api/v1/health"
echo ""
echo "🔗 Service will be available at: http://localhost:8082/api/v1"
echo "" 