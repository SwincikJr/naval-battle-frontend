import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'admin-game-component',
  templateUrl: './admin-game.component.html',
  styleUrls: ['./admin-game.component.css']
})
export class AdminGameComponent implements OnInit {

  loading = false
  editing = false
  id = ''

  gameForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    label: new FormControl('', [Validators.required]),
    rowBoard: new FormControl('', [Validators.required, Validators.min(3)]),
    columnBoard: new FormControl('', [Validators.required, Validators.min(3)]),
    playableVessels: new FormArray([
      new FormGroup({
        id: new FormControl('', [Validators.required]),
        label: new FormControl('', [Validators.required]),
        amountPerPlayer: new FormControl('', [Validators.required, Validators.min(1)]),
        map: new FormArray([
          new FormGroup({
            row: new FormControl('', [Validators.required]),
            column: new FormControl('', [Validators.required])
          })
        ])
      })
    ], [Validators.minLength(1)])
  })

  vessels = this.gameForm.get('playableVessels') as FormArray

  constructor(
    private route: ActivatedRoute,
    public adminService: AdminService,
    private httpService: HttpService,
    private notification: NotificationService,
    private router: Router
  ) { }

  getMapOfVessel(vessel: FormGroup) {
    return vessel.get('map') as FormArray
  }

  addPlayableVessel() {
    const playableVesselsForm = this.gameForm.get('playableVessels') as FormArray
    const playableVessel = new FormGroup({
      id: new FormControl('', [Validators.required]),
        label: new FormControl('', [Validators.required]),
        amountPerPlayer: new FormControl('', [Validators.required, Validators.min(1)]),
        map: new FormArray([
          new FormGroup({
            row: new FormControl('', [Validators.required]),
            column: new FormControl('', [Validators.required])
          })
        ])
    }, [Validators.minLength(1)])
    playableVesselsForm.push(playableVessel)
    return playableVessel
  }

  addMapOnVessel(vessel: FormGroup) {
    const mapFormArray = vessel.get('map') as FormArray
    const map = new FormGroup({
      row: new FormControl('', [Validators.required]),
      column: new FormControl('', [Validators.required])
    })
    mapFormArray.push(map)
    return map
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.id !== 'new') {
        const game = this.adminService.games.find(g => g._id === params.id)
        if (!game) return this.router.navigateByUrl('/admin')
        this.loadGameForm(game)
        this.editing = true
        this.id = game._id
      }
    })
  }

  private loadGameForm(game) {
    this.gameForm.get('id').setValue(game.id)
    this.gameForm.get('id').disable()
    this.gameForm.get('label').setValue(game.label)
    this.gameForm.get('columnBoard').setValue(game.columnBoard)
    this.gameForm.get('rowBoard').setValue(game.rowBoard)
    const playableVessels = this.gameForm.get('playableVessels') as FormArray
    playableVessels.removeAt(0)
    game.playableVessels.forEach(v => {
      const vessel = this.addPlayableVessel()
      vessel.get('id').setValue(v.id)
      vessel.get('label').setValue(v.label)
      vessel.get('amountPerPlayer').setValue(v.amountPerPlayer.toString())
      const mapFormArray = vessel.get('map') as FormArray
      mapFormArray.removeAt(0)
      v.map.forEach(m => {
        const map = this.addMapOnVessel(vessel)
        map.get('row').setValue(m.row.toString())
        map.get('column').setValue(m.column.toString())
      })
    })
    console.log(this.gameForm)
  }

  onSubmit() {

    const payload = this.gameForm.getRawValue()

    const successHandler = _ => {
      this.loading = false
      this.notification.success('Modalidade cadastrada com sucesso!')
      this.router.navigateByUrl('/admin')
    }

    const errorHandler = error => {
      this.loading = false
      this.httpService.HttpErrorHandler(error)
    }

    this.loading = true

    if (this.editing) {
      this.adminService.updateGame(this.id, payload)
        .subscribe(successHandler, errorHandler)
    } else {
      this.adminService.createGame(payload)
        .subscribe(successHandler, errorHandler)
    }
  }

  removeMapOnVessel(vessel, index) {
    const mapFormArray = vessel.get('map') as FormArray
    mapFormArray.removeAt(index)
  }

  removeVessel(index) {
    const playableVessels = this.gameForm.get('playableVessels') as FormArray
    playableVessels.removeAt(index)
  }
}
