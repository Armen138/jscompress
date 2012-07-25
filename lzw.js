//LZW Compression/Decompression for Strings
var LZW = {
    compress: function (uncompressed) {
        "use strict";
        // Build the dictionary.
        var i,
            dictionary = {},
            c,
            wc,
            w = "",
            result = [],
            dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[String.fromCharCode(i)] = i;
        }
 
        for (i = 0; i < uncompressed.length; i += 1) {
            c = uncompressed.charAt(i);
            wc = w + c;
            if (dictionary[wc]) {
                w = wc;
            } else {
                result.push(dictionary[w]);
                // Add wc to the dictionary.
                dictionary[wc] = dictSize++;
                w = String(c);
            }
        }
 
        // Output the code for w.
        if (w !== "") {
            result.push(dictionary[w]);
        }
        return result;
    }
}

window.addEventListener("load", function() {
    var txt = document.getElementById('ta');
    var out = document.getElementById('to');
    var a = document.getElementById('compress');
    a.addEventListener("click", function() {         
        var compressed = LZW.compress(txt.value);
        var stringy = "";
        for(var i = 0; i < compressed.length; i++) {
            stringy += String.fromCharCode(compressed[i]);
        }
        //alert(test(stringy));
        //alert(LZW.decompressString(stringy));

        var edible = [];
        for(var i = 0; i < stringy.length; i++) {
            edible.push(stringy.charCodeAt(i));
        }
        var res = 'eval(function(e){var t,n=[],r,i,s,o="",u=256;for(t=0;t<256;t++)n[t]=String.fromCharCode(t);r=e[0],i=r;for(t=1;t<e.length;t++){s=e.charCodeAt(t);if(n[s])o=n[s];else{if(s!==u)return null;o=r+r.charAt(0)}i+=o,n[u++]=r+o.charAt(0),r=o}return i}(compressed))'.replace("compressed", JSON.stringify(stringy));   
        out.value = res;
               
    }); 
});
