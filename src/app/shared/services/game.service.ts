import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { UserService } from 'src/app/home/services/user';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: "root",
})
export class GameService {
    
    public readonly baseEndpoint: string = `${environment.urlApi}/game`;

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
}
