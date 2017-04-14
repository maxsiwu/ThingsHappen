import { Toasts } from './../../utility/toasts';
import { ChangeColor } from './../../utility/colors';
import { EditPage } from './../edit/edit';
import { DetailPage } from './../detail/detail';
import { SortPipe } from './../../utility/sort-pipe';
import { Event } from './../../models/event';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, Content } from 'ionic-angular';
import { DateFormat } from './../../utility/date-format';

// import {style, state, animate, transition, trigger} from '@angular/core';
// import 'web-animations-js/web-animations.min';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
	providers: [SortPipe, DateFormat,Toasts]
	// animations: [
  //   trigger('popup', [
	// 		state("onScreen", style({ width: "100%" })),
	// 		state("offScreen", style({ width: "50%" })),
	// 		transition("onScreen => offScreen", animate(500)),
	// 		transition("offScreen => onScreen", animate(500)),
  //   ])
  // ]
})

export class HomePage {
	@ViewChild(Content) content:Content;
	_allevents:[Event];
	_oneEvent:Event;
  colorDiff:number;
  colorCode:string;
  currentLength:number;
  colorIndex:Array<number>;
	//onScreen:Array<string>;
  //pushMessage: string = "some message being pushed";
	
	constructor(public navCtrl: NavController,
              public storage: Storage,
              public sortBy: SortPipe,
              public dateFormat: DateFormat,
              public changeColor:ChangeColor,
							public toastCtrl: Toasts,
							public element: ElementRef,
							params:NavParams) {
    this.colorCode = "#8388af";
	}

	ionViewWillEnter() {
		this.displayData();
	}

	ionViewDidEnter() {
		this.displayData();
	}

	// ngAfterViewInit() {
	// 	this.content.enableScrollListener();
	// 	this.scrollerHandle = this.element.nativeElement.children[1].children[1];
	// }

	// scrollAnimation() {
	// 	console.log(this.onScreen);
	// 	var scrollTop = this.content.scrollTop.valueOf();
	// 	var scrollBarBtm = scrollTop + window.innerHeight;
	// 	for(var i = 0; i<this.currentLength;i++){
	// 		var element = document.getElementById("event"+i.toString());
	// 		if (element.getBoundingClientRect().bottom > scrollBarBtm 
	// 		){
	// 			this.onScreen[i] = 'offScreen';
	// 		}else{
	// 			this.onScreen[i] = 'onScreen';
	// 		}
	// 	}
	// }

	displayData() {
		this.storage.get('allevents').then((allevents) => {

			if (allevents != null) {
				this._allevents = this.sortBy.sortByDate(allevents, "eventDateTime");
        this.currentLength = 0;
        this.colorIndex = Array(this._allevents.length);
				//this.onScreen = Array(this._allevents.length);
        for(var i = 0; i < this._allevents.length; i++){
					//this.onScreen[i] = 'offScreen';
          if((typeof(this._allevents[i].isComplete) == "undefined") || (!this._allevents[i].isComplete)){
            this.colorIndex[i] = this.currentLength;
            this.currentLength++;
          }
        }
        this.colorDiff = this.changeColor.getColorDiff(this.colorCode, this.currentLength);
			}
		});
	}

  showBgColor(i){
    return this.changeColor.lightenDarkenColor(this.colorCode, -this.colorIndex[i]*this.colorDiff)
  }

	editEvent = (index): void => {
		this.storage.get('allevents').then((allevents) => {
			this._allevents = this.sortBy.sortByDate(allevents, "eventDateTime");
			this._oneEvent = this._allevents[index];
			this.navCtrl.push(EditPage, { event: this._oneEvent, index: index });
		})
	}

	completeEvent = (index): void => {
		this.storage.get('allevents').then((allevents) => {
			this._allevents = this.sortBy.sortByDate(allevents, "eventDateTime");
			this._oneEvent = this._allevents[index];
			this._oneEvent.isComplete = true;
			var now = new Date();

			//if repeat is checked
			if (typeof (this._oneEvent.intervalValue) != "undefined" &&
				this._oneEvent.isrepeat == true) {
				if (this._oneEvent.intervalType == "hours") {
					if (this._oneEvent.repeatWhenComplete) {
						this._oneEvent.eventDateTime =
							new Date(now.getTime() +
								this._oneEvent.intervalValue * 60 * 60 * 1000);
					} else {
						var newDate = new Date(this._oneEvent.eventDateTime.getTime() +
													this._oneEvent.intervalValue * 60 * 60 * 1000);
						var interval = this._oneEvent.eventDateTime.getTime() - now.getTime();
						if(interval < 0){
								this._oneEvent.eventDateTime = newDate;
						}
					}
				}else{
					// if it's repeating days
					if (this._oneEvent.repeatWhenComplete) {
						this._oneEvent.eventDateTime =
							new Date(now.getTime() +
								this._oneEvent.intervalValue * 60 * 60 * 1000 * 24);
					} else {
						var newDate = new Date(this._oneEvent.eventDateTime.getTime() +
													this._oneEvent.intervalValue * 60 * 60 * 1000 * 24);
						var interval = this._oneEvent.eventDateTime.getTime() - now.getTime();
						if(interval < 0){
								this._oneEvent.eventDateTime = newDate;
						}
					}
				}
				this._oneEvent.isComplete = false;
			}

			allevents[index] = this._oneEvent;
			this.storage.set('allevents', allevents).then(()=>{
        this.displayData();
				this.toastCtrl.presentToast('Event Completed','center');
      });
		})
	}

	getTimeLeft = (eventTime): any => {
		return this.dateFormat.getTimeLeft(eventTime);
	}

	goToDetails = (index): void => {
		this.storage.get('allevents').then((allevents) => {
			this._allevents = this.sortBy.sortByDate(allevents, "eventDateTime");
			this._oneEvent = this._allevents[index];
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

}
