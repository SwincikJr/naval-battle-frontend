import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { timeStamp } from 'console';
import { GameService } from 'src/app/shared/services/game.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SocketService } from 'src/app/shared/services/socket.service';
import { UserService } from '../services/user';

@Component({
  selector: 'app-root',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.css'],
})
export class HomeUserComponent implements OnInit {
  
  challengeForm = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]),
  })

  public username: string = '';
  public challengerUsername: string = '';
  public finding: boolean = false;
  public accepting: boolean = false;
  public canceling: boolean = false;
  public challenging: boolean = false;
  public socket: any = null;

  @ViewChild('startMatchModal')
  private startMatchModalTemplate: TemplateRef<any>;

  @ViewChild('waitingModal')
  private waitingModalTemplate: TemplateRef<any>;

  @ViewChild('challengeModal')
  private challengeModalTemplate: TemplateRef<any>;

  @ViewChild('challengingModal')
  private challengingModalTemplate: TemplateRef<any>;

  @ViewChild('challengedModal')
  private challengedModalTemplate: TemplateRef<any>;

  private startMatchModal: NgbModalRef;
  private waitingModal: NgbModalRef;
  private challengeModal: NgbModalRef;
  private challengingModal: NgbModalRef;
  private challengedModal: NgbModalRef;

  constructor(
    private userService: UserService, 
    private socketService: SocketService,
    private config: NgbModalConfig,
    private modalService: NgbModal,
    private gameService: GameService,
    private notificationService: NotificationService,
    private httpService: HttpService,
    private router: Router
  ) {}

  ngOnInit() {
    this.username = this.userService.getAuthenticated().username;
    this.socket = this.socketService.connect();
    this.socket.on('artemisia.startedMatch', match => { this.startedMatch(match) })
    this.socket.on('artemisia.newChallenge', challenge => { this.newChallenge(challenge) })
    this.socket.on('artemisia.canceledChallenge', () => { this.canceledChallenge() })
    this.socket.on('artemisia.refusedChallenge', () => { this.refusedChallenge() })
  }

  private startedMatch(match) {
    console.log(match)
    this.modalService.dismissAll()
    this.router.navigateByUrl(`/game/preparation/${match._id}`)
  }

  private newChallenge(challenge) {
    this.modalService.dismissAll()
    this.challengerUsername = challenge.challengerUsername
    this.configStaticModal()
    this.challengedModal = this.modalService.open(this.challengedModalTemplate)
  }

  private canceledChallenge() {
    this.modalService.dismissAll()
    this.resetModalConfig()
    this.notificationService.danger('O jogador cancelou o desafio.')
  }

  private refusedChallenge() {
    this.modalService.dismissAll()
    this.resetModalConfig()
    this.notificationService.danger('O jogador recusou o desafio.')
  }

  openStartMatchModal() {
    this.startMatchModal = this.modalService.open(this.startMatchModalTemplate)
  }

  private configStaticModal() {
    this.config.backdrop = 'static';
  }

  private resetModalConfig() {
    this.config.backdrop = true;
  }

  private openWaitingModal() {
    this.configStaticModal()
    this.waitingModal = this.modalService.open(this.waitingModalTemplate)
  }

  challenge() {
    this.startMatchModal.close()
    this.challengeModal = this.modalService.open(this.challengeModalTemplate)
  }

  find() {
    this.finding = true
    this.gameService.find().subscribe(resp => {
      this.finding = false
      this.startedMatch(resp)
    }, error => {
      this.finding = false
      if (error.status === 404) {
        this.startMatchModal.close()
        this.openWaitingModal()
      } else {
        this.httpService.HttpErrorHandler(error);
      }
    })
  }

  cancelMatch() {
    this.canceling = true;
    this.gameService.cancel().subscribe(resp => {
      this.canceling = false;
      this.waitingModal.close();
      this.resetModalConfig();
      this.notificationService.success('A procura por um jogador foi cancelada.')
    }, error => {
      this.canceling = false;
      this.httpService.HttpErrorHandler(error);
    })
  }

  challengeSubmit() {
    this.challenging = true
    this.gameService.challenge(this.challengeForm.get('login').value).subscribe(resp => {
      this.challenging = false
      this.challengeModal.close()
      this.configStaticModal()
      this.openChallengingModal()
    }, error => {
      this.challenging = false
      this.challengeModal.close()
      this.httpService.HttpErrorHandler(error)
    })
  }

  private openChallengingModal() {
    this.challengingModal = this.modalService.open(this.challengingModalTemplate)
  }

  cancelChallenge() {
    this.canceling = true
    this.gameService.cancelChallenge().subscribe(resp => {
      this.canceling = false
      this.challengingModal.close()
      this.notificationService.success('O desafio foi cancelado com sucesso.')
    }, error => {
      this.canceling = false
      this.challengingModal.close()
      this.httpService.HttpErrorHandler(error)
    })
  }

  refuseChallenge() {
    this.canceling = true
    this.gameService.cancelChallenge().subscribe(resp => {
      this.canceling = false
      this.challengedModal.close()
      this.notificationService.success('O desafio foi recusado com sucesso.')
    }, error => {
      this.canceling = false
      this.challengedModal.close()
      this.httpService.HttpErrorHandler(error)
    })
  }

  acceptChallenge() {
    this.accepting = true
    this.gameService.acceptChallenge().subscribe(resp => {
      this.accepting = false
      this.startedMatch(resp)
    }, error => {
      this.accepting = false
      this.challengedModal.close()
      this.httpService.HttpErrorHandler(error)
    })
  }

  closeModalAdvertisement() {
    const modalOverlay = document.querySelector('.modal-overlay');
    document.querySelector(".close-modal-advertisement").addEventListener("click", function() {
      modalOverlay.classList.remove("active");
    })
  }
} 
