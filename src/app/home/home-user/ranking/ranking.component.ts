
import { Ranking } from './../../../shared/interfaces/ranking';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { UserScore } from './../../../shared/interfaces/score';
import { RankingService } from './../../../shared/services/ranking.service';
import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';


@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  rank: any;
  nome: string;

  constructor( private rankingService: RankingService ) {}

   defineIcon(i: number): number{
     if (i <= 3){
       return i;
     }
     else {
       return 0;
     }

   }

  ngOnInit(): void {
    this.rankingService.getScores().subscribe(ranking => { 
      this.rank = ranking.ranking.map((r, i) => {
        r.pos = i + 1
        return r
      })
    });

  }
}
