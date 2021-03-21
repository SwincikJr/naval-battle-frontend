import { Component, Input } from '@angular/core';

@Component({
  selector: 'artemisia-button',
  templateUrl: './artemisia-button.component.html',
  styleUrls: ['./artemisia-button.component.css']
})
export class ArtemisiaButtonComponent {
  @Input() disabled: Boolean
  @Input() loading: Boolean
  @Input() label: string
}
