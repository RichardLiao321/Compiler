var semErrors
var semWarnings;
var scope =-1;
function buildSymbolTable(astRoot){
		var rt=astRoot;
        // Recursive function to handle the expansion of the nodes.
        function traverseAST(astNode){
		        // .. recursively expand them.
		        console.log(astNode.name);
		        analyzeASTNode(astNode);
	        if(astNode.name!='block'){

	        }else if(astNode.name=='block'){
	        	
		        for (var i = 0; i < astNode.children.length; i++){
		            traverseAST(astNode.children[i]);
		        }//eo for
	    	}//eo if else
	    }//eo traverseCST
        // Make the initial call to expand from the root.
        traverseAST(rt);
}//eo buildSymbolTable
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
}//eo checkStmtList
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

function analyzeVardecl(astNode){
	var idNode = astNode.children[1];
	var valNode = astNode.children[0];
	putMessage("Got Vardecl. Checking id "+idNode.name +" against value "+valNode.name+" on line "+ astNode.line,1);
	if(symbolTable.current.symbolMap[idNode.name]!==undefined){
		//check to see if current scope has this id already
		putMessage("Error: Identifier ("+idNode.name+") on line "+astNode.line + " already declared to type "+symbolTable.current.symbolMap[idNode.name],0);
		semErrors++;
	}else{
		//add it to symbol table at current scope
		putMessage("Adding "+idNode.name +" to symbol table with value of "+ valNode.name+" one line "+astNode.line,1);
		symbolTable.current.symbolMap[idNode.name]=valNode.name

	}//eo if
}//eo analyzeVardecl
function analyzeAssign(astNode){
	var idNode = astNode.children[0];
	var valNode = astNode.children[1];
	putMessage("Got Assign. Checking id "+idNode.name+" against value "+valNode.name +" on line "+ astNode.line,1);
	analyzeNodeType(astNode,idNode.name,valNode);
}//eo analyzeAssign
function analyzeIfWhile(astNode){

}//eo analyzeVardecl
function analyzePrint(astNode){

}//eo analyzePrint
function analyzeNodeType(astNode,id,value){
	var nodeType = symbolTable.current.symbolMap[id];
	if(nodeType===undefined){
		//id has no entry
		//possibly check parent scope
		putMessage("Error: Identifier("+id+") not found in scope "+symbolTable.current.name,0);
		semErrors++;
	}else if(nodeType!=undefined){
		switch(nodeType){
			case 'Int':
				if(isInt(value.name)){
					putMessage("Id "+id+" is type "+nodeType,1);

				}else{
					putMessage("Error: Type mismatch on line "+ astNode.line+". Id "+id+" is type "+nodeType+" got "+value.name,0);
					semErrors++;
				}
				break;
			case 'Boolean':
				if(value.name=='True'||value.name=='False'){
					putMessage("Id "+id+" is type "+nodeType,1);
				}else{
					putMessage("Error: Type mismatch on line "+ astNode.line+". Id "+id+" is type "+nodeType+" got "+value.name,0);
					semErrors++;
				}
				break;
			case 'String':
				if(isLetter(value.name)){
					putMessage("Id "+id+" is type "+nodeType,1);

				}else{
					putMessage("Error: Type mismatch on line "+ astNode.line+". Id "+id+" is type "+nodeType+" got "+value.name,0);
					semErrors++;
				}
				break;

		}//eo switch

	}//eo else if

}//eo analyzeNodeType

