import { Component } from '@angular/core';
import { RequestDetailDto } from 'src/app/model/RequestDetailDto.model';
import { RequestService } from '../request.service';
import { Router } from '@angular/router';
import { FacultyService } from '../../faculty/faculty.service';
import { Faculty } from 'src/app/model/Faculty.model';
import { CustomRequest } from 'src/app/model/Request.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-request-on-hold',
  templateUrl: './request-on-hold.component.html',
  styleUrls: ['./request-on-hold.component.css']
})
export class RequestOnHoldComponent {
  requests: CustomRequest[] = [];
  filteredRequests: CustomRequest[] = [];
  searchTerm: string = '';

  constructor(
    private requestService: RequestService,
    private router: Router,
    private facultyService: FacultyService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.requests = [];  // Initialize requests array
    this.filteredRequests = [];  // Initialize filteredRequests array

    this.requestService.getAllPendingRequestDetails().subscribe({
      next: (result: CustomRequest[]) => {
        this.requests = result || [];
        this.filteredRequests = [...this.requests]; // Initialize filteredRequests with fetched data

        console.log("PRIKAZI SVE", this.requests);

        // Loop through each request and get faculty information
        this.requests.forEach(request => {
          if (request.facultyId) {
            this.facultyService.getFacultyById(request.facultyId).subscribe(faculty => {
              request['faculty'] = faculty; // Attach faculty details to the request
            });
          }
        });

        console.log(this.requests);
      },
      error: (err) => {
        console.error("Error fetching request details:", err);
      }
    });
  }

  resendRequest(request: CustomRequest): void {
    // Simple confirmation dialog using JavaScript's built-in confirm function
    const confirmation = confirm("It's been too long since the request was sent. Do you want to resend it?");
    
    if (confirmation) {
      // If the user confirmed, proceed with resending the request
      this.requestService.createRequest(request).subscribe({
        next: () => {
          console.log("Request resent successfully");
          this.snackBar.open('Request resent successfully!', 'Close', {
            duration: 3000, // Duration in milliseconds
          });
        },
        error: (error) => {
          console.error("Error creating request:", error);
          this.snackBar.open('Error sending request. Please try again.', 'Close', {
            duration: 3000,
          });
        },
        complete: () => {
          console.log("Request creation request completed.");
        }
      });
    } else {
      // If the user cancelled, just log or handle as needed
      console.log("Resend request was cancelled by the user.");
    }
  }

  cancelRequest(request: CustomRequest): void {
    const confirmation = confirm("It's been too long since the request was sent. Do you want to cancel it?");
    
    if (confirmation) {
      // Mark the request as canceled
      request.canceled = true;

      // Show a success message
      this.snackBar.open('Request canceled successfully!', 'Close', {
        duration: 3000, // Duration in milliseconds
      });

      // Optional: log the cancellation
      console.log("Request has been canceled:", request);
    } else {
      // If the user canceled the confirmation dialog, log or handle as needed
      console.log("Cancellation was aborted by the user.");
    }
  }

  filterRequests(): void {
    this.filteredRequests = this.requests.filter(request =>
      request.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  sortRequests(order: 'asc' | 'desc'): void {
    this.filteredRequests.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (order === 'asc') {
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      } else {
        return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
      }
    });
  }

  scrollLeft(): void {
    const carousel = document.querySelector('.carousel');
    if (carousel) {
      carousel.scrollBy({
        left: -300, // Adjust this value based on the card width
        behavior: 'smooth'
      });
    }
  }

  scrollRight(): void {
    const carousel = document.querySelector('.carousel');
    if (carousel) {
      carousel.scrollBy({
        left: 300, // Adjust this value based on the card width
        behavior: 'smooth'
      });
    }
  }

}
