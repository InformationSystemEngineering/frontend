import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms'; // Dodati FormControl
import { User } from '../../../model/User';
import { UserProfileService } from '../user-profile.service';
import { AuthServiceService } from 'src/app/infrastructure/auth/register/auth-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StudentsOverviewComponent } from '../../internship-test/students-overview/students-overview.component';
import { StudentTest } from 'src/app/model/studentTest.model';
import { InternshipTestService } from '../../internship-test/internship-test.service';
import { FeedbackFair } from 'src/app/model/FeedbackFair.model';
import { FairService } from '../../fair/fair.service';
import { FeedbackReport } from 'src/app/model/FeedbackReport.model';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User | undefined;
  profileForm!: FormGroup;
  isEditing: boolean = false;
  userRole: string = '';
  userClaims: any = null;
  studentTest!: StudentTest;
  feedback: FeedbackReport | undefined;
  extraActivity: number | undefined;


  constructor(private fairService: FairService, private fb: FormBuilder, private testService: InternshipTestService, private service: UserProfileService, private authService: AuthServiceService, private jwtHelper: JwtHelperService) {}

  ngOnInit(): void {
    this.authService.loginStatus$.subscribe(loggedIn => {
      if (loggedIn) {
        const token = localStorage.getItem('token');
        this.userClaims = this.authService.decodeToken();
        this.userRole = this.userClaims.role[0].authority; // Adjust according to actual token structure
      } else {
        this.userRole = '';
      }
    });

      
    

    this.profileForm = this.fb.group({ // Inicijalizacija profileForm
      id: [''],
      password: [''],
      name: [''],
      lastName: [''],
      username: [''],
      email: [''],
      roles: [[]] // Postavljanje roles kao prazan niz
    });

    const token = localStorage.getItem('token'); // Dobijanje tokena iz lokalnog skladišta
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log("Token: ", decodedToken);

      const email = decodedToken.sub;
      // Poziv funkcije koja dohvaća korisnika na osnovu email adrese
      this.service.getUserByEmail(email).subscribe({
        next: (user: User) => {
          this.user = user; // Postavljanje pronađenog korisnika
          console.log("User: ", user);

          this.profileForm.patchValue({
            id: user.id,
            password: user.password,
            name: user.name,
            lastname: user.lastName,
            username: user.username,
            email: user.email,
            roles: user.roles
          });
        },
        error: (err: any) => {
          console.error('Error fetching user:', err);
        }
      });
    } else {
      console.error('Token not found in local storage.');
    }
  }

  updateProfile() {
    this.isEditing = !this.isEditing;
  
    if (this.isEditing) {
      this.profileForm.enable();
      // Popunjavamo polja forme sa trenutnim podacima korisnika
      this.loadProfileData();
    } else {
      this.profileForm.disable();
    }
  }
  

  saveChanges() {
    console.log('Form value:', this.profileForm.value);

    

    const updatedData = {
      id: this.profileForm.value.id,
      password: this.profileForm.value.password,
      name: this.profileForm.value.name,
      lastName: this.profileForm.value.lastName,
      username: this.profileForm.value.username,
      email: this.profileForm.value.email,
      roles: this.user?.roles || []
    };

    this.service.updateProfile(updatedData, 1).subscribe({
      next: (data: any) => {
        console.log('Profile updated successfully:', data);
        this.loadProfileData();
      },
      error: (err: any) => {
        console.error('Error updating profile:', err);
      }
    });

    this.isEditing = !this.isEditing;
  
    if (this.isEditing) {
      this.profileForm.enable();
      // Popunjavamo polja forme sa trenutnim podacima korisnika
      this.loadProfileData();
    } else {
      this.profileForm.disable();
    }
  }

  loadProfileData() {
    const token = localStorage.getItem('token'); // Dobijanje tokena iz lokalnog skladišta
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log("Token: ", decodedToken);

      const email = decodedToken.sub;
      // Poziv funkcije koja dohvaća korisnika na osnovu email adrese
      this.service.getUserByEmail(email).subscribe({
        next: (user: User) => {
          this.user = user; // Postavljanje pronađenog korisnika
          console.log("User: ", user);

          this.profileForm.patchValue({
            id: user.id,
            password: user.password,
            name: user.name,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            roles: user.roles
          });
        },
        error: (err: any) => {
          console.error('Error fetching user:', err);
        }
      });
    } else {
      console.error('Token not found in local storage.');
    }
  }

  GetReport() : void {
      this.fairService.getFeedbackReport().subscribe({
        next: (report: FeedbackReport) => {
          this.feedback =report;
          const doc = new jsPDF();

// Add image to the PDF
const imgData = '/assets/psiho.jpg'; // Path to the image
doc.addImage(imgData, 'JPEG', 10, 10, 190, 30); // Adjust dimensions as needed

// Title
doc.setFontSize(20); // Set font size for the title
doc.setTextColor(0, 0, 0); // Black color for the title
doc.text('Extra Activity Report', 105, 45, { align: 'center' }); // Centered title

// Date in the top-right corner
doc.setFontSize(10); // Set font size for the date
doc.text('10.06.2024', 180, 15); // Position the date in the top-right

// Summary information
doc.setFontSize(9); // Set font size for summary information
doc.setTextColor(0, 0, 0); // Black color for the text
let y = 60; // Starting y position for the summary
doc.text('Reviewed Extra activities: 2', 10, y);
y += 10;
doc.text('Number of reviews by students: 5', 10, y);
y += 10;
doc.text('Number of reviewed psychologists: 2', 10, y);
y += 10; // Add extra space before listing activities
doc.text('Number of Fairs reviewed: 1', 10, y);
y += 10; // Add extra space before listing activities
doc.text('The most frequent type of extra activity: predavanja', 10, y);
y += 20; // Add extra space before listing activities

// Reset font type to normal

// Now iterate through the feedback list
const feedbackList = this.feedback.feedbackFairDtoList;

feedbackList.forEach((feedback) => {
  // Set font size and color for the activity name
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0); // Black color for the text
  doc.text(`Extra Activity Name: ${feedback.name}`, 10, y);
  y += 10;

  doc.setFontSize(10); // Reduce font size for details
  doc.text(`Fair Name: ${feedback.fairPsychologyFairName}`, 20, y);
  y += 10;

  doc.text(`Content Grade: ${feedback.contentGrade}`, 20, y);
  y += 10;

  doc.text(`Psychologist Grade: ${feedback.psychologistGrade}`, 20, y);
  y += 10;

  doc.text(`Final Grade: ${feedback.finalGrade}`, 20, y);
  y += 10;

  doc.text(`Organization Grade: ${feedback.organizationGrade}`, 20, y);
  y += 20; // Add extra space between activities
});

// Save the PDF
doc.save('feedback-report.pdf');

  }
      })
  }
}

