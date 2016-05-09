var semErrors=0;
var semWarnings=0;
var scope =-1;
function buildSymbolTable(astRoot){
	var rt=astRoot;
	semErrors=0;
    semWarnings=0;
    scope =-1;
    // Recursive function to handle the expansion of the nodes.
    function traverseAST(astNode){
	        // .. recursively expand them.
        if(astNode.name!='block'){
        	//????? cry????
        }else if(astNode.name=='block'){
        	analyzeBlock(astNode);

    	}//eo if else
    }//eo traverseCST
    // Make the initial call to expand from the root.
    traverseAST(rt);
    //traverse symboltable tree. check each entry in symbol map. if used=false, make warning,
	findUnusedId(symbolTable.root);
	putMessage("**NOTE: If assignment fails, variable is counted as unused**" ,0);
    putMessage("Semantic Analysis completed with "+semErrors+" error(s) and "+semWarnings+" warnings" ,0);
	buildSymbolTableTable(symbolTable.root);
}//eo buildSymbolTable

function findUnusedId(symbolTableRoot){
	var rt=symbolTableRoot;
	function traverseSymbolTable(symbolTableNode){
		for(var z in symbolTableNode.symbolMap){
			if(symbolTableNode.symbolMap[z].used==false){
				putMessage("Warning: Unused identifier "+z+" for scope "+symbolTableNode.name,0);
				semWarnings++;
			}
		}//eo for
		for (var i = 0; i < symbolTableNode.children.length; i++){
			traverseSymbolTable(symbolTableNode.children[i]);
		}//eo for
	}//eo traverseSymbolTable()
	traverseSymbolTable(rt);
}//buildSymbolTableTable()

function buildSymbolTableTable(symbolTableRoot){
	var rt=symbolTableRoot;
	function traverseSymbolTable(symbolTableNode){
		printSymbolNode(symbolTableNode);
		for (var i = 0; i < symbolTableNode.children.length; i++){
			traverseSymbolTable(symbolTableNode.children[i]);
		}//eo for
	}//eo traverseSymbolTable()
	putMessage("************Symbol Table #"+ p+"***************",0);
	traverseSymbolTable(rt);
}//buildSymbolTableTable()

function printSymbolNode(symbolTableNode){
	for(var x in symbolTableNode.symbolMap){
		putMessage("ID: "+x+" Type: "+symbolTableNode.symbolMap[x].type+" Scope: "+symbolTableNode.name+" Line: "+symbolTableNode.symbolMap[x].line,0);
	}//eo for
}//eo symbolTableNode

function analyzeBlock(astNode){
	if(astNode.name=='block'){
		putMessage("Got block Analyzing: "+astNode.name+" on line "+astNode.line,0);
		scope++;
		symbolTable.addSymbolNode(scope,'branch',astNode.line);
		analyzeBlockChildren(astNode);
		symbolTable.endChildren();
	}else{
		console.log("You're calling this in the wrong place you dope");
	}//eo if else
}//eo checkBlock
function analyzeBlockChildren(astNode){
	if(astNode.children.length>0){
		for(var i1 = 0; i1<astNode.children.length;i1++){
			analyzeASTNode(astNode.children[i1]);
		}//eo for
	}//eo if
}//eo analyzeBlockChildren
function analyzeASTNode(astNode){
	putMessage("current scope = "+symbolTable.current.name+" for "+astNode.name,1);
	switch(astNode.name){
		case 'block':
			analyzeBlock(astNode);
			break;
		case 'vardecl':
			putMessage("Analyzing: "+astNode.name+" on line "+astNode.line,1)
			analyzeVardecl(astNode);
			break;
		case 'assign':
			putMessage("Analyzing: "+astNode.name+" on line "+astNode.line,1)
			analyzeAssign(astNode)
			break;
		case 'print':
			putMessage("Analyzing: "+astNode.name+" on line "+astNode.line,1)
			analyzePrint(astNode)
			break;
		case 'if':
			putMessage("Analyzing: "+astNode.name+" on line "+astNode.line,1)
			analyzeIfWhile(astNode);
			break;
		case 'while':
			putMessage("Analyzing: "+astNode.name+" on line "+astNode.line,1)
			analyzeIfWhile(astNode);
			break;
	}//eo switch
}//eo analyzeASTNode
function lookUpNode(astNode,scope){
	//console.log("looking up "+astNode.name+" in scope "+scope.name);
	var currScope = scope;
	var symbolTableResult = scope.symbolMap[astNode.name];
	//check current scope for symbol
	if(symbolTableResult!=undefined){
		//if it exists in current scope return
		putMessage("Found "+astNode.name+" in scope "+currScope.name+" with type "+symbolTableResult.type,1);
		//astNode.used=true;
		return symbolTableResult;
	}else{
		//else check parents until root
		while(currScope!=symbolTable.root){
			//loop until at root
			currScope=currScope.parent;
			putMessage("checking scope: "+currScope.name+" for "+astNode.name,1);
			symbolTableResult = currScope.symbolMap[astNode.name];
			if(symbolTableResult!=undefined){
				//if not undefined then symbol found
				putMessage("Found "+astNode.name+" in scope "+currScope.name+" with type "+symbolTableResult.type,1);
				
			}//eo if
		}//eo while
		return symbolTableResult;
	}//eo if else
}//eo analyzeASTNode

