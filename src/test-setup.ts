// Fix for SockJS in test environment
(window as any).global = window;
(window as any).process = { env: {} };

// Additional SockJS fixes
Object.defineProperty(window, 'WebSocket', {
  writable: true,
  value: class MockWebSocket {
    constructor() {}
    send() {}
    close() {}
  }
});