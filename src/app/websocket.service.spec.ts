import { TestBed } from '@angular/core/testing';
import { WebSocketService } from './websocket.service';

describe('WebSocketService', () => {
  let service: WebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have liveStats$ BehaviorSubject', () => {
    expect(service.liveStats$).toBeTruthy();
    expect(service.liveStats$.value).toBeNull();
  });

  it('should have connect method', () => {
    expect(typeof service.connect).toBe('function');
  });

  it('should have disconnect method', () => {
    expect(typeof service.disconnect).toBe('function');
  });
});