import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { UserService } from 'src/app/home/services/user';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: "root",
})
export class GameService {

    public readonly baseEndpoint: string = `${environment.urlApi}/game`;
    public readonly boardEndpoint: string = `${environment.urlApi}/board`;

    constructor(
        private httpClient: HttpClient,
        private userService: UserService
    ) {}

    private getHeader()  {
        const token = this.userService.getAuthenticated().token
        const auth = `Bearer ${token}`
        return {
            'Authorization': auth
        }
    }

    find() {
        return this.httpClient.post(`${this.baseEndpoint}/find`, null, { headers: this.getHeader() });
    }

    cancel() {
        return this.httpClient.post(`${this.baseEndpoint}/cancel`, null, { headers: this.getHeader() });
    }

    challenge(login) {
        return this.httpClient.post(`${this.baseEndpoint}/challenge`, { login }, { headers: this.getHeader() });
    }

    cancelChallenge() {
        return this.httpClient.delete(`${this.baseEndpoint}/challenge`, { headers: this.getHeader() });
    }

    acceptChallenge() {
        return this.httpClient.put(`${this.baseEndpoint}/challenge`, null, { headers: this.getHeader() });
    }

    getInfo(MatchId) {
        return this.httpClient.get(`${this.baseEndpoint}/info/${MatchId}`, { headers: this.getHeader() });
    }

    confirmStartPositions(body) {
        return this.httpClient.post(`${this.boardEndpoint}`, body, { headers: this.getHeader() });
    }

    getBattle(matchId) {
        return this.httpClient.get(`${this.baseEndpoint}/battle/${matchId}`, { headers: this.getHeader() });
    }

    attack(matchId, row, column) {
        return this.httpClient.put(`${this.baseEndpoint}/battle/${matchId}`, { row, column }, { headers: this.getHeader() })
    }

    giveUp(matchId) {
        return this.httpClient.post(`${this.baseEndpoint}/giveup/${matchId}`, null, { headers: this.getHeader() })
    }
}
