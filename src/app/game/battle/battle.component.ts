import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbConfig, NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GameService } from 'src/app/shared/services/game.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { SocketService } from 'src/app/shared/services/socket.service';

@Component({
  selector: 'battle-component',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.css']
})
export class BattleComponent implements OnInit, OnDestroy {

  socket = null;
  matchId = '';
  vessels = [];
  opponentVessels = [];
  rows = 0;
  columns = 0;
  rowsArray = [];
  columnsArray = [];
  moving = false;
  attackedCoordinates = [];
  opponentAttackedCoordinates = [];
  attackedCoordinate = '';
  coins = 0;
  score = 0;
  givingUp = false;
  rightShotCount = 3;
  executingRightShot = false;

  @ViewChild('yourTurnModal')
  private yourTurnModalTemplate: TemplateRef<any>;

  @ViewChild('opponentTurnModal')
  private opponentTurnModalTemplate: TemplateRef<any>;

  @ViewChild('bombOnAttackModal')
  private bombOnAttackModalTemplate: TemplateRef<any>;

  @ViewChild('waterOnAttackModal')
  private waterOnAttackModalTemplate: TemplateRef<any>;

  @ViewChild('sankOnAttackModal')
  private sankOnAttackModalTemplate: TemplateRef<any>;

  @ViewChild('bombOnAttackedModal')
  private bombOnAttackedModalTemplate: TemplateRef<any>;

  @ViewChild('waterOnAttackedModal')
  private waterOnAttackedModalTemplate: TemplateRef<any>;

  @ViewChild('sankOnAttackedModal')
  private sankOnAttackedModalTemplate: TemplateRef<any>;

  @ViewChild('victoryModal')
  private victoryModalTemplate: TemplateRef<any>;

  @ViewChild('defeatModal')
  private defeatModalTemplate: TemplateRef<any>;

  @ViewChild('giveUpModal')
  private giveUpModalTemplate: TemplateRef<any>;

  @ViewChild('defeatByWithdrawalModal')
  private defeatByWithdrawalModalTemplate: TemplateRef<any>;

  @ViewChild('victoryByWithdrawalModal')
  private victoryByWithdrawalModalTemplate: TemplateRef<any>;

  @ViewChild('rightShotModal')
  private rightShotModalTemplate: TemplateRef<any>;

