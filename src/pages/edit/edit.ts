import { Toasts } from './../../utility/toasts';
import { DetailPage } from './../detail/detail';
import { SortPipe } from './../../utility/sort-pipe';
import { DateFormat } from './../../utility/date-format';
import { Event } from './../../models/event';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import {style, state, animate, transition, trigger} from '@angular/core';
import 'web-animations-js/web-animations.min';

@Component({
    selector: 'page-edit',
    templateUrl: 'edit.html',
    providers:[DateFormat, SortPipe, Toasts],
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
export class EditPage {
    allevents:[Event];
    event:Event;
    index:number;
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
    //hasAlert:boolean;

    constructor(params: NavParams,
                public navCtrl: NavController,
                public storage:Storage,
                public dateFormat:DateFormat,
                public sortBy:SortPipe,
                public toastCtrl: Toasts,
                public alertCtrl: AlertController) {
        this.event = params.data.event;
        this.index = params.data.index;
        this.displayData();
    }

    ionViewWillEnter(){
        this.displayData();
    }

    ionViewWillLeave(){
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
        //this.hasAlert = this.event.hasAlert;

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
    }
    saveEditedEvent(){
        this.storage.get('allevents').then((allevents)=>{
            var changedEvent = new Event;
            var timeInput;
            changedEvent.title = this.title;
            changedEvent.isAllDay = this.isAllDay;
            // check if it's all day event
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
            changedEvent.eventDateTime = new Date(timeInput + this.dateFormat.getOffset());
            //changedEvent.hasAlert = this.hasAlert;

            this.storage.get('allevents').then((allevents) => {
                this.allevents = this.sortBy.sortByDate(allevents,"eventDateTime")
                allevents[this.index] = changedEvent
                this.storage.set('allevents',allevents);
            })
        });
        this.navCtrl.pop();
    }

    validation(){
        var isFormValid = true;
        if(this.isrepeat && !this.repeatWhenComplete){
            this.toastCtrl.presentToast('This event will repeat regardless of your action','center');
        }
        if(this.isrepeat && (Math.floor(this.intervalValue) == 0 || typeof(this.intervalValue)=='undefined')){
            isFormValid = false;
            this.showEditAlert("repeat number","Number field is left empty.");
        }
        if (this.isAllDay == false && (typeof(this.time) == 'undefined'|| this.time == '')){
            isFormValid = false;
            this.showEditAlert('time','Time has not been entered for a repeat event.');
        }
        if (typeof(this.date) == 'undefined'|| this.date == ''|| this.date == 'yyyy-mm-dd'){
            isFormValid = false;
            this.showEditAlert('date','Date cannot be empty.');
        }
        if(typeof(this.title) == 'undefined' || this.title.trim() == ''){
            isFormValid = false;
            this.showEditAlert('title','Title cannot be empty.');
        }
        if(!isFormValid){
            console.log('form not valid');
        }else{
            this.saveEditedEvent();
        }
    }
    showEditAlert(errTitle, errMsg) {
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
    goBack(){
        this.navCtrl.pop();
    }
}