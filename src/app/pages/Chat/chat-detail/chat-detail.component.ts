import { Component, input, effect, inject, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { useAuthStore } from '../../../core/stores/auth.store';
import { useChatStore } from '../../../core/stores/chat.store';

@Component({
  selector: 'app-chat-detail',
  standalone: true,
  imports: [FormsModule, DatePipe, CommonModule, RouterModule],
  templateUrl: './chat-detail.component.html',
  styleUrl: './chat-detail.component.css',
})
export class ChatDetailComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;  
  chatId = '';
  chatStore = inject(useChatStore);
  authStore = inject(useAuthStore);
  newMessage = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.chatId = this.route.snapshot.paramMap.get('chatId') || '';
    if (this.chatId) this.chatStore.listenToMessages(this.chatId);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();  // Ensure scrolling happens after the view updates
  }


  sendMessage() {
    if (this.newMessage.trim() && this.authStore.currentUser()) {
      this.chatStore.sendMessage(
        this.chatId,
        this.authStore.currentUser()!.uid,
        this.newMessage
      );
      this.newMessage = '';
    }
  }
// Method to scroll to the bottom of the messages container
scrollToBottom() {
  try {
    this.messagesContainer.nativeElement.scrollTop =
      this.messagesContainer.nativeElement.scrollHeight;
  } catch (err) {
    console.error('Error while scrolling to bottom', err);
  }
}
  
}
