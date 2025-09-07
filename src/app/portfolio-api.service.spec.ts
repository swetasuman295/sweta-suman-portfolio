import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PortfolioApiService } from './portfolio-api.services';

describe('PortfolioApiService', () => {
  let service: PortfolioApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PortfolioApiService]
    });
    service = TestBed.inject(PortfolioApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check health', () => {
    const mockResponse = { status: 'UP', service: 'Test' };

    service.checkHealth().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(request => 
      request.url.includes('/contacts/health')
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should submit contact', () => {
    const contactData = { name: 'Test', email: 'test@test.com', message: 'Test' };
    const mockResponse = { success: true, message: 'Success' };

    service.submitContact(contactData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(request => 
      request.url.includes('/contacts')
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(contactData);
    req.flush(mockResponse);
  });
});