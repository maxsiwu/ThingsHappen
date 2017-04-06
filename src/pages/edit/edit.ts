import { Toasts } from './../../utility/toasts';
import { DetailPage } from './../detail/detail';
import { SortPipe } from './../../utility/sort-pipe';
import { DateFormat } from './../../utility/date-format';
import { Event } from './../../models/event';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController,NavParams } from 'ionic-angular';

@Component({
      selector: 'page-edit',
      templateUrl: 'edit.html',
      providers:[DateFormat, SortPipe, Toasts]
})
export class EditPage {
  allevents:[Event];
  event:Event;
  index;
  title:string;
  date:string;
  time:string;
  isrepeat:boolean;
  intervalValue:number;
  intervalType:string;
  repeatWhenComplete:boolean;
  isComplete:boolean;
  isStarred:boolean;
  description:string;
  isAllDay:boolean;

  constructor(params: NavParams, 
                public navCtrl: NavController, 
                public storage:Storage, 
                public dateFormat:DateFormat, 
                public sortBy:SortPipe,
                public toastCtrl: Toasts) {
      this.event = params.data.event;
      this.index = params.data.index;
      this.displayData();
  }

  ionViewWillEnter(){
      this.displayData();
  }

  displayData(){
      var eventTimeObj = this.event.eventDateTime;
      this.title = this.event.title;
      if(this.event.isAllDay == true || typeof(this.event.isAllDay)=='undefined'){
        this.isAllDay = true;
      }else{
        this.isAllDay = false;
      }
      this.isrepeat = this.event.isrepeat;
      this.date = '' + eventTimeObj.getFullYear()
                  + '-' + this.dateFormat.forceTwoDigits(eventTimeObj.getMonth()+1)
                  + '-' + this.dateFormat.forceTwoDigits(eventTimeObj.getDate());
      this.time = '' + this.dateFormat.forceTwoDigits(eventTimeObj.getHours())
                  + ':' + this.dateFormat.forceTwoDigits(eventTimeObj.getMinutes());
      this.intervalValue = this.event.intervalValue;
      this.intervalType = this.event.intervalType;

      if(typeof(this.event.repeatWhenComplete) == "undefined"){
        this.repeatWhenComplete = true
      }else{
        this.repeatWhenComplete = this.event.repeatWhenComplete;
      }

      this.isComplete = this.event.isComplete;
      this.isStarred = this.event.isStarred;
      this.description = this.event.description;
  }

  updateEvent(){
      this.validation();
      this.saveEditedEvent();
  }
  saveEditedEvent(){
      this.storage.get('allevents').then((allevents)=>{
          var changedEvent = new Event;
          var timeInput;
          changedEvent.title = this.title;
          changedEvent.isAllDay = this.isAllDay;
          // if it's all day event
          if(this.isAllDay){
            timeInput = this.date+'T00:00:00';
            changedEvent.isrepeat = false;
            changedEvent.repeatWhenComplete = true;
          }else{
            timeInput = this.date+'T'+this.time+":00";
            changedEvent.isrepeat = this.isrepeat;
            changedEvent.repeatWhenComplete = this.repeatWhenComplete;
          }
            changedEvent.intervalValue = this.intervalValue;
            changedEvent.intervalType = this.intervalType;
            changedEvent.isComplete = this.isComplete;
            changedEvent.isStarred = this.isStarred;
            changedEvent.description = this.description;
            changedEvent.eventDateTime = new Date(timeInput + this.dateFormat.getOffset())
          
          this.storage.get('allevents').then((allevents) => {
              this.allevents = this.sortBy.sortByDate(allevents,"eventDateTime")
              allevents[this.index] = changedEvent
              this.storage.set('allevents',allevents);
          })
      });
      this.navCtrl.pop();
  }

  validation(){
      var state = true;
    if(this.isrepeat && !this.repeatWhenComplete){
        this.toastCtrl.presentToast('This event will repeat regardless of your action','middle');        
    }

    if(this.title == '' || typeof(this.title)=='undefined'){
        this.title = 'Missing Title';
    }

    if(Math.floor(this.intervalValue) == 0 || typeof(this.intervalValue)=='undefined'){
        this.intervalValue = 1;
    }
      // var errors = [];
      if (typeof(this.time) == 'undefined'){
          this.time = '00:00';
      }
      if (typeof(this.date) == 'undefined'){
        var now = new Date();
        this.date = '' + now.getFullYear()
                    + '-' + this.dateFormat.forceTwoDigits(now.getMonth()+1)
                    + '-' + this.dateFormat.forceTwoDigits(now.getDate());
        console.log('day is empty'+this.date);
      }
    return state;
  }
    goBack(){
        this.navCtrl.pop();
    }
}