import { HomePage } from './../home/home';
import { EditPage } from './../edit/edit';
import { StatusBar } from '@ionic-native/status-bar';
import { SortPipe } from './../../utility/sort-pipe';
import { Event } from './../../models/event';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams } from 'ionic-angular';
import { DateFormat } from './../../utility/date-format';

@Component({selector: 'page-detail',templateUrl: 'detail.html',providers: [DateFormat,SortPipe]})

export class DetailPage {
  _allevents;
  event;
  index;

  constructor(params: NavParams, public sortBy:SortPipe, public storage:Storage, public dateFormat:DateFormat, public navCtrl:NavController) {
    this.event = params.data.event;
    this.index = params.data.index;
  }

	ionViewWillEnter() {
		console.log(this.event)
    this.storage.get('allevents').then((allevents) => {
      this._allevents = this.sortBy.sortByDate(allevents,"eventDateTime")
      this.event = this._allevents[this.index]
    })
	}

  getTimeLeft = (eventTime):any => {
    return this.dateFormat.getTimeLeft(eventTime)
  }

  editEvent = ():void => {
    this.navCtrl.push(EditPage, { event: this.event, index:this.index });
  }

  watchEvent = ():void => {
    this.storage.get('allevents').then((allevents) => {
      this._allevents = this.sortBy.sortByDate(allevents,"eventDateTime")
      this.event = this._allevents[this.index]
      if(this.event.isStarred != true){
        this.event.isStarred = true
      }else{
        this.event.isStarred = false
      }
      
      allevents[this.index] = this.event
      this.storage.set('allevents',allevents);
    })
  }

  deleteEvent = ():void => {
      this.storage.get('allevents').then((allevents) => {
          this._allevents = this.sortBy.sortByDate(allevents,"eventDateTime")
          this.storage.set('allevents',this._allevents)
          allevents.splice(this.index, 1)
          this._allevents = allevents
          console.log(this._allevents,allevents)
          this.storage.set('allevents',this._allevents)
          this.navCtrl.pop(HomePage);
      })
  }
}