import { EditPage } from './../edit/edit';
import { DetailPage } from './../detail/detail';
import { SortPipe } from './../../utility/sort-pipe';
import { Event } from './../../models/event';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams } from 'ionic-angular';
import { DateFormat } from './../../utility/date-format';


@Component({
    selector: 'page-completed-list',
    templateUrl: 'completed-list.html',
    providers: [SortPipe, DateFormat]
})

export class CompletedListPage {
  _allevents:[Event]
  _oneEvent:Event

  constructor(public navCtrl: NavController, public storage:Storage, public sortBy:SortPipe, public dateFormat:DateFormat) {
    //this.storage.clear();
  }

  ionViewWillEnter(){
        this.displayData();
  }
  displayData() {
       this.storage.get('allevents').then((allevents) => {
         if(allevents != null){
           this._allevents = this.sortBy.sortByDate(allevents,"eventDateTime")
         }
       });
  }

  bringBackEvent = (index):void => {
    this.storage.get('allevents').then((allevents) => {
      this._allevents = this.sortBy.sortByDate(allevents,"eventDateTime")
      this._oneEvent = this._allevents[index]
      this._oneEvent.isComplete = false
      allevents[index] = this._oneEvent
      this.storage.set('allevents',allevents);
    })
  }

  deleteEvent = (index):void => {
      this.storage.get('allevents').then((allevents) => {
          this._allevents = this.sortBy.sortByDate(allevents,"eventDateTime")
          this.storage.set('allevents',this._allevents)
          allevents.splice(index, 1)
          this._allevents = allevents
          console.log(this._allevents,allevents)
          this.storage.set('allevents',this._allevents)
      })
  }

  getTimeLeft = (eventTime):any => {
    return this.dateFormat.getTimeLeft(eventTime)
  }

  goToDetails = (index):void => {
    this.storage.get('allevents').then((allevents) => {
      this._allevents = this.sortBy.sortByDate(allevents,"eventDateTime")
      this._oneEvent = this._allevents[index]
      this.navCtrl.push(DetailPage, { event: this._oneEvent, index:index });
    })
  }

}