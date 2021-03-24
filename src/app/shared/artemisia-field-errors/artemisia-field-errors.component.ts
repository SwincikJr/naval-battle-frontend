import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'artemisia-field-errors',
  templateUrl: './artemisia-field-errors.component.html',
  styleUrls: ['./artemisia-field-errors.component.css']
})
export class ArtemisiaFieldErrorsComponent implements OnInit {

  @Input() errors: Array<string>;

  constructor() { }

  ngOnInit(): void {
  }

}