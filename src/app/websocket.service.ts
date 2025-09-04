import { Injectable } from '@angular/core';
import * as Stomp from 'webstomp-client';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  // This will hold the latest stats and allow components to subscribe to updates
  public liveStats$ = new BehaviorSubject<any>(null);

  /**
   * Establishes a WebSocket connection to the backend.
   */
  public connect(): void {
    // The endpoint we configured in the Spring Boot backend
    const socket = new SockJS('http://localhost:8081/api/ws');
    this.stompClient = Stomp.over(socket);

    // Disable the default console logging from the STOMP client
    this.stompClient.debug = () => {};

    this.stompClient.connect({}, (frame: any) => {
      console.log('✅ WebSocket connection established: ' + frame);

      // Subscribe to the "/topic/live-stats" destination where the backend sends updates
      this.stompClient.subscribe('/topic/live-stats', (message: any) => {
        const stats = JSON.parse(message.body);
        console.log('📊 Received live stats update:', stats);
        
        // Push the new data into our observable stream
        this.liveStats$.next(stats);
      });
    });
  }

  /**
   * Disconnects the WebSocket connection.
   */
  public disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('🔌 WebSocket connection disconnected.');
      });
    }
  }
}