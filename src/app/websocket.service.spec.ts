import { TestBed } from '@angular/core/testing';
import { WebSocketService } from './websocket.service';

// Mock SockJS and Stomp
const mockSockJS = jasmine.createSpyObj('SockJS', ['send', 'close']);
const mockStompClient = jasmine.createSpyObj('StompClient', ['connect', 'disconnect', 'subscribe', 'debug']);

// Global mocks
(window as any).SockJS = jasmine.createSpy('SockJS').and.returnValue(mockSockJS);
(window as any).Stomp = {
  over: jasmine.createSpy('over').and.returnValue(mockStompClient)
};

describe('WebSocketService', () => {
  let service: WebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketService);
    
    // Reset mocks
    mockStompClient.connect.calls.reset();
    mockStompClient.disconnect.calls.reset();
    mockStompClient.subscribe.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial null value for liveStats', (done) => {
    service.liveStats$.subscribe(stats => {
      expect(stats).toBeNull();
      done();
    });
  });

  it('should create SockJS connection when connect is called', () => {
    service.connect();
    
    expect((window as any).SockJS).toHaveBeenCalled();
    expect((window as any).Stomp.over).toHaveBeenCalledWith(mockSockJS);
  });

  it('should configure stomp client debug when connect is called', () => {
    service.connect();
    
    expect(mockStompClient.debug).toBeDefined();
  });

  it('should call stomp connect when connect is called', () => {
    service.connect();
    
    expect(mockStompClient.connect).toHaveBeenCalled();
  });

  it('should subscribe to live-stats topic on successful connection', () => {
    // Mock successful connection
    mockStompClient.connect.and.callFake((headers: any, successCallback: Function) => {
      successCallback('Connected');
    });

    service.connect();
    
    expect(mockStompClient.subscribe).toHaveBeenCalledWith(
      '/topic/live-stats',
      jasmine.any(Function)
    );
  });

  it('should update liveStats$ when message received', (done) => {
    const mockStats = {
      totalVisitors: 100,
      activeConnections: 5,
      totalContacts: 50
    };

    // Mock successful connection and subscription
    mockStompClient.connect.and.callFake((headers: any, successCallback: Function) => {
      successCallback('Connected');
    });

    mockStompClient.subscribe.and.callFake((topic: string, callback: Function) => {
      // Simulate receiving a message
      setTimeout(() => {
        callback({
          body: JSON.stringify(mockStats)
        });
      }, 10);
    });

    service.connect();

    // Skip the initial null value and check the updated value
    service.liveStats$.pipe().subscribe(stats => {
      if (stats !== null) {
        expect(stats).toEqual(mockStats);
        done();
      }
    });
  });

  it('should handle connection errors gracefully', () => {
    spyOn(console, 'error');
    
    // Mock connection error
    mockStompClient.connect.and.callFake((headers: any, successCallback: Function, errorCallback: Function) => {
      errorCallback('Connection failed');
    });

    service.connect();
    
    expect(console.error).toHaveBeenCalledWith('WebSocket connection failed:', 'Connection failed');
  });

  it('should disconnect when disconnect is called', () => {
    // First connect
    service.connect();
    
    // Mock disconnect callback
    mockStompClient.disconnect.and.callFake((callback: Function) => {
      callback();
    });

    spyOn(console, 'log');
    
    service.disconnect();
    
    expect(mockStompClient.disconnect).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('WebSocket connection disconnected.');
  });

  it('should handle disconnect when client is not initialized', () => {
    // Don't connect first
    spyOn(console, 'log');
    
    service.disconnect();
    
    expect(mockStompClient.disconnect).not.toHaveBeenCalled();
  });

  it('should parse JSON message correctly', (done) => {
    const mockStats = {
      visitors: 42,
      timestamp: new Date().toISOString()
    };

    mockStompClient.connect.and.callFake((headers: any, successCallback: Function) => {
      successCallback('Connected');
    });

    mockStompClient.subscribe.and.callFake((topic: string, callback: Function) => {
      callback({
        body: JSON.stringify(mockStats)
      });
    });

    service.connect();

    service.liveStats$.subscribe(stats => {
      if (stats !== null) {
        expect(stats.visitors).toBe(42);
        expect(stats.timestamp).toBeDefined();
        done();
      }
    });
  });

  it('should handle invalid JSON in messages', () => {
    spyOn(console, 'error');

    mockStompClient.connect.and.callFake((headers: any, successCallback: Function) => {
      successCallback('Connected');
    });

    mockStompClient.subscribe.and.callFake((topic: string, callback: Function) => {
      callback({
        body: 'invalid json'
      });
    });

    service.connect();
    
    expect(console.error).toHaveBeenCalled();
  });
});