function base64Decode(text){

    text = text.replace(/\s/g,"");

    //local variables
    var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        cur, prev, digitNum,
        i=0,
        result = [];

    text = text.replace(/=/g, "");

    while(i < text.length){

        cur = digits.indexOf(text.charAt(i));
        digitNum = i % 4;

        switch(digitNum){

            //case 0: first digit - do nothing, not enough info to work with

            case 1: //second digit
                result.push((prev << 2 | cur >> 4));
                break;

            case 2: //third digit
                result.push(((prev & 0x0f) << 4 | cur >> 2));
                break;

            case 3: //fourth digit
                result.push(((prev & 3) << 6 | cur));
                break;
        }

        prev = cur;
        i++;
    }

    return result;
}

function base64Encode(text){
/*
    if (/([^\u0000-\u00ff])/.test(text)){
        throw new Error("Can't base64 encode non-ASCII characters.");
    } 
*/
    var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        i = 0,
        cur, prev, byteNum,
        result=[];      

    while(i < text.length){

        cur = text[i];
        byteNum = i % 3;

        switch(byteNum){
            case 0: //first byte
                result.push(digits.charAt(cur >> 2));
                break;

            case 1: //second byte
                result.push(digits.charAt((prev & 3) << 4 | (cur >> 4)));
                break;

            case 2: //third byte
                result.push(digits.charAt((prev & 0x0f) << 2 | (cur >> 6)));
                result.push(digits.charAt(cur & 0x3f));
                break;
        }

        prev = cur;
        i++;
    }

    if (byteNum == 0){
        result.push(digits.charAt((prev & 3) << 4));
        result.push("==");
    } else if (byteNum == 1){
        result.push(digits.charAt((prev & 0x0f) << 2));
        result.push("=");
    }

    return result.join("");
}

var to12bitbuffer = function(a) {
	var buf = new ArrayBuffer((a.length * 1.5) | 0);
	var twelvebitbuf = new Uint12Array(buf);
	for(var i = 0; i < a.length; i++) {
		twelvebitbuf.set(i, a[i]);
	}
	return buf;
}

window.addEventListener("load", function() {
	var txt = document.getElementById('ta');
	var out = document.getElementById('out');
	var a = document.getElementById('compress');
	a.addEventListener("click", function() {
	    
	    var compressed = LZW.compress(txt.value);
	    alert(compressed);
	    var eightbit = new Uint8Array(to12bitbuffer(compressed));
	    var result = base64Encode(eightbit);
	    out.innerHTML = result;
	    var decoded = base64Decode(result);
	    var twelvebit = to12bitbuffer(result);
	    var buf = new Uint12Array(twelvebit);
	    var edible = [];
	    alert(twelvebit.byteLength);
	    for(var i = 0; i < (twelvebit.byteLength / 1.5) | 0; i++) {
	    	edible.push(buf.get(i));
	    }
	    alert(edible);
	    var revert = LZW.decompress(edible);
	    out.innerHTML = revert;
	});
	BitView.test();
});
