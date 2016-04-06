/* --------  
   Utils.js

   Utility functions.
   -------- */
function myEvent(){
	console.log("hello!");
}
function trim(str)      // Use a regular expression to remove leading and trailing spaces.
{
	return str.replace(/^\s+ | \s+$/g, "");
	/* 
	Huh?  Take a breath.  Here we go:
	- The "|" separates this into two expressions, as in A or B.
	- "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
    - "\s+$" is the same thing, but at the end of the string.
    - "g" makes is global, so we get all the whitespace.
    - "" is nothing, which is what we replace the whitespace with.
	*/
	
}

function rot13(str)     // An easy-to understand implementation of the famous and common Rot13 obfuscator.
{                       // You can do this in three lines with a complex regular experssion, but I'd have
    var retVal = "";    // trouble explaining it in the future.  There's a lot to be said for obvious code.
    for (var i in str)
    {
        var ch = str[i];
        var code = 0;
        if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0)
        {            
            code = str.charCodeAt(i) + 13;  // It's okay to use 13.  It's not a magic number, it's called rot13.
            retVal = retVal + String.fromCharCode(code);
        }
        else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0)
        {
            code = str.charCodeAt(i) - 13;  // It's okay to use 13.  See above.
            retVal = retVal + String.fromCharCode(code);
        }
        else
        {
            retVal = retVal + ch;
        }
    }
    return retVal;
}
//simple function that returns a substring. Intended for looking ahead for context.
function checkNextChar(str, start, num){
	var input = str;
	var x=start+1;
	var y=num;
	var out=input.substr(x,y);
	//console.log("lookAhead: "+out)
	return out;
}//eo lookAhead
//simple function to check if a string(char) is only letters
function isLetter(str) {
	//console.log("letter???: "+str)
	return /^[a-z]+$/.test(str);
}//eo lookAhead
function testPrograms(progNo){
	if(progNo == 1){
            document.getElementById("taSourceCode").value = "";
            document.getElementById("taSourceCode").value ="{}$";
        }else if(progNo == 2){
            document.getElementById("taSourceCode").value = "";
            document.getElementById("taSourceCode").value ="{\n\tboolean a\n\ta = 1\n\n\tint b\n\tb = 2\n\n\ta = b\n\tb = n\n}$";
        }else if(progNo == 3){
            document.getElementById("taSourceCode").value = "";
            document.getElementById("taSourceCode").value = "{\n\tint a\n\ta = 1\n\n\tif(a == 1) {\n\t\ta = 2\n\t}\n\n\tif(a != 1) {\n\t\ta = 3\n\t}\n} $";
        }else if(progNo == 4){
            document.getElementById("taSourceCode").value = "";
            document.getElementById("taSourceCode").value = "{\n\tint x\n\tx = 0\n\n\twhile (x != 5)\n\t{\n\t\tprint((true==false))\n\t\tx = 1 + x\n\t}\n} $";
        }else if(progNo == 5){
            document.getElementById("taSourceCode").value = "";
            document.getElementById("taSourceCode").value ="{\n\tint x\n\tx = 1\n\n\t{\n\n\t\tint x\n\t\tx = 2\n\t\t{\n\t\t\tx = 5\n\t\t}\n\n\t\tprint(x)\n\t}\n\tprint(x)\n} $";
        }else if(progNo == 6){
            document.getElementById("taSourceCode").value = "";
            document.getElementById("taSourceCode").value ="{\n\tintx\n\tx = 1\n\n\t{\n\n\t\tint x\n\t\tx = 2\n\t\t{\n\t\t\tx = 5\n\t\t}\n\n\t\tprint(x)\n\t}\n\tprint(x)\n \tx=22\n}$";
        }
}
//replace all function
String.prototype.replaceAll = function(str1, str2, ignore){
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 