import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GameService } from 'src/app/shared/services/game.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { SocketService } from 'src/app/shared/services/socket.service';

@Component({
  selector: 'battle-component',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.css']
})
export class BattleComponent implements OnInit {

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

  @ViewChild('yourTurnModal')
  private yourTurnModalTemplate: TemplateRef<any>;

  @ViewChild('opponentTurnModal')
  private opponentTurnModalTemplate: TemplateRef<any>;

  private yourTurnModal: NgbModalRef;
  private opponentTurnModal: NgbModalRef;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private modalService: NgbModal,
    private socketService: SocketService,
    private httpService: HttpService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.matchId = params.id
      this.gameService.getBattle(this.matchId).subscribe((resp: any) => {
        console.log(resp)
        this.attackedCoordinates = resp.yourBoard.attackedCoordinates
        this.opponentAttackedCoordinates = resp.opponentBoard.attackedCoordinates
        this.vessels = resp.yourBoard.vessels
        this.opponentVessels = resp.opponentBoard.vessels
        this.rows = resp.yourBoard.rows
        this.columns = resp.yourBoard.columns
        this.rowsArray = new Array(this.rows + 1)
        this.columnsArray = new Array(this.columns + 1)
        this.moving = resp.moving
        if (this.moving) {
          this.openYourTurnModal()
        } else {
          this.openOpponentTurnModal()
        }
        this.socket = this.socketService.connect();
        this.socket.on('artemisia.attack', data => { this.attackEvent(data) })
      }, error => {
        console.log(error)
      })
    })
  }

  attackEvent(data) {
    console.log(data)
    const coordinate = document.getElementById(`myboard-${data.row}-${data.column}`)
    if (coordinate && data.hit) coordinate.setAttribute('class', 'coordinate destroyed')
    else coordinate.setAttribute('class', 'coordinate attacked')
    this.openYourTurnModal()
    this.startMove()
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
      
      if (resp.hit) {
        event.target.setAttribute('class', 'coordinate opponent-not-empty')
      } else {
        event.target.setAttribute('class', 'coordinate opponent-attacked')
      }

      this.openOpponentTurnModal()
    }, error => {
      this.httpService.HttpErrorHandler(error)
    })
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
    this.startMove()
  }

  openOpponentTurnModal() {
    this.opponentTurnModal = this.modalService.open(this.opponentTurnModalTemplate)
  }

  closeOpponentTurnModal() {
    this.opponentTurnModal.close()
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
}
