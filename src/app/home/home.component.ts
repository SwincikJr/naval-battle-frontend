import { Component, OnInit } from '@angular/core';

interface Option {
  id?: string,
  label?: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  activeOption: Option = {}
  options: Array<Option> = []

  private loginActiveOption = {
    id: 'login',
    label: 'Login'
  }

  private registerActiveOption = {
    id: 'register',
    label: 'Cadastro'
  }

  private recoveryActiveOption = {
    id: 'recovery',
    label: 'Recuperação de senha'
  }

  private contactsActiveOption = {
    id: 'contacts',
    label: 'Contato'
  }

  private primaryOptions = [
    { id: 'register', label: 'novo cadastro' },
    { id: 'recovery', label: 'esqueci minha senha' },
    { id: 'contacts', label: 'contato' }
  ]

  private secondaryOptions = [
    { id: 'login', label: 'voltar à tela de login' },
    { id: 'contacts', label: 'contato' }
  ]

  constructor() { }

  ngOnInit(): void {
    this.activeOption = this.loginActiveOption
    this.options = this.primaryOptions
  }

  changeOption(id) {
    this.activeOption = this[`${id}ActiveOption`]
    this.options = id === 'login' ? this.primaryOptions : this.secondaryOptions
  }
}
