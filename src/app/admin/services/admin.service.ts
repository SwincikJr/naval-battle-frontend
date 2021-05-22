import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Admin {
    username: string,
    token: string
}

@Injectable({
    providedIn: "root",
})
export class AdminService {

    private authenticated: Admin = null

    public games = []

    public readonly url = `${environment.urlApi}/admin`

    constructor(private http: HttpClient) { 
        const authenticated = localStorage.getItem('artemisia_admin')
        if (authenticated) {
            try {
                this.authenticated = JSON.parse(authenticated)
            } catch (error) {
                console.error(error)
            }
        }
    }

    private header() {
        return {
            'Authorization': `Bearer ${this.authenticated.token}`
        }
    }

    authenticate(username, password): Observable<Admin> {
        return this.http.post<Admin>(`${this.url}/authenticate`, { username, password })
    }

    setAuthenticated(admin: Admin): void {
        this.authenticated = admin
        localStorage.setItem('artemisia_admin', JSON.stringify(this.authenticated))
    }

    getAuthenticated(): Admin {
        return this.authenticated
    }

    isAuthenticated(): boolean {
        return !!this.authenticated
    }

    listGames() {
        return this.http.get(`${this.url}/games`, { headers: this.header() })
    }

    createGame(game) {
        return this.http.post(`${this.url}/game`, game, { headers: this.header() })
    }

    updateGame(_id, game) {
        return this.http.put(`${this.url}/game/${_id}`, game, { headers: this.header() })
    }

    deleteGame(_id) {
        return this.http.delete(`${this.url}/game/${_id}`, { headers: this.header() })
    }

    logoff() {
        localStorage.removeItem('artemisia_admin')
        this.authenticated = null
    }
}
