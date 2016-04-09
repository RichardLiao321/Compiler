function parse(){
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
		CST.addNode('statement','branch');
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
				currentToken = getNextToken();
				break;
		}//eo switch case
		CST.endChildren();
	}//eo parseStatement
	function parsePrintStmt(){
		CST.addNode('print','branch');
		//print (expr)
		match('Print',0);
		match('(',0);
		parseExpr();
		match(')',0);
		CST.endChildren();
	}//eo parsePrintStmt
	function parseAssignmentStmt(){
		CST.addNode('assign','branch');
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
		CST.addNode('while','branch');
		//while BooleanExpr Block
		match('While',0);
		//match('(',0);
		parseBooleanExpr();
		//match(')',0);
		parseBlock();
		CST.endChildren();
	}//eo parseWhileStmt
	function parseIfStmt(){
		CST.addNode('if','branch');
		//if BooleanExpr Block
		match('If',0);
		//match('(',0);
		parseBooleanExpr();
		//match(')',0);
		parseBlock();
		CST.endChildren();
	}//eo parseIfStmt
	function parseExpr(){
		CST.addNode('expr','branch');
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
		CST.endChildren();
	}//eo parseExpr
	function parseIntExpr(){
		CST.addNode('intExpr','branch');
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
	function parseCharList(){
		if(currentToken.type=='Quote'){
		//empty 
		//do nothing
			return;
		}else{
			//CST.addNode('string','branch');
			match('String',1);
		}
		parseCharList();
		//CST.endChildren();
	}//eo parseCharList()
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
///////////////////////AST PART//////////////////////////////////
///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
function cstToAst(){
		var rt=CST.root.children[0];
        // Recursive function to handle the expansion of the nodes.
        function traverseCST(cstNode){
	    	//putMessage(AST.current.name);
	        //check current Node for stmt
	        if (cstNode.name!='block'){
	        	//?????
	        }else{
		        checkBlock(cstNode);
		        // .. recursively expand them.
		        for (var i = 0; i < cstNode.children.length; i++){
		            traverseCST(cstNode.children[i]);
		        }
		    }
	    }//eo traverseCST
        // Make the initial call to expand from the root.
        traverseCST(rt);
	}//eo cstToAst

    function checkBlock(cstNode){
    	if(cstNode.name=='block'){
			AST.addNode('block','branch');
			checkStmtList(cstNode.children[1]);
			AST.endChildren();
		}else{

			console.log("You're calling this in the wrong place you dope");
		}
    }//eo checkBlock
    function checkStmtList(cstNode){
    	if(cstNode.children.length>1){
    		checkNode(cstNode.children[0]);
    		//console.log("0"+cstNode.children[0].name);
    		checkStmtList(cstNode.children[1]);
    		//console.log("1"+cstNode.children[1].name);
    		AST.endChildren();
    	}else{
    		return;
    	}
    }//eo checkStmtList
	//check the branch Node to see if it fits a terminal stmt
	function checkNode(cstNode){
		var cstNode= cstNode.children[0];
		switch(cstNode.name) {
			case 'block':
				checkBlock(cstNode);
				break;
			case 'print':
				//putMessage('Print here: '+cstNode.parent.name,0);
				AST.addNode('print','branch');
				checkNodeExpr(cstNode);
				AST.endChildren();
				break;
			case 'assign':
				//create assign branch node
				AST.addNode('assign','branch');
				//add var name as child
				AST.addNode(cstNode.children[0].children[0].name,'leaf')
				//check expr for proper child
				checkNodeExpr(cstNode);
				//end children
				AST.endChildren();
				break;
			case 'vardecl':
				//putMessage('vardecl here: '+cstNode.parent.name,0);
				AST.addNode('vardecl','branch');
				AST.addNode(cstNode.children[0].name,'leaf');
				AST.addNode(cstNode.children[1].children[0].name,'leaf');
				//AST.endChildren();
				break;
			case 'while':
				//putMessage('while here: '+cstNode.parent.name,0);
				AST.addNode('while','branch');
				checkNodeBoolExpr(cstNode.children[1]);
				checkBlock(cstNode.children[2]);
				AST.endChildren();
				break;
			case 'if':
				//putMessage('if: '+cstNode.parent.name,0);
				AST.addNode('if','branch');
				checkNodeBoolExpr(cstNode.children[1]);
				checkBlock(cstNode.children[2]);
				AST.endChildren();
				break;
		}//eo switch

	}//eo checkNode
	//check a node's children for a matched expr pattern
	function checkNodeExpr(cstNode){
		//check each child for an Expr Node. Match it.
		//console.log('cstNode: '+cstNode.name);
	    for (var i = 0; i < cstNode.children.length; i++){
	    	//console.log('child: '+i+' '+cstNode.children[i].name);
			if(cstNode.children[i].name=='expr'){
            	var exprNode = cstNode.children[i];
            	switch(exprNode.children[0].name){
            		//expr always has one child that is the name of the expr type
            		case 'intExpr':
            		//console.log(exprNode.children[0].children.length);
            			if(exprNode.children[0].children.length>1){
            				//if length is >1, it is digit intop expr
            				//putMessage('booleanExpr0 ',0);
            				AST.addNode('+','branch');
            				AST.addNode(exprNode.children[0].children[0].name,'leaf');
            				checkNodeExpr(exprNode.children[0]);
            				AST.endChildren();
            			}else{
            				AST.addNode(exprNode.children[0].children[0].name,'leaf');
            				//else it is single
            			}//eo if else
            			break;
            		case 'string':
            			var nodeName= exprNode.children[0].children[1].name;
            			AST.addNode(nodeName,'leaf');
            			break;
            		case 'booleanExpr':
            			checkNodeBoolExpr(exprNode.children[0]);
            			break;
            		case 'identifier':
            			//child is second id
            			AST.addNode(exprNode.children[0].children[0].name,'leaf');
            			//AST.endChildren();
            			break;
            	}//eo switch
            }
        }//eo for
	}//eo checkNodeExpr
	function checkNodeBoolExpr(cstNode){
		if(cstNode.name=='booleanExpr'){
			//double check to see if it is boolExpr :/
			if(cstNode.children.length>1){
				//if the length is >1 it is ( expr boolop expr )
				AST.addNode(cstNode.children[2].name,'branch');
				//console.log("bool expr 1"+cstNode.children[1].name);
				//console.log("bool expr 3"+cstNode.children[1].name);
				checkNodeExpr(cstNode);
				//checkNodeExpr(cstNode);
				AST.endChildren();
            }else{
            	//single boolVal
            	AST.addNode(cstNode.children[0].name,'leaf');
            }
            //
		}else{
			//something went wrong. How did this happen.
			console.log("checkNodeBoolExpr called on non-boolexpr: "+cstNode.name);
			return
		}//eo if
	}//eo checkNodeBoolExpr