  private yourTurnModal: NgbModalRef;
  private opponentTurnModal: NgbModalRef;
  private bombOnAttackModal: NgbModalRef;
  private waterOnAttackModal: NgbModalRef;
  private sankOnAttackModal: NgbModalRef;
  private bombOnAttackedModal: NgbModalRef;
  private waterOnAttackedModal: NgbModalRef;
  private sankOnAttackedModal: NgbModalRef;
  private victoryModal: NgbModalRef;
  private defeatModal: NgbModalRef;
  private giveUpModal: NgbModalRef;
  private defeatByWithdrawalModal: NgbModalRef;
  private victoryByWithdrawalModal: NgbModalRef;
  private rightShotModal: NgbModalRef;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private modalService: NgbModal,
    private socketService: SocketService,
    private httpService: HttpService,
    private config: NgbModalConfig,
    private router: Router  
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.matchId = params.id
      this.gameService.getBattle(this.matchId).subscribe((resp: any) => {
        console.log(resp)
        this.rightShotCount = resp.diamonds < resp.yourBoard.rightShot ? resp.diamonds : resp.yourBoard.rightShot
        this.attackedCoordinates = resp.yourBoard.attackedCoordinates
        this.opponentAttackedCoordinates = resp.opponentBoard.attackedCoordinates
        this.vessels = resp.yourBoard.vessels
        this.opponentVessels = resp.opponentBoard.vessels
        this.rows = resp.yourBoard.rows
        this.columns = resp.yourBoard.columns
        this.rowsArray = new Array(this.rows + 1)
        this.columnsArray = new Array(this.columns + 1)
        this.moving = resp.moving
        this.playSound('battle')
        if (this.moving) {
          this.openYourTurnModal()
        } else {
          this.openOpponentTurnModal()
        }
        this.socket = this.socketService.connect();
        this.socket.on('artemisia.attack', data => { this.attackEvent(data) })
        this.socket.on('artemisia.victory', data => { this.victoryEvent(data) })
      }, error => {
        console.log(error)
      })
    })
  }

  ngOnDestroy() {
    this.socket.disconnect()
  }

  victoryEvent(data) {
    this.playSound('victory')
    this.closeAllModal()
    this.coins = data.coins
    this.score = data.score
    this.configStaticModal()
    this.victoryByWithdrawalModal = this.modalService.open(this.victoryByWithdrawalModalTemplate)
  }

  attackEvent(data) {
    console.log(data)
    const coordinate = document.getElementById(`myboard-${data.row}-${data.column}`)
    
    this.closeAllModal()
    this.attackedCoordinate = `${String.fromCharCode(65 + parseInt(data.row))} - ${parseInt(data.column) + 1}`

    if (data.hit) {

      if (data.defeat) {
        this.playSound('defeat')
        this.openDefeatModal()
      } else if (data.sanked) {
        this.playSound('bomb')
        this.openSankOnAttackedModal()
      } else {
        this.playSound('bomb')
        this.openBombOnAttackedModal()
      }

      coordinate.setAttribute('class', 'coordinate destroyed')

    } else {
      this.playSound('water')
      coordinate.setAttribute('class', 'coordinate attacked')
      this.openWaterOnAttackedModal()
      this.startMove()
    }
  }

  clickEvent = event => {
    Array.from(document.getElementsByClassName('coordinate opponent empty hoverble')).forEach(node => {
      node.setAttribute('class', 'coordinate opponent empty')
      node.removeEventListener('click', this.clickEvent)
    })
    const idArray = event.target.id.split('-')
    const row = idArray[0]
    const column = idArray[1]
    this.gameService.attack(this.matchId, row, column).subscribe((resp: any) => {
      
      this.closeAllModal()

      this.attackedCoordinate = `${String.fromCharCode(65 + parseInt(row))} - ${parseInt(column) + 1}`

      if (resp.hit) {

        if (resp.victory) {
          
          this.coins = resp.coins
          this.score = resp.score

          this.openVictoryModal()
          this.playSound('victory')

        } else if (resp.sanked) {

          this.openSankOnAttackModal()
          this.playSound('bomb')
        
        } else {
          this.openBombOnAttackModal()
          this.playSound('bomb')
        }

        event.target.setAttribute('class', 'coordinate opponent-not-empty')
        this.startMove()

      } else {
        this.playSound('water')
        event.target.setAttribute('class', 'coordinate opponent-attacked')
        this.openWaterOnAttackModal()
      }

    }, error => {
      this.httpService.HttpErrorHandler(error)
    })
  }

  private configStaticModal() {
    this.config.backdrop = 'static';
  }

  private resetModalConfig() {
    this.config.backdrop = true;
  }

  private closeAllModal() {
    if (this.yourTurnModal) this.closeYourTurnModal()
    if (this.opponentTurnModal) this.closeOpponentTurnModal()
    if (this.bombOnAttackModal) this.closeBombOnAttackModal()
    if (this.waterOnAttackModal) this.closeWaterOnAttackModal()
    if (this.sankOnAttackModal) this.closeSankOnAttackModal()
    if (this.bombOnAttackedModal) this.closeBombOnAttackedModal()
    if (this.waterOnAttackedModal) this.closeWaterOnAttackedModal()
    if (this.sankOnAttackedModal) this.closeSankOnAttackedModal()
    if (this.rightShotModal) this.closeRightShotModal()
  }

  goToHome() {
    this.resetModalConfig()
    if (this.victoryModal) this.closeVictoryModal()
    if (this.defeatModal) this.closeDefeatModal()
    if (this.victoryByWithdrawalModal) this.victoryByWithdrawalModal.close()
    if (this.defeatByWithdrawalModal) this.defeatByWithdrawalModal.close()
    this.router.navigateByUrl('/home')
  }

  openRightShotModal() {
    this.rightShotModal = this.modalService.open(this.rightShotModalTemplate)
  }

  closeRightShotModal() {
    this.rightShotModal.close()
  }

  openVictoryModal() {
    this.configStaticModal()
    this.victoryModal = this.modalService.open(this.victoryModalTemplate)
  }

  closeVictoryModal() {
    this.resetModalConfig()
    this.victoryModal.close()
  }

  openDefeatModal() {
    this.configStaticModal()
    this.defeatModal = this.modalService.open(this.defeatModalTemplate)
  }

  closeDefeatModal() {
    this.resetModalConfig()
    this.defeatModal.close()
  }

  openSankOnAttackModal() {
    this.sankOnAttackModal = this.modalService.open(this.sankOnAttackModalTemplate)
  }

  closeSankOnAttackModal() {
    this.sankOnAttackModal.close()
  }

  openSankOnAttackedModal() {
    this.configStaticModal()
    this.sankOnAttackedModal = this.modalService.open(this.sankOnAttackedModalTemplate)
  }

  closeSankOnAttackedModal() {
    this.resetModalConfig()
    this.sankOnAttackedModal.close()
  }

  openWaterOnAttackModal() {
    this.configStaticModal()
    this.waterOnAttackModal = this.modalService.open(this.waterOnAttackModalTemplate)
  }

  closeWaterOnAttackModal() {
    this.resetModalConfig()
    this.waterOnAttackModal.close()
  }

  openWaterOnAttackedModal() {
    this.waterOnAttackedModal = this.modalService.open(this.waterOnAttackedModalTemplate)
  }

  closeWaterOnAttackedModal() {
    this.waterOnAttackedModal.close()
  }

  openBombOnAttackModal() {
    this.bombOnAttackModal = this.modalService.open(this.bombOnAttackModalTemplate)
  }

  closeBombOnAttackModal() {
    this.bombOnAttackModal.close()
  }

  openBombOnAttackedModal() {
    this.configStaticModal()
    this.bombOnAttackedModal = this.modalService.open(this.bombOnAttackedModalTemplate)
  }

  closeBombOnAttackedModal() {
    this.resetModalConfig()
    this.bombOnAttackedModal.close()
  }

  startMove() {
    Array.from(document.getElementsByClassName('coordinate opponent empty')).forEach(node => {
      node.setAttribute('class', node.className + ' hoverble')
      node.addEventListener('click', this.clickEvent)
    })
  }

  openYourTurnModal() {
    this.yourTurnModal = this.modalService.open(this.yourTurnModalTemplate)
  }

  closeYourTurnModal() {
    this.yourTurnModal.close()
    this.yourTurnModal = null
    this.startMove()
  }

  openOpponentTurnModal() {
    this.configStaticModal()
    this.opponentTurnModal = this.modalService.open(this.opponentTurnModalTemplate)
  }

  closeOpponentTurnModal() {
    this.resetModalConfig()
    this.opponentTurnModal.close()
    this.opponentTurnModal = null
  }

  getHeightOfBoard() {
    return `height: ${this.rowsArray.length * 28}px;`
  }

  getRowStyle() {
    return `clear: both; width: ${this.columnsArray.length * 28}px;`
  }

  hasVesselOnCoordinate(i, j) {
    return this.vessels.find(v => {
      return !!v.coordinates.find(c => {
        return c.column === j && c.row === i
      })
    })
  }

  hasVesselOnOpponentCoordinate(i, j) {
    return this.opponentVessels.find(v => {
      return !!v.coordinates.find(c => {
        return c.column === j && c.row === i
      })
    })
  }

  getClassNameOfCoordinate(i, j, opponent = false) {
    if (i == 0 && j == 0) return 'coordinate'
    if (i > 0 && j == 0) return 'coordinate row-indicator'
    if (i == 0 && j > 0) return 'coordinate column-indicator'
    if (opponent) {
      if (this.hasVesselOnOpponentCoordinate(i - 1, j - 1)) return 'coordinate opponent-not-empty'
      if (this.opponentAttackedCoordinates.find(c => c.row == i - 1 && c.column == j - 1)) return 'coordinate opponent-attacked' 
      return 'coordinate opponent empty'
    } else {
      const vessel = this.hasVesselOnCoordinate(i - 1, j - 1)
      const attacked = this.attackedCoordinates.find(c => c.row == i - 1 && c.column == j - 1)
      if (!vessel && !attacked) return 'coordinate empty'
      if (vessel && vessel.coordinates.find(c => c.row == i - 1 && c.column == j - 1 && c.destroyed)) return 'coordinate destroyed'
      if (attacked) return 'coordinate attacked'
      return 'coordinate not-empty'
    }
  }

  getBoardLabel(i, j) {
    if (i === 0 && j > 0) return j
    if (i > 0 && j === 0) return String.fromCharCode(65 + i - 1)
    return ''
  }

  giveUp() {
    this.giveUpModal = this.modalService.open(this.giveUpModalTemplate)
  }

  cancelGiveUp() {
    this.giveUpModal.close()
    this.giveUpModal = null
  }

  confirmGiveUp() {
    this.givingUp = true
    this.gameService.giveUp(this.matchId).subscribe(resp => {
      this.givingUp = false
      this.playSound('defeat')
      this.cancelGiveUp()
      this.configStaticModal()
      this.defeatByWithdrawalModal = this.modalService.open(this.defeatByWithdrawalModalTemplate)
    }, error => {
      this.givingUp = false
      this.httpService.HttpErrorHandler(error)
    })
  }

  confirmRightShot() {
    this.executingRightShot = true;
    this.gameService.rightShot(this.matchId).subscribe((resp: any) => {

      this.executingRightShot = false;
      this.closeAllModal()

      this.attackedCoordinate = `${String.fromCharCode(65 + parseInt(resp.row))} - ${parseInt(resp.column) + 1}`

      if (resp.victory) {
        
        this.coins = resp.coins
        this.score = resp.score

        this.playSound('victory')
        this.openVictoryModal()

      } else if (resp.sanked) {

        this.openSankOnAttackModal()
        this.playSound('bomb')
      
      } else {
        this.openBombOnAttackModal()
        this.playSound('bomb')
      }

      this.rightShotCount = this.rightShotCount - 1

      document.getElementById(`${resp.row}-${resp.column}`)
      document.getElementById(`${resp.row}-${resp.column}`).setAttribute('class', 'coordinate opponent-not-empty')
      this.startMove()

    }, error => {

      this.executingRightShot = false;;
      this.closeRightShotModal()
      this.rightShotCount = 0
      this.httpService.HttpErrorHandler(error)
    })
  }

  playSound(effect) {

    const sounds = {
      bomb: 'bomb.wav',
      water: 'water.wav',
      battle: 'battle.wav',
      victory: 'victory.wav',
      defeat: 'defeat.mp3'
    }

    const audio = new Audio()
    audio.src = `../../../assets/sounds/${sounds[effect]}`
    audio.load()
    audio.play()
  }
}
