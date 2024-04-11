import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { User } from 'src/app/feature-moduls/model/User';
import { AuthServiceService } from './auth-service.service';
import { Router } from '@angular/router';
import { Register } from 'src/app/feature-moduls/model/register.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnChanges {
  passwordsMatch: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private service: AuthServiceService,
    private router: Router
  ) {}
  ngOnChanges(changes: SimpleChanges): void {}
  ngOnInit(): void {}

  userForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    reenterPassword: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
  });

  checkPasswordMatch() {
    const password = this.userForm.get('password')?.value;
    const reenterPassword = this.userForm.get('reenterPassword')?.value;
    this.passwordsMatch = password === reenterPassword;
  }

  registerUser(): void {
    const user: Register = {
      name: this.userForm.value.name || '',
      username: this.userForm.value.username || '' ,
      email: this.userForm.value.email || '',
      password: this.userForm.value.password || '',
      
    };

    if (!this.userForm.valid) {
      return;
    }
    this.checkPasswordMatch();
    if (this.passwordsMatch) {
      this.service.signUp(user).subscribe({
        next: () => {
          console.log(user);
          alert('Confirm your registration by email');
          this.userForm.reset();
        },
        error: (error) => {
          console.error(error);
          console.log('postoji mail');
          this.router.navigate(['/failRegistration']);
        },
      });
    } else {
      alert('Passwords do not match');
    }
  }
}
