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
      title: "Welcome to Things Happen!",
      description: "Things Happen is an app that not only keeps you informed about future events but also keeps track of the past ones demanding action.",
      image: "assets/images/slidebox-img-1.png",
    },
    {
      title: "Event Handling",
      description: "Simply click + to add new event, star an event by pressing onto the event",
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
