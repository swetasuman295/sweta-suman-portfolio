import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:3000/api/contact';

  constructor(private http: HttpClient) {}

  sendMessage(formData: any) {
    return this.http.post(this.apiUrl, formData);
  }
}