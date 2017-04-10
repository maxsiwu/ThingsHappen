import { Toasts } from './../../utility/toasts';
import { HomePage } from './../home/home';
import { DateFormat } from './../../utility/date-format';
import { Event } from './../../models/event';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, AlertController } from 'ionic-angular';
import {style, state, animate, transition, trigger} from '@angular/core';
import 'web-animations-js/web-animations.min';

@Component({
  selector: 'page-create',
  templateUrl: 'create.html',
  providers:[DateFormat, HomePage],
  animations: [
    trigger('animate', [
      
      transition(':enter', [   // :enter is alias to 'void => *'
        style({height:0, opacity: 0}),
        animate(200, style({height:'*', opacity: 1})) 
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(200, style({height:0, opacity:0})) 
      ])
    ])
  ]
})
export class CreatePage {
  title:string;
  date:string;
  time:string;
  isrepeat:boolean;
  isAllDay:boolean;
  intervalValue:number;
  intervalType:string;
  repeatWhenComplete:boolean;
  //hasAlert:boolean;

  constructor(public navCtrl: NavController,
              public storage:Storage,
              public dateFormat:DateFormat,
              public alertCtrl:AlertController,
              public toastCtrl:Toasts) {
    //this.storage.clear();
    this.populateFormFields();
  }
  populateFormFields(){
    var now = new Date();
    this.title = "";
    this.intervalType = "hours";
      this.date = '' + now.getFullYear() + '-' + this.dateFormat.forceTwoDigits(now.getMonth()+1)
              + '-' + this.dateFormat.forceTwoDigits(now.getDate());
      this.time = '' + this.dateFormat.forceTwoDigits(now.getHours()) + ':' + this.dateFormat.forceTwoDigits(now.getMinutes());
      this.repeatWhenComplete = true;
      this.isAllDay = true;
      //this.hasAlert = false;
  }
  ionViewWillEnter() {
		this.populateFormFields();
	}

  ionViewWillLeave(){
    this.populateFormFields();
  }

  updateEvent(){
	  this.validation();
  }
  createEvent(){
      this.storage.get('allevents').then((allevents)=>{
          var eventModel = new Event;
          var timeInput;
          eventModel.title = this.title;
          eventModel.isAllDay = this.isAllDay;
          if(!this.isAllDay){
            timeInput = this.date+'T'+this.time+":00";
          }else{
            timeInput = this.date+'T00:00:00';
          }
          eventModel.eventDateTime = new Date(timeInput + this.dateFormat.getOffset())
          eventModel.isrepeat = this.isrepeat;
          eventModel.intervalValue = this.intervalValue;
          eventModel.intervalType = this.intervalType;
          eventModel.repeatWhenComplete = this.repeatWhenComplete;
          //eventModel.hasAlert = this.hasAlert;

          if(!allevents){
              allevents = []
          }
          allevents.push(eventModel);
          this.storage.set('allevents',allevents).then(()=>{
            this.goToHomePage();
          });
      });
  }

    validation(){
        var isFormValid = true;
        if(this.isrepeat && !this.repeatWhenComplete){
            this.toastCtrl.presentToast('This event will repeat regardless of your action','middle');
        }
        if(this.isrepeat && (Math.floor(this.intervalValue) == 0 || typeof(this.intervalValue)=='undefined')){
            isFormValid = false;
            this.showCreateAlert("repeat number","Number field is left empty.");
        }
        if (this.isAllDay == false && (typeof(this.time) == 'undefined'|| this.time == '')){
            isFormValid = false;
            this.showCreateAlert('time','Time has not been entered for a repeat event.');
        }
        if (typeof(this.date) == 'undefined'|| this.date == ''|| this.date == 'yyyy-mm-dd'){
            isFormValid = false;
            this.showCreateAlert('date','Date cannot be empty.');
        }
        if(typeof(this.title) == 'undefined' || this.title.trim() == ''){
            isFormValid = false;
            this.showCreateAlert('title','Title cannot be empty.');
        }
        if(!isFormValid){
            console.log('form not valid');
        }else{
            this.createEvent();
        }
    }
    showCreateAlert(errTitle, errMsg) {
        let confirm = this.alertCtrl.create({
        title: 'Must enter event ' + errTitle,
        message: 'Cannot save: ' + errMsg,
        buttons: [
            {
                text: 'Got it.',
                handler: () => {
                    console.log('not valid');
                }
            }
        ]
        });
        confirm.present();
    } 
  goToHomePage(){
    this.navCtrl.parent.select(0);
  }
}
