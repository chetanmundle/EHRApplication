import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { useAuthStore } from '../../../core/stores/auth.store';
import { useChatStore, Chat } from '../../../core/stores/chat.store';
@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [RouterModule, DatePipe],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css',
})
export class ChatListComponent implements OnInit {
  chatStore = inject(useChatStore);
  authStore = inject(useAuthStore);
  router = inject(Router);

  ngOnInit() {
    const userId = this.authStore.currentUser()?.uid;
    if (userId) {
      this.chatStore.listenToChats(userId);
    } else {
      // this.router.navigate(['/login']);
    }
  }

  getChatName(chat: Chat): string {
    if (chat.participantNames) {
      return chat.participantNames
        .filter((name) => name !== this.authStore.currentUser()?.displayName)
        .join(', ');
    }
    return 'Loading...';
  }
}
