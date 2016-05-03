/*
TODO
How to evaluate int expr like 1+1+1+3?
how to do assignment? look up from static table?
*/
var codeGenErrors=0;
var codeGenWarnings=0;
var staticTable={};
var jumpTable={};
var tempCt;
var varScope = -1;
//Add an entry to the static table.
function addStaticEntry(temp,variable,scope,address){
    var newStatic = {
        temp:temp,//temp is just T0. Not T0 XX
        variable:variable,
        scope:scope,
        address:address,
        toString:function(){
            putMessage("Temp: "+temp+" Var: "+variable + " scope: "+scope +" address: "+address,1);
        }
    };
    //index entries on varName and scope combo.
    staticTable[temp]=newStatic;
    //newStatic.toString();
    //staticTable.push(newStatic);
};//eo addSymbolEntry
//print static table
function staticTabletoString(){
    putMessage("printing static table....",1);
    //console.log(Object.keys(staticTable).length)//0;
    for(var i = 0; i<Object.keys(staticTable).length;i++){
        staticTable['T'+i].toString();
    }
}//eo staticTabletoString
//Add a new entry to the jump table
function addJumpEntry(temp,dist){
    var newJump = {
        dist:dist,
        toString:function(){
            putMessage("Temp: "+temp+" dist: "+variable,1);
        }
    };
    //jumpTable[temp]=newJump;
    jumpTable.push(newJump);
};//eo addJumpEntry

function generateCode(astRoot){
	var rt=astRoot;
    //reset globals
	codeGenErrors=0;
    codeGenWarnings=0;
    varCt=-1;
    jumpCt=-1;
    staticTable={};
    jumpTable={};
    varScope = -1;

    function traverseAST(astNode){
        if(astNode.name=='block'){
        	generateBlock(astNode);
    	}
    }//eo traverseAST
    // Make the initial call to expand from the root.
    traverseAST(rt);
    runTime.addCode('00');
    //back patch addresses.
    backPatch();
}//eo generateCode

function generateBlock(astNode){
    if(astNode.children.length>0){
        varScope++;
        for(var i = 0; i<astNode.children.length;i++){
            generateASTNode(astNode.children[i]);
        }//eo for
        varScope--;
    }//eo if
}//eo generateBlock

function generateASTNode(astNode){
    switch(astNode.name){
        case 'block':
            generateBlock(astNode);
            break;
        case 'vardecl':
            var leftType = astNode.children[0].name;
            varCt++;
            if(leftType=='Int'){
                //load accumulator with 00. i.e initialize int to 0.
                runTime.addCode('A9');
                runTime.addCode('00');
                //store temp address in accumulator
                runTime.addCode('8D');
                runTime.addCode('T'+varCt);
                runTime.addCode('XX');
                //add entry to static table
                addStaticEntry('T'+varCt,astNode.children[1].name,varScope,varCt);
            }else if(leftType=='String'){

            }else if(leftType=='Boolean'){

            }else{
                putMessage("Unknown var decl type: "+astNode.children[0],0);
                return;
            }//eo if else
            break;
        case 'assign':
            var checkScope = findSymbolScope(varScope);//get current scope in symbol table
            var leftType;
            var leftSymbolEntry;
            var rightSymbolEntry;
            var left = astNode.children[0];
            var right = astNode.children[1];
            if(checkScope!=undefined){
                //look up scope and var from SYMBOL TABLE
                leftSymbolEntry = lookUpNode(left,checkScope);
                //console.log(leftSymbolEntry);
                leftType = leftSymbolEntry.type;//look up from symbol table. POTENTIAL PROBLEM? id not in current scope

                //console.log(lookUpNode(left,checkScope));
                //Left is ID with type int, right is digit TODO right is 1+1+1+b??
                if(leftType=='Int'&&!isLetter(right.name)){
                    //HOW TO EVALUATE 1+2+3+b????
                    var val = parseInt(right);
                    var tempVal = staticTableLookUp(left.name,leftSymbolEntry.scope);
                    runTime.addCode('A9');
                    runTime.addCode('0'+right.name);
                    //var g = parseInt(right.name).toString(16)
                    //console.log(parseInt(g,16));
                    runTime.addCode('8D');
                    //staticTabletoString();
                    //console.log(tempVal);
                    runTime.addCode(tempVal.temp);
                    runTime.addCode('XX');
                }else if(leftType =='String'&&!isLetter(right.name)){

                }else if(leftType =='Boolean'&&!isLetter(right.name)){


                }else if(isLetter(right.name)){
                    //right hand is an id. we know types match from sem analysis
                    rightSymbolEntry = lookUpNode(right,checkScope);
                    var leftTemp  = staticTableLookUp(left.name,leftSymbolEntry.scope).temp
                    //find the temp value for id and scope
                    var rightTemp = staticTableLookUp(right.name,rightSymbolEntry.scope).temp;
                    runTime.addCode('AD');
                    runTime.addCode(rightTemp);
                    runTime.addCode('XX');
                    runTime.addCode('8D');
                    runTime.addCode(leftTemp);
                    runTime.addCode('XX');
                }else{
                    putMessage("type not recognized "+leftType,0);
                }//eo if else
            }else{
                putMessage("Scope: "+varScope+" not found",0);
            }//eo if else
            break;
        case 'print':
            var val = astNode.children[0];
            var checkScope = findSymbolScope(varScope);//get current scope from symbol table
            if(isLetter(val.name)){
                //printing ID
                var valSymbolEntry = lookUpNode(val,checkScope);//Get the symbol table entry for id
                var tempVal = staticTableLookUp(val.name,valSymbolEntry.scope);//get the static table entry's temp val
                runTime.addCode('AC');
                runTime.addCode(tempVal.temp);
                runTime.addCode('XX');
                runTime.addCode('A2');
                runTime.addCode('01');
                runTime.addCode('FF');
            }
            break;
        case 'if':
        jumpCt++;
            break;
        case 'while':
        jumpCt++;
            break;
        default:
            putMessage("Unknown node type: "+astNode.name,0);
            return;
    }//eo switch
}//eo generateASTNode

