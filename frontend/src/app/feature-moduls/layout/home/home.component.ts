import { Component, OnInit } from '@angular/core';
import { InternshipTestService } from '../../internship-test/internship-test.service';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/infrastructure/auth/register/auth-service.service';
import { InternshipTest } from 'src/app/model/internship.model';
import { Observable } from 'rxjs';
import { TopicDetails } from 'src/app/model/TopicDetails.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  
})
export class HomeComponent implements OnInit {

  userClaims: any = null;
  userRole: string = '';

  constructor(
    private internshipService: InternshipTestService, 
    private notifications: NotificationsService,
    private router: Router,
    private authService: AuthServiceService){}

    ngOnInit(): void {
      this.authService.loginStatus$.subscribe((loggedIn) => {
        if (loggedIn) {
          this.userClaims = this.authService.decodeToken();
          this.userRole = this.userClaims.role[0].authority;
          if (this.userRole === 'ROLE_PSYCHOLOG') {
            this.showNotification();
          }
          else if (this.userRole === 'ROLE_MANAGER'){
            this.showNotification1();
          }
          else if (this.userRole === 'ROLE_STUDENT'){
            this.showNotification2();
          }
        } else {
          this.userRole = '';
        }
      });
    }
  
    showNotification(): void {
      const toast = this.notifications.info(
        'New Topic Invitations',
        'Click here to view your topic invitations.',
        {
          timeOut: 5000,
          showProgressBar: true,
          clickToClose: true,
          pauseOnHover: true,
        }
      );
  
      toast.click?.subscribe(() => {
        this.router.navigate(['/notifications']); // Navigate to the notifications component
      });
    }

    showNotification2(): void {
      const toast = this.notifications.info(
        'Reminder: Your topic that you signed up for is tomorrow.',
        'Click here to view topic.',
        {
          timeOut: 5000,
          showProgressBar: true,
          clickToClose: true,
          pauseOnHover: true,
        }
      );
  
      toast.click?.subscribe(() => {
        this.router.navigate(['/notifications-student']); // Navigate to the notifications component
      });
    }

    showNotification1(): void {
      const toast = this.notifications.info(
        'Psychologist request for topic',
        'Click here to view psychologist request.',
        {
          timeOut: 5000,
          showProgressBar: true,
          clickToClose: true,
          pauseOnHover: true,
        }
      );
  
      toast.click?.subscribe(() => {
        this.router.navigate(['/notifications-manager']); // Navigate to the notifications component
      });
    }


  areThereUnreviewedTests(): Observable<boolean> {
    console.log("here");
    return new Observable<boolean>(observer => {
      this.internshipService.getAllInternshipTests().subscribe({
        next: (tests: InternshipTest[]) => {
          let hasUnreviewedTests = false;
          tests.forEach(test => {
            if (!test.testReviewed) {
              hasUnreviewedTests = true;
            }
          });
          console.log("has unreviewed: ", hasUnreviewedTests)
          observer.next(hasUnreviewedTests);
          observer.complete();
        },
        error: err => {
          observer.error(err);
        }
      });
    });
  }
}
