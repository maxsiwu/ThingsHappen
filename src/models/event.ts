import { DateFormat } from './../utility/date-format';

// Define event object
export class Event {
    title:string;
    eventDateTime:Date;
    isrepeat:boolean;
    intervalValue:number;
    intervalType:string;
    repeatWhenComplete:boolean;
    isStarred:boolean;
    isComplete:boolean;
    isAllDay:boolean;
    description:string;
    hasAlert:boolean;

    constructor(){
        // setting default values
        this.title = "untitled";
        var dateFormat = new DateFormat;
        var now = new Date();
		this.eventDateTime = new Date(now.getFullYear() + '-'
                            + dateFormat.forceTwoDigits(now.getMonth()+1)
                            + '-' + dateFormat.forceTwoDigits(now.getDate())
                            + 'T00:00:00');

    }
}