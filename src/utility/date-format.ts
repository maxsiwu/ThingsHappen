export class DateFormat{

    forceTwoDigits(number){
	  var outputString = "00";
        if ( (Math.abs(number)/10)>=1 ){
        outputString = "" + Math.abs(number);
        }else{
        outputString = "0" + Math.abs(number);
        }
        return outputString;
    }

    getOffset(){
        var now = new Date()
        var offset = -now.getTimezoneOffset()/60;
        console.log(offset)
        var offsetString = this.formatOffset(offset)
        return offsetString;
    }

    formatOffset(offset){
        var offsetString = "";
        offsetString = this.forceTwoDigits(offset) + ":00";

        if (offset >= 0){
        return "+" + offsetString;
        }
        return "-" + offsetString;
    }

    getTimeLeft = (eventTime):any => {
      var output = {value:0,unit:""}
      var now = new Date().getTime()
      var distance = eventTime.getTime() - now
      
      var years = distance / (1000 * 60 * 60 * 24 * 365)
      var days = distance / (1000 * 60 * 60 * 24)
      var hours = (distance % (1000 * 60 * 60 * 24))/ (1000 * 60 * 60)
      var minutes = (distance % (1000 * 60 * 60)) / (1000 * 60)

      if (distance < 0) {
        if(Math.abs(years) < 1){
          if (Math.abs(days) < 1){
            if(Math.abs(hours) < 1){
              output.value = -Math.floor(minutes)
              output.unit = this.detectSingular(output.value,"Min") + " Ago"
            }else{
              output.value = -Math.floor(hours)
              output.unit = this.detectSingular(output.value,"Hour") + " Ago"
            }
          }else{
            output.value = -Math.ceil(days)
            output.unit = this.detectSingular(output.value,"Day") + " Ago"
          }
        }else{
          output.value = -Math.floor(years) - 1
          output.unit = this.detectSingular(output.value,"Year") + " Ago"
        }
      }else{
        if(years < 1){
          if (days < 1){
            if(hours<1){
              output.value = Math.floor(minutes)
              output.unit = this.detectSingular(output.value,"Min")
            }else{
              output.value = Math.floor( hours * 10 ) / 10
              output.unit = this.detectSingular(output.value,"Hour")
            }
          }else{
            output.value = Math.ceil(days)
            output.unit = this.detectSingular(output.value,"Day")
          }
        }else{
            output.value = Math.floor(years) + 1
            output.unit = this.detectSingular(output.value,"Year")
        }
      }
      return output
  }

  detectSingular(number, unit){
    if (number <= 1){
      return unit
    }else{
      return unit + "s"
    }
  }
}

