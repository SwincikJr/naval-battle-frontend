import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public readonly options = [
    { label: 'Novo Cadastro' },
    { label: 'Esqueci minha senha' },
    { label: 'Contato' }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
