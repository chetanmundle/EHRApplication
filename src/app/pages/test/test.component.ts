import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
})
export class TestComponent implements OnInit {
  ngOnInit(): void {
    this.requestNotificationPermission();
  }
  // Request permission for notifications
  requestNotificationPermission(): void {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission !== 'granted') {
          console.error('Permission not granted for Notification');
        }
      });
    } else {
      console.error('This browser does not support notifications.');
    }
  }

  // Function to show notification
  showNotification(): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Hello from Angular!', {
        body: 'This is a WhatsApp-like notification!',
        // icon: 'assets/notification-icon.png', // Use a relevant icon
        tag: 'notification-tag',
      });
    } else {
      console.error('Notification permission is not granted.');
    }
  }
  onButtonClickq(): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Hello from Anguladsfr!', {
        body: 'This is a WhatsApp-like notificatsdfion!',
        // icon: 'assets/notification-icon.png', // Use a relevant icon
        tag: 'notificatiodsfn-tag',
      });
    } else {
      console.error('Notification permission is not granted.');
    }
  }

  // Trigger notification on button click
  onButtonClick(): void {
    this.showNotification();
  }
}