function analyzeVardecl(astNode){
	var idNode = astNode.children[1];
	var valNode = astNode.children[0];
	putMessage("Got Vardecl. Checking id "+idNode.name +" against value "+valNode.name+" on line "+ astNode.line,1);
	if(symbolTable.current.symbolMap[idNode.name]!==undefined){
		//check to see if current scope has this id already
		putMessage("Error: Id("+idNode.name+") on line "+astNode.line + " already declared to type "+symbolTable.current.symbolMap[idNode.name].type+" for scope "+symbolTable.current.name,0);
		semErrors++;
	}else{
		//add it to symbol table at current scope
		putMessage("Adding "+idNode.name +" to symbol table with type of "+ valNode.name+" on line "+astNode.line,1);
		symbolTable.addSymbolEntry(idNode.name,undefined,valNode.name,astNode.line,symbolTable.current.name);
	}//eo if
}//eo analyzeVardecl

function analyzeIfWhile(astNode){
    if (astNode.children[0].name =='!='||astNode.children[0].name =='=='){
        var compChild = astNode.children[0];
        putMessage("Got Comparison on line "+astNode.children[0].line,1);
        analyzeBoolExpr(compChild);
        analyzeBlock(astNode.children[1]);
    }else if (astNode.children[0].name == 'True'||astNode.children[0].name == 'False') {
        //why is while/if boolVal a thing?????
        putMessage("Got boolVal "+astNode.children[0].name+" on line "+astNode.children[0].line,1);
        analyzeBlock(astNode.children[1]);
    }else{
		putMessage("Error: on line "+astNode.line,0);
		semErrors++;			
    }
}//eo analyzeIfWhile

function analyzeAssign(astNode){
	var idNode = astNode.children[0];
	var valNode = astNode.children[1];
	var leftType = analyzeTypeExpr(idNode);
	var rightType = analyzeTypeExpr(valNode)
	if(leftType==rightType){
		putMessage("Valid assignment",1);
		var idNodeType= lookUpNode(idNode,symbolTable.current);
		var valNodeType= lookUpNode(valNode,symbolTable.current);
		//*****************LATER CHANGE THIS TO A REAL VALUE************************
		idNodeType.value = valNode.name;
		idNodeType.used = true;
		//check right hand expr for id. Look up ID for value.
		if(isLetter(valNode.name)){
			if(valNodeType.value==undefined){
				putMessage("Warning: Identifier("+valNode.name+") is used before it is initialized for scope "+symbolTable.current.name + " on Line "+valNode.line,0);
				semWarnings++;
			}
		}

	}else if(leftType!=rightType&&leftType!=undefined&&rightType!=undefined){
		putMessage("Error: Type mismatch.("+ idNode.name+")"+leftType+" vs ("+ valNode.name+")" + rightType+" on line "+astNode.line ,0);
		semErrors++;
	}
}//eo analyzeAssign

