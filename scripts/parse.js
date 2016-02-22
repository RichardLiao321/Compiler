function parse() {
        putMessage("Parsing [" + tokens + "]");
        // Grab the next token.
        currentToken = getNextToken();
        // A valid parse derives the PROGRAM production, so begin there.
        parseProgram();
        // Report the results.
        putMessage("Parsing found " + errorCount + " error(s).");        
    }
    function parseProgram(){
		//program can be a block followed by EOP($)
		parseBlock();
		match('$');
	}
	function parseBlock(){
		//{StatementList}
		match('{');
		parseStatementList();
		match('}');
	}
	function parseStatementList(){
		//statement statementlist
		//empty string
	}
	function parseStatement(){
		//printStmt
		//assigmentStmt
		//varDecl
		//whileStmt
		//ifStmt
		//blockStmt
	}
	function parsePrintStmt(){
		//print (expr)
		match('print');
		match('(');
		parseExpr();
		match(')');
	}
	function parseAssignmentStmt(){
		//Id = expr
		parseId();
		match('=');
		parseExpr)();
	}
	function parseVarDecl(){
		//type Id
		parseType();
		parseId();
	}
	function parseWhileStmt(){
		//while BooleanExpr Block
		match('while');
		parseBooleanExpr();
		parseBlock();
	}
	function parseIfStmt(){
		//if BooleanExpr Block
		match('if');
		parseBooleanExpr();
		parseBlock();
	}
	function parseExpr(){
		//intExpr
		//stringExpr
		//booleanExpr
		//IdExpr
	}
	function parseIntExpr(){
		//digit intOp Expr
		//digit
	}
	function parseStringExpr(){
		match('\"');
		parseCharList();
		match('\"');
	}
	function parseBoolExpr(){
		//(Expr boolOp Expr)
		match('(');
		parseExpr();
		parseBoolOp();
		parseExpr();
		parseBoolVal();
		match(')');
	}
	function parseId(){
		//char
		//match Char
	}
	function parseCharList(){
		//match char
		//match space
		//empty 
		parseCharList();
		
	}
	function parseType(){
		//int
		//string
		//boolean
	}
	function parseChar(){
		
	}
	function parseSpace(){
		
	}
	function parseDigit(){
		
	}
	function parseBoolOp(){
		
	}
	function parseBoolVal(){
		
	}
	function parseIntOp(){
		match('+')
	}
    function parseG() {
        // A G(oal) production can only be an E(xpression), so parse the E production.
        parseE();
    }

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
        if (tokenIndex < tokens.length)
        {
            // If we're not at EOF, then return the next token in the stream and advance the index.
            thisToken = tokens[tokenIndex];
            putMessage("Current token:" + thisToken);
            tokenIndex++;
        }
        return thisToken;
    }