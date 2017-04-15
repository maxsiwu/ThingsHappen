import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html'
})
export class IntroPage {
  tabBarElement: any;
  slides = [
    {
      title: "Welcome!",
      description: "Keep track of all events, future or past, starting with Things Happen.",
      image: "assets/images/slidebox-img-1.png",
    },
    {
      title: "Individual Lists",
      description: "Separate Lists for upcoming events and archived events",
      image: "assets/images/slidebox-img-2.png",
    },
    {
      title: "Event Tracking",
      description: "Change event status by swiping the event left or right",
      image: "assets/images/slidebox-img-3.png",
    }
  ];

  constructor(public navCtrl: NavController) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  closeTutorial(){
    this.navCtrl.pop();
  }

}
