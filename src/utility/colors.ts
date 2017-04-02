export class ChangeColor{
    getColorDiff(colorCode, length){
        var num = parseInt(colorCode,16);
        var r = (num >> 16);
        var g = ((num >> 8) & 0x00FF);
        var b = (num & 0x0000FF);

        var smlNum1 = r < g ? r : g;
        var smlNum2 = b < smlNum1 ? b : smlNum1;

        var colorDiff = (255 - smlNum2)/length;
        return colorDiff;
    }
    lightenDarkenColor(col, amt) {
        var usePound = false;
        if (col[0] == "#") {
            col = col.slice(1);
            usePound = true;
        }
        var num = parseInt(col,16);
        var r = (num >> 16) + amt;
        if (r > 255){
            r = 255;
        } else if  (r < 0) {
            r = 0;
        }
        var g = ((num >> 8) & 0x00FF) + amt;
        if (g > 255) {
            g = 255;
        } else if (g < 0){
             g = 0;
        }
        var b = (num & 0x0000FF) + amt;
        if (b > 255){
            b = 255;
        }else if (b < 0) {
            b = 0;
        }
        //RRRRRRRR GGGGGGGG BBBBBBBB
        return (usePound?"#":"") + String("000000" + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);

    }
}