import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'artemisia-input',
  templateUrl: './artemisia-input.component.html',
  styleUrls: ['./artemisia-input.component.css']
})
export class ArtemisiaInputComponent {
  @Input() placeholder: string
  @Input() type: string
  @Input() formPropertyName: string
  @Input() formGroup: FormGroup
}