function analyzeBoolExpr(astNode){
	var left = astNode.children[0];
	var right = astNode.children[1];
	var leftEntry=analyzeTypeExpr(left);
	var rightEntry=analyzeTypeExpr(right);
	var isValid= false;

	putMessage("Comparing: "+ leftEntry+" vs "+rightEntry,1);
	if(leftEntry==rightEntry){
		//return 'Boolean'
		isValid = true;
	}else if(leftEntry!=rightEntry&&leftEntry!=undefined&&rightEntry!=undefined){
		putMessage("Error: Type mismatch on line "+ astNode.line+" Got "+leftEntry+" vs "+rightEntry,0);
		semErrors++;
		isValid=false	
	}//eo if else
	return isValid;
}//eo analyzeBoolExpr

function analyzeTypeExpr(astNode){
	var type;
	var name= astNode.name;
	//console.log(astNode.name);
	if(isLetter(name)){
		//console.log("name: "+name);
		var x = lookUpNode(astNode,symbolTable.current);
		if(x==undefined){
			//error
			putMessage("Error: Identifier("+astNode.name+") not found in symbol table ",0);//
			semErrors++;
			return 'error';
		}else{
			x.used=true;
			type = x.type;
		}
	}else if(isInt(name)){
		type = 'Int';
	}else if(name=='True'|| name=='False'){
		type = 'Boolean';
	}else if(name.indexOf('\"')!=-1){
		type = 'String';
	}else if(name=='+'){
		//console.log(yo);
		if(analyzeIntExpr(astNode)){
			type = 'Int'
		}
	}else if(name=='=='||name=='!='){
		if(analyzeBoolExpr(astNode)){
			type='Boolean';
		}
        //analyzeBlock(astNode.children[1]);
	}else{
		putMessage("SOMETHING WENT WRONG ON LINE "+astNode.line,0);
	}
	return type;
}//eo analyzeTypeExpr

function analyzePrint(astNode){
	if(isLetter(astNode.children[0].name)){
		//if the child is an id.
		var id = lookUpNode(astNode.children[0],symbolTable.current);
		if(id==undefined){
			putMessage("Error: Identifier("+astNode.children[0].name+") not found in symbol table ",0);//
			semErrors++;
		}else if(id.value==undefined){
			putMessage("Warning: Identifier("+astNode.children[0].name+") not initialized ",0);
			semWarnings++;
		}//eo if else
	}//eo if
}//eo analyzePrint
function analyzeIntExpr(astNode){
	var left = astNode.children[0];
	var right = astNode.children[1];
	var leftType =analyzeTypeExpr(left);
	var rightType=analyzeTypeExpr(right);
	//var rightEntry = lookUpNode(right,symbolTable.current);
	var isValid = false;
	putMessage("Comparing: "+ left.name+" vs "+right.name,1);
	if(right.name=='+'){
		return analyzeIntExpr(right);
	}else if(isInt(left.name)&&leftType==rightType){
		putMessage("Int Expression is valid",1);
		//*****************LATER CHANGE THIS TO A REAL VALUE************************
		//symbolEntry.value = right.name;
		isValid = true;
	}else if(analyzeTypeExpr(left)!=analyzeTypeExpr(right)){
		putMessage("Error: Type mismatch on line "+ astNode.line+" Got "+leftType+" vs "+rightType,0);
		semErrors++;
		
	}
	return isValid;
}//eo analyzeIntExpr

//find a return the node that matches the param
function findSymbolScope(scopeToFind){
	var symbolRoot = symbolTable.root;
	var s;
	function traverseSymbolTable(symbolTableNode){
		//console.log(symbolTableNode.name +" vs "+scopeToFind);
		if(symbolTableNode.name==scopeToFind.toString()){
				s = symbolTableNode;
		}					
		for (var i = 0; i < symbolTableNode.children.length; i++){
			traverseSymbolTable(symbolTableNode.children[i]);
		}//eo for
	}//eo traverseSymbolTable()
	traverseSymbolTable(symbolRoot);
	return s;
}//eo findSymbolScope


