import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Message } from 'src/app/model/Message.model';
import { RequestService } from '../request.service';
import { FormControl } from '@angular/forms';
import { AuthServiceService } from 'src/app/infrastructure/auth/register/auth-service.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{
  messages: Message[] = [];
  otherName: string = '';
  messageControl = new FormControl('');
  userClaims: any = null;
  userRole: string = '';
  @Input() selectedPsychologistId: number | null = null;
  @Input() selectedTopicId: number | null = null;
  @Output() messageSent = new EventEmitter<void>();
  

  constructor(private service: RequestService, private authService: AuthServiceService,
    @Inject(MAT_DIALOG_DATA) public data: { selectedTopicId: number; selectedPsychologistId: number; }
  ) {
    this.selectedTopicId = data.selectedTopicId;
    this.selectedPsychologistId = data.selectedPsychologistId;
  }

  ngOnInit() {
    this.getUserInfo();
    this.getMessages();
  }

  getUserInfo(): void {
    this.authService.loginStatus$.subscribe(loggedIn => {
      if (loggedIn) {
        const token = localStorage.getItem('token');
        this.userClaims = this.authService.decodeToken();
        this.userRole = this.userClaims.role[0].authority;
      } else {
        this.userRole = '';
      }
    });
  }

  getMessages(): void {
    if (this.selectedPsychologistId !== null && this.selectedTopicId !== null) {
      this.service.getMessages(this.selectedTopicId, this.selectedPsychologistId).subscribe({
        next: (messages: Message[]) => {
          this.messages = messages.filter(message => !!message).sort((a, b) => (a.id || 0) - (b.id || 0));
          if (this.userRole == 'ROLE_PSYCHOLOG') {
            this.messages.forEach(mess => {
              this.otherName = mess.userName || '';
              if (mess.sender == 'student' && !mess.isRead) {
                mess.isRead = true;
                this.service.readMessage(mess).subscribe();
              }
            });
          } else if (this.userRole == 'ROLE_MANAGER') {
            this.messages.forEach(mess => {
              this.otherName = mess.psychologistName || '';
              if (mess.sender == 'psychologist' && !mess.isRead) {
                mess.isRead = true;
                this.service.readMessage(mess).subscribe();
              }
            });
          }
        },
        error: (error) => {
          console.error('Error fetching messages:', error);
        }
      });
    }
  }


  sendMessage() {
    if (this.selectedPsychologistId !== null && this.selectedTopicId !== null) {
        const message: Message = {
            userId: 3, // Pretpostavljam da `userClaims` sadrži `id` korisnika
            psychologistId: this.selectedPsychologistId,
            content: this.messageControl.value || "",
            isRead: false,
            sender: this.userRole === 'ROLE_PSYCHOLOG' ? 'psychologist' : 'manager',
            topicId: this.selectedTopicId // Dodajte `topicId`
        };

        this.service.addMessage(message).subscribe({
            next: () => {
                this.getMessages();
                this.messageSent.emit();
                this.messageControl.setValue('');
            },
            error: (error) => {
                console.error('Error sending message:', error);
            }
        });
    }
}

}
