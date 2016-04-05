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
		var x = tokenIndex+1;
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
		var errorMsg="Error: unable to match at token index:" + tokenIndex;
		if(tokenIndex <= tokens.length){
			switch(matchOn){
				case 0:
					putMessage("Expecting: " +st,1);
					if(currentToken.val==st){
						CST.addNode(st,'leaf');
						putMessage('Got: '+currentToken.val,1);
					}else{
						errorCount++;
						putMessage(errorMsg,0);
					}
					currentToken = getNextToken();
					break;
				case 1:
					putMessage("Expecting Type: " +st,1);
					if(currentToken.type==st){
						CST.addNode(currentToken.val,'leaf');
						putMessage('Got Type: '+currentToken.type,1);
					}else{
						errorCount++;
						putMessage(errorMsg,0);
					}
					currentToken = getNextToken();
					break;
			}//eo switch
		}else if(tokenIndex >= tokens.length){
			//do nothing
			return;
		}//eo if
		//CST.endChildren();
	}//eo match
	//////////////Non-Terminals/////////////////
    function parseProgram(){
		//program can be a block followed by EOP($)
		CST.addNode('root','branch');
		parseBlock();
		match('$',0);
		if(tokenIndex<tokens.length){
			parseProgram();
		}
	}//eo parseProgram
	function parseBlock(){
		//{StatementList}
		CST.addNode('block','branch');
		match('{',0);
		parseStatementList();
		match('}',0);
		CST.endChildren();
	}//eo parseBlock
	function parseStatementList(){
		//statement statementlist
		//empty string
		CST.addNode('statement list','branch');
		if(currentToken.type=='Keyword'||currentToken.type=='Identifier'||currentToken.type=='Type'||currentToken.type=='LeftBracket'){
			parseStatement();
			parseStatementList();
		}else{
			//do nothing
			CST.endChildren();
			return;
		}//eo if
		CST.endChildren();
	}//eo parseStatementList
	function parseStatement(){
		//CST.addNode('statement','branch');
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
				putMessage("Error: unable to parse statement at token index:"+tokenIndex,0);
				//currentToken = getNextToken();
				break;
		}//eo switch case
		//CST.endChildren();
	}//eo parseStatement
	function parsePrintStmt(){
		CST.addNode('print stmt','branch');
		//print (expr)
		match('Print',0);
		match('(',0);
		parseExpr();
		match(')',0);
		CST.endChildren();
	}//eo parsePrintStmt
	function parseAssignmentStmt(){
		CST.addNode('assignment stmt','branch');
		//Id = expr
		parseId();
		match('=',0);
		parseExpr();
		CST.endChildren();
	}//eo parseAssignmentStmt
	function parseVarDecl(){
		CST.addNode('vardecl','branch');
		//type Id
		parseType();
		parseId();
		CST.endChildren();
	}//eo parseVarDecl
	function parseWhileStmt(){
		CST.addNode('while stmt','branch');
		//while BooleanExpr Block
		match('While',0);
		parseBooleanExpr();
		parseBlock();
		CST.endChildren();
	}//eo parseWhileStmt
	function parseIfStmt(){
		CST.addNode('if stmt','branch');
		//if BooleanExpr Block
		match('If',0);
		parseBooleanExpr();
		parseBlock();
		CST.endChildren();
	}//eo parseIfStmt
	function parseExpr(){
		//CST.addNode('Expr','branch');
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
				putMessage("Error: unable to parse expr at token index:"+tokenIndex,0);
				break;
		}
		//CST.endChildren();
	}//eo parseExpr
	function parseIntExpr(){
		CST.addNode('IntExpr','branch');
		//digit intOp Expr
		parseDigit();
		if(currentToken.val=='+'){
			parseIntOp();
			parseExpr();
		}
		CST.endChildren();
		//digit
	}//eo parseIntExpr
	function parseStringExpr(){
		CST.addNode('string','branch');
		match('\"',0);
		parseCharList();
		match('\"',0);
		CST.endChildren();
	}//eo parseStringExpr
	function parseBooleanExpr(){
		CST.addNode('booleanExpr','branch');
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
		CST.endChildren();
	}//eo parseBoolExpr
	function parseId(){
		CST.addNode('identifier','branch');
		match('Identifier',1);
		//char
		//match Char
		CST.endChildren();
	}//eo parseId
	function parseCharList(){
		CST.addNode('string char','branch');

		if(currentToken.type=='Quote'){
		//empty 
		//do nothing
			return;
		}else{
			parseChar();
		}
		
		parseCharList();
		CST.endChildren();
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
		}else if(currentToken.val==' '){
			match('String Char',1);
		}else{
			errorCount++;
			putMessage("Error: Unable to parse char at "+tokenIndex,0);
			currentToken = getNextToken();
			return;
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
