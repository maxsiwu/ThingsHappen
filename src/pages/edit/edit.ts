import { SortPipe } from './../../utility/sort-pipe';
import { DateFormat } from './../../utility/date-format';
import { Event } from './../../models/event';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController,NavParams } from 'ionic-angular';

@Component({
      selector: 'page-edit',
      templateUrl: 'edit.html',
      providers:[DateFormat, SortPipe]
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

  constructor(params: NavParams, public navCtrl: NavController, public storage:Storage, public dateFormat:DateFormat, public sortBy:SortPipe) {
      this.event = params.data.event;
      this.index = params.data.index;
      var eventTimeObj = this.event.eventDateTime
      this.title = this.event.title;
      this.date = '' + eventTimeObj.getFullYear()
                  + '-' + this.dateFormat.forceTwoDigits(eventTimeObj.getMonth()+1)
                  + '-' + this.dateFormat.forceTwoDigits(eventTimeObj.getDate())
      this.time = '' + this.dateFormat.forceTwoDigits(eventTimeObj.getHours())
                  + ':' + this.dateFormat.forceTwoDigits(eventTimeObj.getMinutes())
      this.isrepeat = this.event.isrepeat
      this.intervalValue = this.event.intervalValue
      this.intervalType = this.event.intervalType
      this.repeatWhenComplete = this.event.repeatWhenComplete
  }

  updateEvent(){
      //this.validation();
      this.addToTable();
  }
  addToTable(){
      this.storage.get('allevents').then((allevents)=>{
          var changedEvent = new Event;
          changedEvent.title = this.title;
          var timeInput = this.date+'T'+this.time+":00";
          changedEvent.eventDateTime = new Date(timeInput + this.dateFormat.getOffset())
          changedEvent.isrepeat = this.isrepeat;
          changedEvent.intervalValue = this.intervalValue;
          changedEvent.intervalType = this.intervalType;
          changedEvent.repeatWhenComplete = this.repeatWhenComplete;

          this.storage.get('allevents').then((allevents) => {
              this.allevents = this.sortBy.sortByDate(allevents,"eventDateTime")
              allevents[this.index] = changedEvent

              this.storage.set('allevents',allevents);

          })
      });
  }

  validation(){
      var state = true;
      console.log(this.date)
      // var errors = [];
      if (typeof(this.time) == 'undefined'){
          this.time = '00:00';
      }
      console.log(this.date)
      if (typeof(this.date) == 'undefined'){
        var now = new Date()
        this.date = '' + now.getFullYear() + '-' + this.dateFormat.forceTwoDigits(now.getMonth()+1) + '-' + this.dateFormat.forceTwoDigits(now.getDate());
        console.log('day is empty'+this.date);
      }
        return state;
  }
}
