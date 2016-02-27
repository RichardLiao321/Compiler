function parse(){
        putMessage("--------Parsing!-------",0);
        // Grab the next token.
        currentToken = getNextToken();
        // A valid parse derives the PROGRAM production, so begin there.
        parseProgram();
        // Report the results.
        putMessage("Parsing found " + errorCount + " error(s).",0);        
    }//eo parse
	function lookAhead(){
		var x= tokenIndex+1;
        var thisToken;
		thisToken = tokens[x];
        return thisToken;
	}//eo lookAhead
    function getNextToken() {
        var thisToken = EOF;    // Let's assume that we're at the EOF.
        if (tokenIndex < tokens.length){
            // If we're not at EOF, then return the next token in the stream and advance the index.
            thisToken = tokens[tokenIndex];
            putMessage("Current token:" + thisToken.val+" :" +thisToken.printMe(),1);
            tokenIndex++;
        }
        return thisToken;
    }//eo getNextToken()
	function match(st,matchOn){
		var errorMsg="Error at position " + tokenIndex + ": Got "+currentToken.printMe();
		if(tokenIndex < tokens.length){
			switch(matchOn){
				case 0:
					putMessage("Expecting: " +st,1);
					if(currentToken.val==st){
						putMessage('Got: '+currentToken.val,1);
					}else{
						errorCount++;
						putMessage(errorMsg,1);
					}
					currentToken = getNextToken();
					break;
				case 1:
					putMessage("Expecting Type: " +st,1);
					if(currentToken.type==st){
						putMessage('Got Type: '+currentToken.type,1);
					}else{
						errorCount++;
						putMessage(errorMsg,1);
					}
					currentToken = getNextToken();
					break;
			}//eo switch
		}else{
			return
		}//eo if
	}//eo match
	//////////////Non-Terminals/////////////////
    function parseProgram(){
		//program can be a block followed by EOP($)
		parseBlock();
		match('$',0);
		if(tokenIndex<tokens.length){
			parseProgram();
		}
	}//eo parseProgram
	function parseBlock(){
		//{StatementList}
		match('{',0);
		parseStatementList();
		match('}',0);
	}//eo parseBlock
	function parseStatementList(){
		//statement statementlist
		//empty string
		if(currentToken.type=='Keyword'||currentToken.type=='Identifier'||currentToken.type=='Type'||currentToken.type=='LeftBracket'){
			parseStatement();
			parseStatementList();
		}else{
			//do nothing
			return;
		}//eo if

	}//eo parseStatementList
	function parseStatement(){
		var tokenType=currentToken.type;
		switch(tokenType){
			case 'Keyword':
				if(currentToken.val=='Print'){
					//printStmt
					parsePrintStmt();
				}else if(currentToken.val=='If'){
					//ifStmt
					parseIfStmt();
				}else if(currentToken.val=='While'){
					//whileStmt
					parseWhileStmt();
				}//eo else if
				break;
			case 'Identifier':
				parseAssignmentStmt();
				//assigmentStmt
				break;
			case 'Type':
				parseVarDecl();
				//varDecl
				break;
			case 'LeftBracket':
				parseBlock();
				//blockStmt
				break;
			default:
				errorCount++;
				putMessage("Parser Encountered an error on token "+tokenIndex,0);
				break;
		}//eo switch case
	}//eo parseStatement
	function parsePrintStmt(){
		//print (expr)
		match('Print',0);
		match('(',0);
		parseExpr();
		match(')',0);
	}//eo parsePrintStmt
	function parseAssignmentStmt(){
		//Id = expr
		parseId();
		match('=',0);
		parseExpr();
	}//eo parseAssignmentStmt
	function parseVarDecl(){
		//type Id
		parseType();
		parseId();
	}//eo parseVarDecl
	function parseWhileStmt(){
		//while BooleanExpr Block
		match('While',0);
		parseBooleanExpr();
		parseBlock();
	}//eo parseWhileStmt
	function parseIfStmt(){
		//if BooleanExpr Block
		match('If',0);
		parseBooleanExpr();
		parseBlock();
	}//eo parseIfStmt
	function parseExpr(){
		switch(currentToken.type){
			case 'Digit':
				parseIntExpr();
				//intExpr
				break;
			case 'Quote':
				parseStringExpr();
				//StringExpr
				break;
			case 'LeftParen':
				parseBooleanExpr();
				//booleanExpr
				break;
			case 'Boolean Value':
				parseBooleanExpr();
				//booleanExpr
				break;
			case 'Identifier':
				parseId();
				//IdExpr
				break;
			default:
				errorCount++;
				putMessage("Parser Encountered an error on token "+tokenIndex,0);
				break;
		}
	}//eo parseExpr
	function parseIntExpr(){
		//digit intOp Expr
		parseDigit();
		if(currentToken.val=='+'){
			parseIntOp();
			parseExpr();
		}
		//digit
	}//eo parseIntExpr
	function parseStringExpr(){
		match('\"',0);
		parseCharList();
		match('\"',0);
	}//eo parseStringExpr
	function parseBooleanExpr(){
		//(Expr boolOp Expr)
		if(currentToken.val=='('){
			match('(',0);
			parseExpr();
			parseBoolOp();
			parseExpr();
			match(')',0);
		}else{
			//boolVal
			parseBoolVal();
		}
	}//eo parseBoolExpr
	function parseId(){
		match('Identifier',1);
		//char
		//match Char
	}//eo parseId
	function parseCharList(){
		if(currentToken.type=='Quote'){
		//empty 
		//do nothing
			return;
		}else{
			parseChar();
		}
		parseCharList();
	}//eo parseCharList()
	function parseType(){
		switch(currentToken.val){
			case 'Int':
				match('Int',0);
				break;
				//int
			case 'String':
				//string
				match('String',0);
				break;
			case 'Boolean':
				match('Boolean',0);
				break;
				//boolean
		}
	}//eo parseType
	//////////////EO Non-Terminals//////////////////
	//terminals
	function parseChar(){
		if(isLetter(currentToken.val)||currentToken.val==' '){
			//match char
			//match space
			match('String Char',1);
		}else if(!isLetter(currentToken.val)){
			errorCount++;
			putMessage("Parse Error invalid string character: "+ currentToken.val,0);
		}else{
			errorCount++;
			putMessage("Parser Encountered an error on token "+tokenIndex,0);
		}
	}//eo parseChar
	function parseDigit(){
		match('Digit',1);
	}//eo parseDigit
	function parseBoolOp(){
		if(currentToken.type=='Equality'){
			match('==',0);
		}else if(currentToken.type=='Inequality'){
			match('!=',0);
		}
	}//eo parseBoolOp
	function parseBoolVal(){
		if(currentToken.val=='False'){
			match('False',0);
		}else if(currentToken.val=='True'){
			match('True',0);
		}
	}//eo parseBoolVal
	function parseIntOp(){
		if(currentToken.val=='+'){
			match('+',0);
		}
	}//eo parseIntOp
