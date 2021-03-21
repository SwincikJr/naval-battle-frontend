import { Injectable } from '@angular/core'

@Injectable({
    providedIn: "root",
})
export class NotificationService {
    
    constructor() {}
    
    private createNotification(message, type) {
        const notification = document.createElement('div')
        notification.className = `notification notification-${type} notification-in`
        notification.innerHTML = message
        notification.onclick = () => { notification.remove() }
        document.getElementsByTagName('body')[0].appendChild(notification)
        setTimeout(() => {
          notification.className = `notification notification-${type} notification-out`
          setTimeout(() => {
            notification.remove()
          }, 1000)
        }, 7000)
    }

    success(message) {
      this.createNotification(message, 'success')
    }

    danger(message) {
        this.createNotification(message, 'danger')
    }
}
