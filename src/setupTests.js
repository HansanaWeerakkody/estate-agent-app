// src/setupTests.js
import '@testing-library/jest-dom';

// Mock process.env for tests
process.env.NODE_ENV = 'test';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.location
delete window.location;
window.location = { href: 'http://test.example.com' };

// Mock navigator.userAgent
Object.defineProperty(window.navigator, 'userAgent', {
  value: 'Test Agent',
  writable: true
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock console methods to prevent test output clutter
global.console.warn = jest.fn();
global.console.error = jest.fn();

// Proper DOMPurify mock
const mockSanitize = jest.fn((html) => {
  // Basic sanitization for tests - remove script tags
  if (typeof html !== 'string') return '';
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
});

jest.mock('dompurify', () => ({
  __esModule: true,
  default: {
    sanitize: mockSanitize,
    setConfig: jest.fn(),
    addHook: jest.fn(),
    removeHook: jest.fn(),
    removeAllHooks: jest.fn(),
  }
}));