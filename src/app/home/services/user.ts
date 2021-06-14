import { Injectable } from '@angular/core'
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { User } from '../../shared/interfaces/user';

@Injectable({
    providedIn: "root",
})
export class UserService {

    public readonly url = `${environment.urlApi}`;
    private authenticated: User = null;

    constructor(private http: HttpClient) {
        this.loadAuthenticatedByLocalStorage();
    }

    private loadAuthenticatedByLocalStorage() {
        let artemisia_user: any = localStorage.getItem('artemisia_user');
        if (artemisia_user) {
            try {
                artemisia_user = JSON.parse(artemisia_user)
                this.authenticated = {
                    username: artemisia_user.username,
                    email: artemisia_user.email,
                    token: artemisia_user.token
                }
            } catch(error) {
                console.error(error)
                this.authenticated = null;
            }
        }
    }

    exists(property, value) {
        return this.http.get<any>(`${this.url}/exists/user?property=${property}&value=${value}`)
    }

    create(user) {
        return this.http.post<any>(`${this.url}/user`, user)
    }

    authenticate(login, password) {
        return this.http.post<any>(`${this.url}/authenticate`, { login, password })
    }

    activate(email, activation_key) {
        return this.http.post<any>(`${this.url}/activate/user`, { email, activation_key })
    }

    recovery(login) {
        return this.http.post<any>(`${this.url}/recovery/password`, { login })
    }

    isAuthenticated(): boolean {
        if (!this.authenticated) this.loadAuthenticatedByLocalStorage()
        return !!this.authenticated
    }

    getAuthenticated() {
        if (!this.authenticated) this.loadAuthenticatedByLocalStorage()
        return this.authenticated
    }
}
