import { ChangeColor } from './../../utility/colors';
import { EditPage } from './../edit/edit';
import { DetailPage } from './../detail/detail';
import { SortPipe } from './../../utility/sort-pipe';
import { Event } from './../../models/event';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams } from 'ionic-angular';
import { DateFormat } from './../../utility/date-format';
import { AlertController } from 'ionic-angular';
import { Toasts } from './../../utility/toasts';

@Component({
  selector: 'page-completed-list',
  templateUrl: 'completed-list.html',
  providers: [SortPipe, DateFormat,Toasts]
})

export class CompletedListPage {
  _allevents: [Event]
  _oneEvent: Event
  colorDiff: number
  colorCode: string
  currentLength: number
  colorIndex: Array<number>

  constructor(public navCtrl: NavController,
              public storage: Storage,
              public sortBy: SortPipe,
              public dateFormat: DateFormat,
              public changeColor:ChangeColor,
              public alertCtrl: AlertController,
              public toastCtrl: Toasts) {
    //this.storage.clear();
    this.colorCode = "#8388af";
  }

  ionViewWillEnter() {
    this.displayData();
  }

  displayData() {
		this.storage.get('allevents').then((allevents) => {

			if (allevents != null) {
				this._allevents = this.sortBy.sortByDate(allevents, "eventDateTime");
        this.currentLength = 0;
        this.colorIndex = Array(this._allevents.length)
        for(var i = 0; i < this._allevents.length; i++){
          if(this._allevents[i].isComplete){
            this.colorIndex[i] = this.currentLength;
            this.currentLength++;
          }
        }
        this.colorDiff = this.changeColor.getColorDiff(this.colorCode, -this.currentLength);
			}
		});
	}
  showBgColor(i){
    return this.changeColor.lightenDarkenColor(this.colorCode, this.colorIndex[i]*this.colorDiff)
  }
  bringBackEvent = (index): void => {
    this.storage.get('allevents').then((allevents) => {
      this._allevents = this.sortBy.sortByDate(allevents, "eventDateTime")
      this._oneEvent = this._allevents[index]
      this._oneEvent.isComplete = false
      allevents[index] = this._oneEvent
      this.storage.set('allevents', allevents);
      this.toastCtrl.presentToast('Event Marked Incomplete','middle');
    })
  }

  deleteEvent = (index): void => {
    this.storage.get('allevents').then((allevents) => {
      this._allevents = this.sortBy.sortByDate(allevents, "eventDateTime")
      this.storage.set('allevents', this._allevents)
      allevents.splice(index, 1)
      this._allevents = allevents
      this.storage.set('allevents', this._allevents)
    })
  }

  getTimeLeft = (eventTime): any => {
    return this.dateFormat.getTimeLeft(eventTime)
  }

  goToDetails = (index): void => {
    this.storage.get('allevents').then((allevents) => {
      this._allevents = this.sortBy.sortByDate(allevents, "eventDateTime")
      this._oneEvent = this._allevents[index]
      this.navCtrl.push(DetailPage, { event: this._oneEvent, index: index });
    })
  }
  toggleStatus = (index):void => {
    this.storage.get('allevents').then((allevents) => {
      this._allevents = this.sortBy.sortByDate(allevents,"eventDateTime");
      this._oneEvent = this._allevents[index];
      if(this._oneEvent.isStarred != true){
        this._oneEvent.isStarred = true;
      }else{
        this._oneEvent.isStarred = false;
      }
      allevents[index] = this._oneEvent;
      this.storage.set('allevents',allevents);
    })
	}
  showDeleteAlert(index) {
    let confirm = this.alertCtrl.create({
      title: 'Delete the event?',
      message: 'Once deleted, this action cannot be reversed.',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.deleteEvent(index);
            this.toastCtrl.presentToast('Event deleted','middle');
            this.displayData();
          }
        },
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        }
      ]
    });
    confirm.present();
  }
}