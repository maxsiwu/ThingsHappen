import { Event } from './../models/event';
//import { Pipe } from "@angular/core";

export class SortPipe {
  sortByDate(array: [Event], args: string): [Event] {
    array.sort((a: Event, b: Event) => {
	    if ( a[args].getTime() < b[args].getTime() ){
	    	return -1;
	    }else if( a[args].getTime() > b[args].getTime() ){
	        return 1;
	    }else{
	    	return 0;	
	    }
    });
    return array;
  }
}
