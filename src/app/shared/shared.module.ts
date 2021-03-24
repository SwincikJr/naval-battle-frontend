import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingComponent } from './loading/loading.component'
import { ArtemisiaButtonComponent } from './artemisia-button/artemisia-button.component'
import { ArtemisiaInputComponent } from './artemisia-input/artemisia-input.component'
import { ReactiveFormsModule } from '@angular/forms';
import { ArtemisiaFieldErrorsComponent } from './artemisia-field-errors/artemisia-field-errors.component'

@NgModule({
  declarations: [
    LoadingComponent,
    ArtemisiaButtonComponent,
    ArtemisiaInputComponent,
    ArtemisiaFieldErrorsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    LoadingComponent,
    ArtemisiaButtonComponent,
    ArtemisiaInputComponent,
    ArtemisiaFieldErrorsComponent
  ]
})
export class SharedModule { }
