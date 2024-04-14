import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { DisplayProfile } from './displayProfile/displayProfile.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ToastrModule } from 'ngx-toastr';

//import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    DisplayProfile
  ],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
        positionClass: 'toast-bottom-custom'
      }),
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,

    FormsModule,
    MatDialogModule,

    MaterialModule  ],

  exports: [
    DisplayProfile
  
  ],
})
export class RegisteredUserModule {}
