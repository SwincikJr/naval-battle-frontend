import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GameService } from 'src/app/shared/services/game.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SocketService } from 'src/app/shared/services/socket.service';

@Component({
  selector: 'preparation-component',
  templateUrl: './preparation.component.html',
  styleUrls: ['./preparation.component.css']
})
export class PreparationComponent implements OnInit, OnDestroy {

  gameInfo: any = null;
  rows = [];
  columns = [];
  vessels = [];
  startPositions = [];
  loading = false;
  matchId = '';
  waiting = false;
  socket = null;

  @ViewChild('waitModal')
  private waitModalTemplate: TemplateRef<any>;

  private waitModal: NgbModalRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private httpService: HttpService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.matchId = params.id
      this.gameService.getInfo(params.id).subscribe((resp: any) => {
        this.gameInfo = resp
        this.rows = new Array(resp.rowBoard + 1)
        this.columns = new Array(resp.columnBoard + 1)
        resp.playableVessels.forEach(v => {
          for (let index = 0; index < v.amountPerPlayer; index++) {
            this.vessels.push({
              id: v.id,
              label: v.label,
              map: v.map
            })
          }
        })
        this.socket = this.socketService.connect();
        this.socket.on('artemisia.opponentReady', () => { this.startMatch() })
      }, error => {
        this.httpService.HttpErrorHandler(error)
        this.router.navigateByUrl('/home')
      })
    })
  }

  ngOnDestroy() {
    this.socket.disconnect()
  }

  startMatch() {
    if (this.waiting) {
      this.waitModal.close()
      this.goToBattle()
    }
  }

  goToBattle() {
    this.router.navigateByUrl(`game/battle/${this.matchId}`)
  }

  getClassByCoordinate(i, j) {
    if (i === 0 && j === 0) return ''
    if (i === 0 && j > 0) return 'column-address'
    if (i > 0 && j === 0) return 'row-address'
    if (i > 0 && j > 0) return 'playable-coordinate'
  }

  getCoordinateContent(i, j) {
    if (i === 0 && j > 0) return j
    if (i > 0 && j === 0) return String.fromCharCode(65 + i - 1)
    return ''
  }

  allowDrop(event, i, j) {
    if (i > 0 && j > 0) {
      event.preventDefault()
    }
  }

  drag(event) {
    event.dataTransfer.setData("vessel-drag", event.target.id);
  }

  drop(event, i, j) {
    if (i > 0 && j > 0) {

      const notEmptyPositions = Array.from(document.getElementsByClassName('coordinate-not-empty'))

      const isFreePosition = (row, column) => {
        return !notEmptyPositions.find(p => {
          return p.id === `${row-1}-${column-1}`
            || p.id === `${row-2}-${column-1}`
            || p.id === `${row}-${column-1}`
            || p.id === `${row-1}-${column-2}`
            || p.id === `${row-1}-${column}`
        })
      }

      if (!isFreePosition(i, j)) return

      event.preventDefault()
      let data = event.dataTransfer.getData("vessel-drag");
      const vessel = document.getElementById(data)

      const vesselIdArray = vessel.id.split('-')
      const vesselId = vesselIdArray[1]
      console.log(vesselId)
      const vesselMap = this.vessels.find(v => v.id === vesselId).map

      for (const map of vesselMap) {
        if (i + map.row > this.rows.length - 1 || j + map.column > this.columns.length - 1) return
        if (!isFreePosition(i + map.row, j + map.column)) return
      }

      this.startPositions.push({
        id: vesselId,
        startPosition: {
          row: i - 1,
          column: j - 1
        }
      })
      
      vessel.setAttribute('draggable', 'false')
      vessel.childNodes.forEach(vesselChildren => {
        vesselChildren.childNodes.forEach((vesselCoordinate: any) => {
          if (typeof vesselCoordinate.setAttribute === 'function') 
            vesselCoordinate.setAttribute('style', '')
        })
      })

      const clearVessel = clickEvent => {

        const startPosition = this.startPositions.find(s => {
          return s.id === vesselId 
            && s.startPosition.row === i - 1
            && s.startPosition.column === j - 1
        })

        const startPositionIndex = this.startPositions.indexOf(startPosition)

        this.startPositions.splice(startPositionIndex, 1)

        event.target.setAttribute('class', 'board-coordinate ' + this.getClassByCoordinate(i, j))
        event.target.onclick = null
        vesselMap.forEach(m => {
          const nextCoordinate = document.getElementById(`${i - 1 + m.row}-${j - 1 + m.column}`)
          nextCoordinate.setAttribute('class', 'board-coordinate ' + this.getClassByCoordinate(i + m.row, j + m.column))
          nextCoordinate.onclick = clearVessel
        })
        vessel.setAttribute('draggable', 'true')
        vessel.childNodes.forEach((vesselChildren, row_index) => {
          vesselChildren.childNodes.forEach((vesselCoordinate: any, column_index) => {
            if (typeof vesselCoordinate.setAttribute === 'function') 
              vesselCoordinate.setAttribute('style', this.getStyleOfVessel(row_index, column_index, vesselMap))
          })
        })
      }

      event.target.setAttribute('class', 'board-coordinate coordinate-not-empty')
      event.target.onclick = clearVessel

      vesselMap.forEach(m => {
        const nextCoordinate = document.getElementById(`${i - 1 + m.row}-${j - 1 + m.column}`)
        nextCoordinate.setAttribute('class', 'board-coordinate coordinate-not-empty')
        nextCoordinate.onclick = clearVessel
      })
    }
  }

  getCoordinateId(i, j) {
    if (i > 0 && j > 0) return `${i - 1}-${ j - 1 }`
  }

  getRowsNumberOfMap(map) {
    if (map.length === 0) return new Array(1)
    const rows = map.map(m => m.row)
    const max = Math.max(...rows)
    const min = Math.min(...rows)
    const length = max - min + 1
    return new Array(length)
  }

  getColumnsNumberOfMap(map) {
    return new Array(map.length + 1)
  }

  getStyleOfVessel(row_index, column_index, map) {
    const minRow = map.length ? Math.min(...map.map(m => m.row)) : 0
    const startRow = 0 - minRow
    const paintableCoordinates = [
      { row: startRow, column: 0 },
      ...map.map(m => {
        return {
          row: startRow + m.row,
          column: 0 + m.column
        }
      })
    ]
    const isInPaintableCoordinates = paintableCoordinates.find(c => {
      return c.row === row_index && c.column === column_index
    })
    if (isInPaintableCoordinates) return `background-color:#ED8F03;
                                          border: 1px solid black;
                                          border-radius: 4px;
                                          cursor: pointer;`;
    return 'background: none; border: none;'
  }

  confirmStartPositions() {
    this.loading = true
    const body = {
      MatchId: this.matchId,
      maritmeSpace: this.startPositions
    }
    this.gameService.confirmStartPositions(body).subscribe((resp: any) => {
      this.loading = false
      if (resp.wait) {
        this.waiting = true;
        this.config.backdrop = 'static';
        this.waitModal = this.modalService.open(this.waitModalTemplate)
      } else {
        this.goToBattle()
      }
    }, error => {
      this.loading = false
      this.httpService.HttpErrorHandler(error)
    })
  }
}
