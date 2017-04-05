import { ToastController } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
	providers: [ToastController]
})
export class Toasts {
    constructor(public toastCtrl: ToastController) {}
    presentToast(toastMsg, position) {
        let toast = this.toastCtrl.create({
            message: toastMsg,
            duration: 2000,
            position: position
        });
        toast.present();
    }
}