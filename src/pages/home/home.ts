import { ChangeColor } from './../../utility/colors';
import { EditPage } from './../edit/edit';
import { DetailPage } from './../detail/detail';
import { SortPipe } from './../../utility/sort-pipe';
import { Event } from './../../models/event';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams } from 'ionic-angular';
import { DateFormat } from './../../utility/date-format';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
	providers: [SortPipe, DateFormat]
})

export class HomePage {
	_allevents: [Event]
	_oneEvent: Event
  colorDiff: number
  colorCode: string
  currentLength: number
	constructor(public navCtrl: NavController,
              public storage: Storage,
              public sortBy: SortPipe,
              public dateFormat: DateFormat,
              public changeColor:ChangeColor) {
		//this.storage.clear();
    this.colorCode = "#00FF00";
	}

	ionViewWillEnter() {
		this.displayData();
	}
	displayData() {
		this.storage.get('allevents').then((allevents) => {
      
			if (allevents != null) {
				this._allevents = this.sortBy.sortByDate(allevents, "eventDateTime");
        this.currentLength = 0;
        for(var i = 0; i < this._allevents.length; i++){
          if((typeof(this._allevents[i].isComplete) == "undefined") || (!this._allevents[i].isComplete)){
            this.currentLength++
            console.log("?",this.currentLength)
          }
        }
        this.colorDiff = this.changeColor.getColorDiff(this.colorCode, this.currentLength);
			}
		});
	}

  showBgColor(i){
    console.log("??",this.colorDiff)
    return this.changeColor.lightenDarkenColor(this.colorCode, i*this.colorDiff)
  }

	editEvent = (index): void => {
		this.storage.get('allevents').then((allevents) => {
			this._allevents = this.sortBy.sortByDate(allevents, "eventDateTime")
			this._oneEvent = this._allevents[index]
			this.navCtrl.push(EditPage, { event: this._oneEvent, index: index });
		})
	}

	completeEvent = (index): void => {
		this.storage.get('allevents').then((allevents) => {
			this._allevents = this.sortBy.sortByDate(allevents, "eventDateTime")
			this._oneEvent = this._allevents[index]
			this._oneEvent.isComplete = true
			var now = new Date()
			//if repeat is checked
			console.log(this._oneEvent)
			if (typeof (this._oneEvent.intervalValue) != "undefined" &&
				this._oneEvent.isrepeat == true) {
				if (this._oneEvent.intervalType == "hours") {
					if (this._oneEvent.repeatWhenComplete) {
						this._oneEvent.eventDateTime =
							new Date(now.getTime() +
								this._oneEvent.intervalValue * 60 * 60 * 1000)
					} else {
						this._oneEvent.eventDateTime =
							new Date(this._oneEvent.eventDateTime.getTime() +
								this._oneEvent.intervalValue * 60 * 60 * 1000)
					}
				}
				this._oneEvent.isComplete = false
			}

			console.log(this._oneEvent.eventDateTime)
			allevents[index] = this._oneEvent
			this.storage.set('allevents', allevents);
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

}
