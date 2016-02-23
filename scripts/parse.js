function parse(){
        putMessage("--------Parsing!-------");
        // Grab the next token.
        currentToken = getNextToken();
        // A valid parse derives the PROGRAM production, so begin there.
        parseProgram();
        // Report the results.
        putMessage("Parsing found " + errorCount + " error(s).");        
    }//eo parse
	function checkToken(expectedKind) {
        // Validate that we have the expected token kind and et the next token.
        switch(expectedKind) {
            case "digit":   putMessage("Expecting a digit");
                            if (currentToken=="0" || currentToken=="1" || currentToken=="2" || 
                                currentToken=="3" || currentToken=="4" || currentToken=="5" || 
                                currentToken=="6" || currentToken=="7" || currentToken=="8" || 
                                currentToken=="9")
                            {
                                putMessage("Got a digit!");
                            }
                            else
                            {
                                errorCount++;
                                putMessage("NOT a digit.  Error at position " + tokenIndex + ".");
                            }
                            break;
            case "op":      putMessage("Expecting an operator");
                            if (currentToken=="+" || currentToken=="-")
                            {
                                putMessage("Got an operator!");
                            }
                            else
                            {
                                errorCount++;
                                putMessage("NOT an operator.  Error at position " + tokenIndex + ".");
                            }
                            break;
            default:        putMessage("Parse Error: Invalid Token Type at position " + tokenIndex + ".");
                            break;			
        }
        // Consume another token, having just checked this one, because that 
        // will allow the code to see what's coming next... a sort of "look-ahead".
        currentToken = getNextToken();
    }

    function getNextToken() {
        var thisToken = EOF;    // Let's assume that we're at the EOF.
        if (tokenIndex < tokens.length){
            // If we're not at EOF, then return the next token in the stream and advance the index.
            thisToken = tokens[tokenIndex];
            putMessage("Current token:" + thisToken.val);
            tokenIndex++;
        }
        return thisToken;
    }//eo getNextToken()
	function match(st){
		putMessage("Expecting: " +st);
		if(currentToken.val==st){
			putMessage('Got: '+st);
		}else{
			errorCount++;
            putMessage("Error at position " + tokenIndex + ": Got "+"st");
		}
		currentToken = getNextToken();
	}//eo match
	//////////////Non-Terminals/////////////////
    function parseProgram(){
		//program can be a block followed by EOP($)
		parseBlock();
		match('$');
	}//eo parseProgram
	function parseBlock(){
		//{StatementList}
		match('{');
		parseStatementList();
		match('}');
	}//eo parseBlock
	function parseStatementList(){
		//statement statementlist
		//empty string
	}//eo parseStatementList
	function parseStatement(){
		//printStmt
		//assigmentStmt
		//varDecl
		//whileStmt
		//ifStmt
		//blockStmt
	}//eo parseStatement
	function parsePrintStmt(){
		//print (expr)
		match('print');
		match('(');
		parseExpr();
		match(')');
	}//eo parsePrintStmt
	function parseAssignmentStmt(){
		//Id = expr
		parseId();
		match('=');
		parseExpr();
	}//eo parseAssignmentStmt
	function parseVarDecl(){
		//type Id
		parseType();
		parseId();
	}//eo parseVarDecl
	function parseWhileStmt(){
		//while BooleanExpr Block
		match('while');
		parseBooleanExpr();
		parseBlock();
	}//eo parseWhileStmt
	function parseIfStmt(){
		//if BooleanExpr Block
		match('if');
		parseBooleanExpr();
		parseBlock();
	}//eo parseIfStmt
	function parseExpr(){
		//intExpr
		//stringExpr
		//booleanExpr
		//IdExpr
	}//eo parseExpr
	function parseIntExpr(){
		//digit intOp Expr
		//digit
	}//eo parseIntExpr
	function parseStringExpr(){
		match('\"');
		parseCharList();
		match('\"');
	}//eo parseStringExpr
	function parseBoolExpr(){
		//(Expr boolOp Expr)
		match('(');
		parseExpr();
		parseBoolOp();
		parseExpr();
		parseBoolVal();
		match(')');
	}//eo parseBoolExpr
	function parseId(){
		//char
		//match Char
	}//eo parseId
	function parseCharList(){
		//match char
		//match space
		//empty 
		parseCharList();
		
	}//eo parseCharList()
	function parseType(){
		//int
		//string
		//boolean
	}//eo parseType
	//////////////EO Non-Terminals//////////////////
	//terminals
	function parseChar(){
		
	}//eo parseChar
	function parseSpace(){
		
	}//eo parseSpace???
	function parseDigit(){
		
	}//eo parseDigit
	function parseBoolOp(){
		
	}//eo parseBoolOp
	function parseBoolVal(){
		match('false');
		match('true')
	}//eo parseBoolVal
	function parseIntOp(){
		match('+');
	}//eo parseIntOp
	//ALAN'S PARSE
    function parseG() {
        // A G(oal) production can only be an E(xpression), so parse the E production.
        parseE();
    }
	//////////EO Terminals///////////////
    function parseE() {
        // All E productions begin with a digit, so make sure that we have one.
        checkToken("digit");
        // Look ahead 1 char (which is now in currentToken because checkToken 
        // consumes another one) and see which E production to follow.
        if (currentToken != EOF) {
            // We're not done, we we expect to have an op.
            checkToken("op");
            parseE();
        } else {
            // There is nothing else in the token stream, 
            // and that's cool since E --> digit is valid.
            putMessage("EOF reached");
        }
    }
