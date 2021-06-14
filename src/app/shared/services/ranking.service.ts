
import { Injectable } from '@angular/core';
import { HttpClient,HttpResponse } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/home/services/user';
import { environment } from '../../../environments/environment';
import { UserScore } from 'src/app/shared/interfaces/score';
import { Ranking } from 'src/app/shared/interfaces/ranking';

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  public url = `${environment.urlApi}`;

constructor(private httpClient: HttpClient, private userService: UserService)
 { }


    public getScores(): Observable <Ranking> {
        return this.httpClient.get<Ranking>(`${this.url}/ranking/`, { headers: this.getHeader() });
    }

    private getHeader()  {
        const token = this.userService.getAuthenticated().token;
        const auth = `Bearer ${token}`;
        return {
            Authorization: auth
        };
    }
}
