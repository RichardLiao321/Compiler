/* lexer.js  */

    function lex(){
        // Grab the "raw" source code.
        var sourceCode = document.getElementById("taSourceCode").value;
        // Trim the leading and trailing spaces.
        sourceCode = trim(sourceCode);
        //remove line breaks too.
		sourceCode = sourceCode.replace(/(\r\n|\n|\r)/gm,"");
		//remove all spaces in the middle;
		sourceCode = sourceCode.replace(/\s/g,'');
        return sourceCode;
    }