//look up a var at a scope, return the entry
function staticTableLookUp(varName,vScope){
    var ret;
    //ret = staticTable[varName+vScope];
    for(var y = 0;y<Object.keys(staticTable).length;y++){
        //console.log(staticTable['T'+y].variable+" vs "+varName+ " @ scope: "+staticTable['T'+y].scope+" vs "+vScope);
        if(staticTable['T'+y].variable == varName && staticTable['T'+y].scope==vScope){
            ret = staticTable['T'+y];
            //console.log(ret.temp);
        }//eo if
    }//eo for
    return ret;
}//eo staticTableLookUp

//after all stuff has been read in, replace all temp addresses with proper addresses
function backPatch(){
    putMessage("Backpatching code.....",1);
    //staticTabletoString();
    var currByte = "";
    var staticArea = runTime.programCounter;
    for (var index = 0; index < staticArea; index++) {
        currByte = runTime.env[index];

        // All temp variables start with T
        if (currByte[0]==='T'){
            //var substringIndex = parseInt(currByte.substring(1), 10);
            var tempTableEntry = staticTable[currByte];
            var newIndex = staticArea + parseInt(tempTableEntry.address);
            var hexLocation = decimalToHex(newIndex);

            if (newIndex < runTime.heapPointer) {
                //if newIndex does not have a collision with heap starting point
                putMessage("Resolved entry of " + currByte + " to: " + hexLocation);
                //tempTableEntry.address = hexLocation; THIS BREAKS WHY DO I HAVE THIS
                this.setCodeAtIndex(hexLocation, index);
                this.setCodeAtIndex("00", index + 1);
            }else{
                var errorMessage = "Error: static area conflicting with heap at " + decimalToHex(runTime.heapPointer) + ". " + tempTableEntry.temp + " was resolved to address " + hexLocation;
                putMessage(errorMessage,0);
                codeGenErrors++;
            }
        }else if (currByte[0]==='J'){
            var substringIndex = parseInt(currByte.substring(1), 10);
            var jumpTableEntry = jumpTable[substringIndex];

            var distanceToJump = decimalToHex(jumpTableEntry.dist);

            putMessage("Resolving jump entry of " + currByte + " to: " + distanceToJump,0);

            this.setCodeAtIndex(distanceToJump, index);
        }else{
            putMessage("SOMETHING WENT VERY VERY WRONG",0);
        }//eo if else
    }//eo for
}//eo backPatch

function setCodeAtIndex(code,index){
    if((index + 1) <= runTime.heapPointer){//
        runTime.env[index] = code;
    }else{
        var errorMessage = "Error: Stack overflow at: " + decimalToHex(runTime.programCounter + 1) + " when inserting code " + code +" to index "+index;
        putMessage(errorMessage);
    }//eo if else
}//eo setCodeAtIndex