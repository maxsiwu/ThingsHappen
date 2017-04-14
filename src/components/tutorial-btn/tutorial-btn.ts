import { IntroPage } from './../../pages/intro/intro';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'tutorial-btn',
  template: `<button ion-button round="true" clear (click)="showTutorial()" icon-only>
                    <i class="fa fa-info-circle tutorial-button" aria-hidden="true"></i>
                </button>`
})
export class TutorialBtn{
      constructor(params: NavParams, public navCtrl:NavController) {}
    showTutorial(){
        //console.log('clicking info icon');
        this.navCtrl.push(IntroPage)
    }
}