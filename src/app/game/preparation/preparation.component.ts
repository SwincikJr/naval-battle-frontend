import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from 'src/app/shared/services/game.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'preparation-component',
  templateUrl: './preparation.component.html',
  styleUrls: ['./preparation.component.css']
})
export class PreparationComponent implements OnInit {

  gameInfo: any = null;
  rows = [];
  columns = [];
  vessels = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private notification: NotificationService,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
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
      }, error => {
        this.httpService.HttpErrorHandler(error)
        this.router.navigateByUrl('/home')
      })
    })
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
      event.preventDefault()
      let data = event.dataTransfer.getData("vessel-drag");
      const vessel = document.getElementById(data)

      const vesselIdArray = vessel.id.split('-')
      const vesselId = vesselIdArray[1]
      console.log(vesselId)
      const vesselMap = this.vessels.find(v => v.id === vesselId).map

      for (const map of vesselMap) {
        if (i + map.row > this.rows.length - 1 || j + map.column > this.columns.length - 1) return
      }
      
      vessel.setAttribute('draggable', 'false')
      vessel.childNodes.forEach(vesselChildren => {
        vesselChildren.childNodes.forEach((vesselCoordinate: any) => {
          if (typeof vesselCoordinate.setAttribute === 'function') 
            vesselCoordinate.setAttribute('style', '')
        })
      })

      const clearVessel = clickEvent => {
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
    if (isInPaintableCoordinates) return 'background-color: blue'
    return ''
  }
}
