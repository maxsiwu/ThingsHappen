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
      title: "Add an Event",
      description: "Simply click plus sign to add new event",
      image: "assets/images/slidebox-img-2.png",
    },
    {
      title: "Event Tracking",
      description: "Mark an event complete, incomplete, or to edit or delete event by swiping the event left or right.",
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

}
