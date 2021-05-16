import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { NotificationService } from './notification.service';

@Injectable({
    providedIn: "root",
})
export class HttpService {
    
    constructor(private notification: NotificationService) {}

    HttpErrorHandler(error: HttpErrorResponse): void {
        if (!error.status)
            return this.notification.danger('Não foi possível se comunicar com o servidor! Por favor, tente novamente mais tarde.')
        return this.notification.danger(error.error.errors[0].message)
    }
}
