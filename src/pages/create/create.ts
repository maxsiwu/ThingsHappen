import { HomePage } from './../home/home';
import { DateFormat } from './../../utility/date-format';
import { Event } from './../../models/event';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-create',
  templateUrl: 'create.html',
  providers:[DateFormat, HomePage]
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

  constructor(public navCtrl: NavController,
              public storage:Storage,
              public dateFormat:DateFormat) {
    //this.storage.clear();
    this.populateFormFields();
  }
  populateFormFields(){
    var now = new Date();
    this.title = "";
    this.intervalType = "hours";
      this.date = '' + now.getFullYear()
              + '-' + this.dateFormat.forceTwoDigits(now.getMonth()+1)
              + '-' + this.dateFormat.forceTwoDigits(now.getDate());
      this.time = '' + this.dateFormat.forceTwoDigits(now.getHours())
                + ':' + this.dateFormat.forceTwoDigits(now.getMinutes());
      this.repeatWhenComplete = true;
      this.isAllDay = true;
  }
  ionViewWillEnter() {
		this.populateFormFields();
	}

  ionViewWillLeave(){
    this.populateFormFields();
  }

  updateEvent(){
	  this.validation();
	  this.createEvent();
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
      var state = true;
      console.log(this.date)
      // var errors = [];
      if (typeof(this.time) == 'undefined'){
          this.time = '00:00';
      }
      if (typeof(this.date) == 'undefined'){
        var now = new Date()
        this.date = '' + now.getFullYear() + '-' + this.dateFormat.forceTwoDigits(now.getMonth()+1) + '-' + this.dateFormat.forceTwoDigits(now.getDate());
      }
      return state;
  }
  goToHomePage(){
    this.navCtrl.parent.select(0);
  }
}
