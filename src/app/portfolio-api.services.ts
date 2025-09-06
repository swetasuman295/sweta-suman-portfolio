import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment'; 


@Injectable({
  providedIn: 'root'
})
export class PortfolioApiService {
  private apiUrl = environment.apiUrl;;  
  
  constructor(private http: HttpClient) {}
  
  /**
   * Submit contact form
   */
  submitContact(contactData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      
    });
    
    return this.http.post(`${this.apiUrl}/contacts`, contactData, { headers })
      .pipe(
        map(response => {
          console.log('✅ Contact submitted successfully:', response);
          return response;
        }),
        catchError(error => {
          console.error('❌ Error submitting contact:', error);
          return throwError(() => error);
        })
      );
  }
  
  /**
   * Get all contacts with pagination
   */
  getContacts(page: number = 0, size: number = 10, status?: string, priority?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (status) params = params.set('status', status);
    if (priority) params = params.set('priority', priority);
    
    return this.http.get(`${this.apiUrl}/contacts`, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching contacts:', error);
          return throwError(() => error);
        })
      );
  }
  
  /**
   * Get contact analytics
   */
  getAnalytics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/contacts/analytics`)
      .pipe(
        map(data => {
          console.log('📊 Analytics data:', data);
          return data;
        }),
        catchError(error => {
          console.error('Error fetching analytics:', error);
          return throwError(() => error);
        })
      );
  }
  
  /**
   * Mark contact as responded
   */
  markAsResponded(contactId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/contacts/${contactId}/respond`, {})
      .pipe(
        catchError(error => {
          console.error('Error marking contact as responded:', error);
          return throwError(() => error);
        })
      );
  }
  
  /**
   * Health check
   */
  checkHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/contacts/health`)
      .pipe(
        map(response => {
          console.log('✅ Backend is healthy:', response);
          return response;
        }),
        catchError(error => {
          console.error('❌ Backend health check failed:', error);
          return throwError(() => error);
        })
      );
  }
  
  private getClientIP(): string {
    // In real production, you'd get this from the server
    return 'client-ip';
  }

/**
 * Track visitor session
 */
trackVisitorSession(): Observable<any> {
  return this.http.post(`${this.apiUrl}/visitor/session`, {})
    .pipe(
      catchError(error => {
        console.warn('Visitor tracking failed:', error);
        return throwError(() => error);
      })
    );
}

/**
 * Track page views
 */
trackPageView(page: string, previousPage?: string, timeSpent?: number): Observable<any> {
  const payload = {
    page,
    previousPage,
    timeSpent
  };
  
  return this.http.post(`${this.apiUrl}/visitor/pageview`, payload)
    .pipe(
      catchError(error => {
        console.warn('Page view tracking failed:', error);
        return throwError(() => error);
      })
    );
}
trackVisitorSessionWithId(sessionId: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/visitor/session-with-id`, { sessionId });
}
}