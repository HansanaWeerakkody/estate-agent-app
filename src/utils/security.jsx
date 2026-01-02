// CSP IMPLEMENTATION

export const generateCSPHeaders = (options = {}) => {
    const {
      useNonce = false,
      nonce = generateNonce(),
      allowUnsafeInline = process.env.NODE_ENV === 'development'
    } = options;
  
    const directives = {
      // Default source for everything
      'default-src': ["'self'"],
      
      // JavaScript sources
      'script-src': [
        "'self'",
        allowUnsafeInline ? "'unsafe-inline'" : null,
        useNonce ? `'nonce-${nonce}'` : null,
        // Google Maps domains
        "https://maps.google.com",
        "https://maps.googleapis.com",
        "https://*.google.com",
        "https://*.googleapis.com",
        "https://*.gstatic.com",
        ...(options.allowedScripts || [])
      ].filter(Boolean),
      
      // CSS sources
      'style-src': [
        "'self'",
        "'unsafe-inline'", // Required for Google Maps
        // Google Fonts
        "https://fonts.googleapis.com",
        // Google Maps CSS
        "https://*.google.com",
        "https://*.googleapis.com",
        "https://*.gstatic.com"
      ].filter(Boolean),
      
      // Image sources
      'img-src': [
        "'self'", 
        'data:', 
        'blob:', 
        'https:',
        // All Google Maps image domains
        "https://*.google.com",
        "https://*.googleapis.com",
        "https://*.gstatic.com",
        "https://*.ggpht.com",
        "https://streetviewpixels-pa.googleapis.com"
      ],
      
      // Font sources
      'font-src': [
        "'self'", 
        "data:",
        "https://fonts.gstatic.com",
        "https://*.gstatic.com"
      ],
      
      // Connect sources (XHR, WebSockets)
      'connect-src': [
        "'self'",
        // Google Maps API calls
        "https://*.google.com",
        "https://*.googleapis.com",
        "https://*.gstatic.com"
      ],
      
      // Media sources (video, audio)
      'media-src': ["'self'", "https://*.google.com"],
      
      // Block plugins (Flash, Java)
      'object-src': ["'none'"],
      
      // Frame sources - CRITICAL FOR MAPS
      'frame-src': [
        // Google Maps iframe domains
        "https://www.google.com",
        "https://maps.google.com",
        "https://maps.googleapis.com",
        "https://*.google.com",
        "https://*.googleapis.com"
      ],
      
      // Worker sources
      'worker-src': ["'self'", "blob:"],
      
      // Base URL for relative URLs
      'base-uri': ["'self'"],
      
      // Form submission targets
      'form-action': ["'self'"],
      
      // Block framing of site
      'frame-ancestors': ["'none'"],
      
      // Upgrade insecure requests to HTTPS
      'upgrade-insecure-requests': []
    };
  
    // Filter out null entries and convert to CSP string
    return Object.entries(directives)
      .filter(([_, value]) => value !== null)
      .map(([directive, sources]) => {
        if (sources.length === 0) return directive;
        return `${directive} ${sources.join(' ')}`;
      })
      .join('; ');
  };
    
   // Generate CSP meta tag for HTML implementation
   
  export const generateCSPMetaTag = (options = {}) => {
    const csp = generateCSPHeaders(options);
    // Must escape HTML in the meta tag content
    const escapedCSP = escapeHTML(csp);
    return `<meta http-equiv="Content-Security-Policy" content="${escapedCSP}">`;
  };
  
   // Generate a cryptographically secure nonce for CSP

  export const generateNonce = () => {
    const array = new Uint8Array(16);
    
    // Use crypto.getRandomValues for cryptographically secure random
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      // Fallback for Node.js or older browsers
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    
    return Array.from(array, byte => 
      byte.toString(16).padStart(2, '0')
    ).join('');
  };

   // Apply CSP nonce to script and style tags in the DOM
  export const applyCSPNonce = (nonce) => {
    if (typeof document === 'undefined') return;
    
    document.querySelectorAll('script').forEach(script => {
      script.setAttribute('nonce', nonce);
    });
    
    document.querySelectorAll('style').forEach(style => {
      style.setAttribute('nonce', nonce);
    });
    
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      link.setAttribute('nonce', nonce);
    });
  };
  
  // JSX ENCODING IMPLEMENTATION 
  
  export const escapeJSXAttr = (value) => {
    if (value == null) return '';
    if (typeof value !== 'string') return String(value);
    
    const attrEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };
    
    const attrRegex = /[&<>"'`=]/g;
    return value.replace(attrRegex, (char) => attrEscapes[char] || char);
  };
  
  // React-safe HTML encoding for text content
  export const escapeJSXText = (text) => {
    if (text == null) return '';
    if (typeof text !== 'string') return String(text);
    
    const jsxEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '`': '&#x60;'
    };
    
    const jsxRegex = /[&<>"'`]/g;
    return text.replace(jsxRegex, (char) => jsxEscapes[char] || char);
  };
  
  export const safeInnerHTML = (html) => {
    const sanitized = sanitizeHTML(html);
    return { __html: sanitized };
  };
  
  export const createSafeAnchorProps = (href, options = {}) => {
    const sanitizedHref = sanitizeURL(href);
    const defaultProps = {
      rel: 'noopener noreferrer',
      target: options.target || '_self'
    };
    
    if (!sanitizedHref) {
      // Return safe props that prevent navigation
      return {
        href: '#',
        onClick: (e) => {
          e.preventDefault();
          logSecurityEvent('Blocked unsafe link click', { originalHref: href });
        },
        style: { cursor: 'not-allowed', opacity: 0.7 },
        title: 'This link has been blocked for security reasons',
        ...defaultProps
      };
    }
    
    return {
      href: sanitizedHref,
      ...defaultProps
    };
  };
  
  export const createSecureEventHandler = (handler, options = {}) => {
    const { eventName = 'click' } = options;
    
    return (event) => {
      // Validate event target
      if (event.target) {
        const target = event.target;
        
        // Check for dangerous href attributes
        if (target.href && target.href.toLowerCase().startsWith('javascript:')) {
          event.preventDefault();
          logSecurityEvent('Blocked javascript: href in event', { 
            href: target.href,
            eventName 
          });
          return;
        }
        
        // Check for dangerous form actions
        if (target.form && target.form.action) {
          const action = target.form.action.toLowerCase();
          if (action.startsWith('javascript:') || action.startsWith('data:')) {
            event.preventDefault();
            logSecurityEvent('Blocked dangerous form action', { 
              action,
              eventName 
            });
            return;
          }
        }
        
        // Check for dangerous script tags
        if (target.tagName === 'SCRIPT' && !target.hasAttribute('nonce')) {
          if (process.env.NODE_ENV === 'production') {
            event.preventDefault();
            logSecurityEvent('Blocked script without nonce', { eventName });
            return;
          }
        }
      }
      
      // Execute original handler if all checks pass
      if (typeof handler === 'function') {
        try {
          handler(event);
        } catch (error) {
          logSecurityEvent('Event handler error', { 
            eventName, 
            error: error.message 
          });
        }
      }
    };
  };
  
  //  CONTEXT-AWARE ENCODING 
  
  export const escapeHTML = (text) => {
    if (text === null || text === undefined) {
      return '';
    }
    
    const stringText = String(text);
    
    const htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;',
      '(': '&#40;',
      ')': '&#41;',
      '[': '&#91;',
      ']': '&#93;',
      '{': '&#123;',
      '}': '&#125;',
      ':': '&#58;',
      ';': '&#59;'
    };
    
    const htmlRegex = /[&<>"'`=/()\[\]{}:;]/g;
    return stringText.replace(htmlRegex, (char) => htmlEscapes[char] || char);
  };
  
   // JavaScript Context Encoding - For inline scripts and JSON data

  export const escapeJavaScript = (str) => {
    if (typeof str !== 'string') return '';
    
    const jsEscapes = {
      '\\': '\\\\',
      "'": "\\'",
      '"': '\\"',
      '\n': '\\n',
      '\r': '\\r',
      '\t': '\\t',
      '\f': '\\f',
      '\b': '\\b',
      '<': '\\x3C',
      '>': '\\x3E',
      '&': '\\x26',
      '=': '\\x3D',
      '/': '\\x2F'
    };
    
    const jsRegex = /[\\'"\n\r\t\f\b<>&=/]/g;
    return str.replace(jsRegex, (char) => jsEscapes[char] || char);
  };
  
  export const escapeCSS = (str) => {
    if (typeof str !== 'string') return '';
    
    const cssEscapes = {
      '\\': '\\\\',
      "'": "\\'",
      '"': '\\"',
      '<': '\\3C ',
      '>': '\\3E ',
      '&': '\\26 ',
      '(': '\\28 ',
      ')': '\\29 ',
      '{': '\\7B ',
      '}': '\\7D ',
      '[': '\\5B ',
      ']': '\\5D ',
      ':': '\\3A ',
      ';': '\\3B ',
      '=': '\\3D ',
      '\n': '\\A ',
      '\r': '\\D ',
      '\t': '\\9 '
    };
    
    const cssRegex = /[\\'"<>&(){}[\] :;=\n\r\t]/g;
    return str.replace(cssRegex, (char) => cssEscapes[char] || char);
  };
  
  export const sanitizeURL = (url) => {
    if (!url || typeof url !== 'string') return '';
    
    const trimmed = url.trim();
    if (!trimmed) return '';
    
    // Convert to lowercase for protocol checking
    const lowerTrimmed = trimmed.toLowerCase();
    
    // Block dangerous protocols (major XSS vectors)
    const dangerousProtocols = [
      'javascript:', 'data:', 'vbscript:', 
      'file:', 'blob:', 'about:', 'jar:',
      'feed:', 'ws:', 'wss:'
    ];
    
    for (const protocol of dangerousProtocols) {
      if (lowerTrimmed.startsWith(protocol)) {
        logSecurityEvent('Dangerous URL protocol blocked', { 
          url: trimmed, 
          protocol 
        });
        return '';
      }
    }
    
    // Allow only safe protocols
    const safeProtocols = ['http:', 'https:', 'mailto:', 'tel:', 'ftp:', 'ftps:'];
    
    try {
      // Try to parse as absolute URL
      const parsed = new URL(trimmed);
      
      if (!safeProtocols.includes(parsed.protocol)) {
        logSecurityEvent('Unsafe URL protocol blocked', { 
          url: trimmed, 
          protocol: parsed.protocol 
        });
        return '';
      }
      
      // Additional security: Check for suspicious patterns
      if (parsed.href.includes('<') || parsed.href.includes('>')) {
        logSecurityEvent('URL contains HTML characters', { url: trimmed });
        return encodeURI(parsed.href.replace(/[<>]/g, ''));
      }
      
      return encodeURI(parsed.href);
    } catch {
      // Not an absolute URL - check if it's a safe relative URL
      const safeRelativePatterns = [
        /^\/[^<>]*$/,           // Root-relative URLs
        /^#[^<>]*$/,            // Fragment identifiers
        /^\?[^<>]*$/,           // Query strings
        /^[a-zA-Z0-9\-._~%]*$/, // Simple paths
        /^\.\/[^<>]*$/,         // Current directory relative
        /^\.\.\/[^<>]*$/        // Parent directory relative
      ];
      
      for (const pattern of safeRelativePatterns) {
        if (pattern.test(trimmed)) {
          return encodeURI(trimmed);
        }
      }
      
      logSecurityEvent('Unsafe relative URL blocked', { url: trimmed });
      return '';
    }
  };
  
  // HTML SANITIZATION 
  
  export const sanitizeHTML = (html) => {
    if (html === null || html === undefined) {
      return '';
    }
    
    const stringHtml = String(html);
    
    // Remove script tags and content
    let sanitized = stringHtml.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, 
      ''
    );
    
    // Remove style tags that could contain malicious CSS
    sanitized = sanitized.replace(
      /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, 
      ''
    );
    
    // Remove all event handlers (onclick, onload, etc.)
    sanitized = sanitized.replace(
      /on\w+\s*=\s*["'][^"']*["']/gi, 
      ''
    );
    
    // Remove javascript: and data: URLs from href/src
    sanitized = sanitized.replace(
      /(href|src|action)\s*=\s*["'](javascript|data|vbscript):[^"']*["']/gi, 
      '$1="#"'
    );
    
    // Remove dangerous tags
    const dangerousTags = ['iframe', 'object', 'embed', 'link', 'meta', 'base'];
    dangerousTags.forEach(tag => {
      sanitized = sanitized.replace(
        new RegExp(`<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`, 'gi'),
        ''
      );
    });
    
    // Remove dangerous attributes
    const dangerousAttrs = [
      'onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout',
      'onkeydown', 'onkeyup', 'onkeypress', 'onfocus', 'onblur',
      'onchange', 'onsubmit', 'onreset', 'onselect', 'onabort'
    ];
    dangerousAttrs.forEach(attr => {
      sanitized = sanitized.replace(
        new RegExp(`${attr}\\s*=\\s*["'][^"']*["']`, 'gi'),
        ''
      );
    });
    
    return sanitized;
  };
  
  //  VALIDATION FUNCTIONS 

  export const validatePostcode = (postcode) => {
    if (postcode === null || postcode === undefined) {
      return '';
    }
    
    const stringPostcode = String(postcode);
    const sanitized = stringPostcode.replace(/[^A-Z0-9]/gi, '');
    const upperPostcode = sanitized.toUpperCase().substring(0, 4);
    
    const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?$/;
    
    if (upperPostcode && !postcodeRegex.test(upperPostcode)) {
      logSecurityEvent('Invalid Postcode Format', { 
        input: stringPostcode, 
        sanitized: upperPostcode 
      });
    }
    
    return upperPostcode;
  };
  
   // Validate numeric input with range constraints
  export const validateNumber = (value, options = {}) => {
    const { min = 0, max = 999999999, allowEmpty = false } = options;
    
    if (value === '' || value === null || value === undefined) {
      return allowEmpty ? null : 0;
    }
    
    const num = Number(value);
    
    if (isNaN(num) || !isFinite(num)) {
      logSecurityEvent('Invalid Number Input', { input: value });
      return null;
    }
    
    if (num < min || num > max) {
      logSecurityEvent('Number Out of Bounds', { input: value, num, min, max });
      return null;
    }
    
    return num;
  };
  
   // Validate property data structure
  export const validateProperty = (property) => {
    if (!property || typeof property !== 'object') {
      return false;
    }
    
    const requiredFields = ['id', 'type', 'price', 'bedrooms', 'location'];
    const missingFields = requiredFields.filter(field => !property[field]);
    
    if (missingFields.length > 0) {
      logSecurityEvent('Missing Property Fields', { 
        propertyId: property.id, 
        missingFields 
      });
      return false;
    }
    
    if (typeof property.id !== 'number') {
      logSecurityEvent('Invalid Property ID Type', { propertyId: property.id });
      return false;
    }
    
    if (typeof property.type !== 'string') {
      logSecurityEvent('Invalid Property Type', { propertyId: property.id });
      return false;
    }
    
    if (typeof property.price !== 'number' || property.price < 0) {
      logSecurityEvent('Invalid Property Price', { propertyId: property.id, price: property.price });
      return false;
    }
    
    return true;
  };
  
  // SECURITY LOGGING 

  export const logSecurityEvent = (event, details = {}) => {
    const timestamp = new Date().toISOString();
    
    const logEntry = {
      timestamp,
      event,
      details: JSON.stringify(details)
    };
    
    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Security Event] ${event}:`, details);
    }
    
    // Store in localStorage if available (browser only)
    if (typeof localStorage !== 'undefined') {
      try {
        const securityLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
        securityLogs.push(logEntry);
        
        // Keep only last 100 entries
        if (securityLogs.length > 100) {
          securityLogs.splice(0, securityLogs.length - 100);
        }
        
        localStorage.setItem('securityLogs', JSON.stringify(securityLogs));
      } catch (error) {
        console.error('Failed to log security event:', error);
      }
    }
  };
  
   // Get security logs for debugging
   
  export const getSecurityLogs = () => {
    if (typeof localStorage === 'undefined') return [];
    
    try {
      return JSON.parse(localStorage.getItem('securityLogs') || '[]');
    } catch (error) {
      return [];
    }
  };
  

   // Clear security logs
   
  export const clearSecurityLogs = () => {
    if (typeof localStorage === 'undefined') return;
    
    try {
      localStorage.removeItem('securityLogs');
    } catch (error) {
      console.error('Failed to clear security logs:', error);
    }
  };
  
  //  HELPER FUNCTIONS 

  export const getEncoderForContext = (context) => {
    const encoders = {
      'html': escapeHTML,
      'html-attr': escapeJSXAttr,
      'jsx-text': escapeJSXText,
      'javascript': escapeJavaScript,
      'css': escapeCSS,
      'url': sanitizeURL
    };
    
    return encoders[context] || escapeHTML;
  };
  
  export const autoEncodeData = (data) => {
    if (typeof data !== 'object' || data === null) return data;
    
    const encoded = Array.isArray(data) ? [] : {};
    
    for (const key in data) {
      const value = data[key];
      
      if (typeof value === 'string') {
        // Determine encoding based on key name patterns
        if (key.includes('url') || key.includes('href') || key.includes('src')) {
          encoded[key] = sanitizeURL(value);
        } else if (key.includes('color') || key.includes('style') || key.includes('css')) {
          encoded[key] = escapeCSS(value);
        } else if (key.includes('script') || key.includes('code')) {
          encoded[key] = escapeJavaScript(value);
        } else if (key.startsWith('on')) {
          // Event handlers should be functions, not strings
          encoded[key] = value;
        } else if (key.includes('attr') || key.startsWith('data-') || key.includes('aria-')) {
          encoded[key] = escapeJSXAttr(value);
        } else {
          encoded[key] = escapeJSXText(value);
        }
      } else if (typeof value === 'object' && value !== null) {
        // Recursively encode nested objects
        encoded[key] = autoEncodeData(value);
      } else {
        encoded[key] = value;
      }
    }
    
    return encoded;
  };
  
  //  EXPLANATORY EXAMPLES 

  export const getSecurityExamples = () => {
    return {
      csp: {
        description: 'Content Security Policy prevents XSS by controlling resource loading',
        headersExample: generateCSPHeaders({ useNonce: true }),
        metaTagExample: generateCSPMetaTag(),
        whenToUse: 'Always in production, optionally in development'
      },
      jsxEncoding: {
        description: 'JSX encoding protects React apps from XSS',
        contexts: {
          htmlBody: 'Use escapeJSXText() for text content in JSX',
          htmlAttributes: 'Use escapeJSXAttr() for props like title, data-*, etc.',
          urls: 'Use sanitizeURL() for href, src attributes',
          styles: 'Use escapeCSS() for style attributes',
          javascript: 'Use escapeJavaScript() for inline scripts'
        },
        note: 'React auto-escapes JSX expressions, but context-aware encoding adds extra safety'
      },
      encodingTable: {
        'HTML Body': 'escapeHTML() or escapeJSXText()',
        'HTML Attributes': 'escapeJSXAttr()',
        'JavaScript Strings': 'escapeJavaScript()',
        'CSS Values': 'escapeCSS()',
        'URLs': 'sanitizeURL()',
        'HTML with formatting': 'sanitizeHTML() + safeInnerHTML()'
      }
    };
  };
  
  //  EXPORT ALL UTILITIES 
  
  export default {
    // CSP Implementation
    generateCSPHeaders,
    generateCSPMetaTag,
    generateNonce,
    applyCSPNonce,
    
    // JSX Encoding
    escapeJSXAttr,
    escapeJSXText,
    safeInnerHTML,
    createSafeAnchorProps,
    createSecureEventHandler,
    
    // Context-Aware Encoding
    escapeHTML,
    escapeJavaScript,
    escapeCSS,
    sanitizeURL,
    
    // HTML Sanitization
    sanitizeHTML,
    
    // Validation
    validatePostcode,
    validateNumber,
    validateProperty,
    
    // Logging
    logSecurityEvent,
    getSecurityLogs,
    clearSecurityLogs,
    
    // Helpers
    getEncoderForContext,
    autoEncodeData,
    getSecurityExamples
  };