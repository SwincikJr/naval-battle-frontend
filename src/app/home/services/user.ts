import { Injectable } from '@angular/core'
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment'

@Injectable({
    providedIn: "root",
})
export class UserService {
    
    public readonly url = `${environment.urlApi}`

    constructor(private http: HttpClient) {}
    
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
}
