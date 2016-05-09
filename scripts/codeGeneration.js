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
function addStaticEntry(temp,variable,scope,offset,address){
    var newStatic = {
        temp:temp,//temp is just T0. Not T0 XX
        variable:variable,
        scope:scope,
        offset:offset,
        address:address,
        setAddress:function(hex){
            this.address=hex;
        },
        toString:function(){
            putMessage('Temp: '+temp+' Var: '+variable + ' scope: '+scope +' offset: '+offset+' address: '+address,1);
        }
    };
    staticTable[temp]=newStatic;
    return newStatic;
};//eo addSymbolEntry
//print static table
function staticTabletoString(){
    putMessage('printing static table....',1);
    //console.log(Object.keys(staticTable).length)//0;
    for(var i = 0; i<Object.keys(staticTable).length;i++){
        staticTable['T'+i].toString();
    }
}//eo staticTabletoString
//Add a new entry to the jump table
function addJumpEntry(temp,dist){
    var newJump = {
        temp:temp,
        dist:dist,
        toString:function(){
            putMessage('Temp: '+temp+' dist: '+variable,1);
        },
        setDist:function(distance){
            this.dist=distance;
        }
    };
    jumpTable[temp]=newJump;
    //jumpTable.push(newJump);
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

    //temp,variable,scope,offset,address
    //ADD two temp addresses for bool expr
    varCt++;
    var tempLeft = addStaticEntry('T'+varCt,'left',undefined,varCt,undefined);//add two temp addresses for calculations
    varCt++;
    var tempRight = addStaticEntry('T'+varCt,'right',undefined,varCt,undefined);//add two temp addresses for calculations
    
    function traverseAST(astNode){
        if(astNode.name=='block'){
        	generateBlock(astNode);
    	}
    }//eo traverseAST
    // Make the initial call to expand from the root.
    traverseAST(rt);
    runTime.addCode('00');
    //syscall to start static area
    //back patch addresses.
    backPatch();
    //staticTabletoString();
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
            if(astNode.children[0]!=undefined){//leftType=='Int'
                //load accumulator with 00. i.e initialize int to 0.
                runTime.addCode('A9');
                runTime.addCode('00');
                //store temp address in accumulator
                runTime.addCode('8D');
                runTime.addCode('T'+varCt);
                runTime.addCode('XX');
                //add entry to static table
                addStaticEntry('T'+varCt,astNode.children[1].name,varScope,varCt,0);
            }else{

                console.log('aserhar');
            }
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
                //Left is ID with type int, right is digit TODO right is 1+1+1+b??
                if(leftType=='Int'&&!isLetter(right.name)){
                    //HOW TO EVALUATE 1+2+3+b????
                    var tempVal = staticTableLookUp(left.name,leftSymbolEntry.scope);
                    if(right.name!='+'){//JUST SINGLE DIGIT
                        var val = parseInt(right);
                        runTime.addCode('A9');
                        runTime.addCode('0'+right.name);
                        runTime.addCode('8D');
                        runTime.addCode(tempVal.temp);
                        runTime.addCode('XX');
                    }else if(right.name=='+'){//THERE IS AN INT EXPRESSION
                        var results = generateIntExpr(astNode);
                        var intExprTotal = results[0];
                        var id = results[1];
                        //ADD THE TOTAL TO CODE
                        runTime.addCode('A9');
                        runTime.addCode(decimalToHex(intExprTotal));
                        runTime.addCode('8D');
                        runTime.addCode(tempVal.temp);
                        runTime.addCode('XX');
                        // IF THERE IS AN ID, PERFORM ADD WITH CARRIES
                        if(id != undefined){// id at the end of int expr
                            //HELP MY CAPS LOCK IS STUCK.
                            rightSymbolEntry = lookUpNode(id,checkScope);
                            var leftTemp  = staticTableLookUp(left.name,leftSymbolEntry.scope).temp
                            //find the temp value for id and scope
                            var rightTemp = staticTableLookUp(id.name,rightSymbolEntry.scope).temp;
                            //load accumulator with left's stuff
                            runTime.addCode('AD');
                            runTime.addCode(leftTemp);
                            runTime.addCode('XX');
                            //SUM WITH RIGHT'S ADDRESS
                            runTime.addCode('6D');
                            runTime.addCode(rightTemp);
                            runTime.addCode('XX');
                            //store at left's address
                            runTime.addCode('8D');
                            runTime.addCode(leftTemp);
                            runTime.addCode('XX');
                        }//eo if else
                    }//eo if else
                }else if(leftType =='String'&&!isLetter(right.name)){
                    var strippedVal = right.name.substring(1,right.name.length-1);
                    writeStringToMemory(strippedVal);
                    //at end of string, get location, convert to hex. Add to accumulator.
                    var hexHeapPointer = decimalToHex(runTime.heapPointer);
                    var tempVal = staticTableLookUp(left.name,leftSymbolEntry.scope);
                    runTime.addCode('A9');
                    runTime.addCode(hexHeapPointer);
                    runTime.addCode('8D');
                    runTime.addCode(tempVal.temp);
                    runTime.addCode('XX');
                }else if(leftType =='Boolean'&&!isLetter(right.name)){
                    var val = parseInt(right);
                    var boolVal;
                    if(right.name=='True'){
                        boolVal=1
                    }else if(right.name=='False'){
                        boolVal=0
                    }else{
                        console.log('you broke me :(');
                    }
                    var tempVal = staticTableLookUp(left.name,leftSymbolEntry.scope);
                    runTime.addCode('A9');
                    runTime.addCode('0'+boolVal);
                    runTime.addCode('8D');
                    runTime.addCode(tempVal.temp);
                    runTime.addCode('XX');

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
                    putMessage('type not recognized '+leftType,0);
                }//eo if else
            }else{
                putMessage('Scope: '+varScope+' not found',0);
            }//eo if else
            break;
        case 'print':
            generatePrint(astNode);
            break;
        case 'if':
            jumpCt++;
            addJumpEntry('J'+jumpCt,undefined);
            var jumpEntry = jumpTableLookUp('J'+jumpCt);
            var currentLocation = runTime.programCounter;

            generateBooleanExpr(astNode.children[0]);
            runTime.addCode('D0');
            runTime.addCode(jumpEntry.temp);
            generateBlock(astNode.children[1]);

            var endLocation = runTime.programCounter;
            var dist = endLocation-currentLocation;
            jumpEntry.setDist(dist);
            break;
        case 'while':
            jumpCt++;
            var startLocation = runTime.programCounter;
            //console.log(startLocation);
            addJumpEntry('J'+jumpCt,dist);
            var jumpEntry = jumpTableLookUp('J'+jumpCt);
            generateBooleanExpr(astNode.children[0]);
            runTime.addCode('D0');
            runTime.addCode(jumpEntry.temp);
            generateBlock(astNode.children[1]);
            var dist =  (runTime.programCounter-1)-startLocation ;
            //console.log(dist);
            jumpEntry.setDist(dist);
            //Add the return
            runTime.addCode("A2");
            runTime.addCode("01");
            runTime.addCode("EC");
            runTime.addCode("FF");
            runTime.addCode("00");
            runTime.addCode("D0");
            var end = (256 + startLocation) - runTime.programCounter - 1;
            var endHex = end.toString(16).toUpperCase();
            runTime.addCode(endHex);

            break;
        default:
            putMessage('Unknown node type: '+astNode.name,0);
            return;
    }//eo switch
}//eo generateASTNode

//if astNode.name == '!=' or == we know bool expr
//store left in t0, and right in t1, t2 is our current z flag
//load t0 into x register
//ec t1
//if z flag set A9 01 8D t2 if true       A9 01 8D t2 if false

//Here lies Richard's mind. He lost it here, but can't find it because he needs it to find it
//generate code for a boolean expr
function generateBooleanExpr(astNode){
    var left = astNode.children[0];
    var right = astNode.children[1];
    var leftAddress = getAddress(left,'T0');
    var rightAddress = getAddress(right,'T1');
    //var resultAddress;
    //code that compares left and right addresses.
    runTime.addCode('AE');
    runTime.addCode('T0');
    runTime.addCode('XX');
    runTime.addCode('EC');
    runTime.addCode('T1');
    runTime.addCode('XX');
    //runTime.addCode(rightAddress);
    runTime.addCode('A9');
    runTime.addCode('00');
    runTime.addCode('D0');
    runTime.addCode('02');
    runTime.addCode('A9');
    runTime.addCode('01');
    if(astNode.name== '!='){
        runTime.addCode('A2');
        runTime.addCode('00');
        runTime.addCode('8D');
        runTime.addCode('T0');
        runTime.addCode('XX');
        runTime.addCode('EC');
        runTime.addCode('T0');
        runTime.addCode('XX');
    }
    //store results in left address

    //return left address
    //return resultAddress;
}//eo generateBooleanExpr

function getAddress(astNode,targetTemp){
    if(astNode.name == "True"){
        runTime.addCode("A9");
        runTime.addCode("01");
        runTime.addCode("8D");
        runTime.addCode(targetTemp);
        runTime.addCode("XX");
    }else if(astNode.name == "False"){
        runTime.addCode("A9");
        runTime.addCode("00");
        runTime.addCode("8D");
        runTime.addCode(targetTemp);
        runTime.addCode("XX");
    }else if(isInt(astNode.name)){
        runTime.addCode("A9");
        runTime.addCode("0" + astNode.name);
        runTime.addCode("8D");
        runTime.addCode(targetTemp);
        runTime.addCode("XX");
    }else if(isLetter(astNode.name)){
        var checkScope = findSymbolScope(varScope);
        var leftSymbolEntry = lookUpNode(astNode,checkScope); 
        var tempVal = staticTableLookUp(astNode.name,leftSymbolEntry.scope).temp;
        runTime.addCode("AE");
        runTime.addCode(tempVal);
        runTime.addCode("XX");
        runTime.addCode("8D");
        runTime.addCode(targetTemp);
        runTime.addCode("XX");
    }else{
        putMessage('Error: that is not supported by the 90\'s',0);
        codeGenErrors++;
    }//eo if else
    return targetTemp;
}//eo getAddress

//look up a var at a scope, return the entry
function staticTableLookUp(varName,vScope){
    var ret;
    //ret = staticTable[varName+vScope];
    for(var y = 0;y<Object.keys(staticTable).length;y++){
        //console.log(staticTable['T'+y].variable+' vs '+varName+ ' @ scope: '+staticTable['T'+y].scope+' vs '+vScope);
        if(staticTable['T'+y].variable == varName && staticTable['T'+y].scope==vScope){
            ret = staticTable['T'+y];
            //console.log(ret.temp);
        }//eo if
    }//eo for
    return ret;
}//eo staticTableLookUp

//look up a jump name
function jumpTableLookUp(jumpName){
    var ret;
    //ret = staticTable[varName+vScope];
    for(var j = 0;j<Object.keys(jumpTable).length;j++){
        //console.log(jumpTable['J'+j].temp);
        if(jumpTable['J'+j].temp == jumpName){
            ret = jumpTable['J'+j];
        }//eo if
    }//eo for
    return ret;
}//eo jumpTableLookUp

//after all stuff has been read in, replace all temp addresses with proper addresses
function backPatch(){
    putMessage('Backpatching code.....',1);
    //staticTabletoString();
    var currByte = '';
    var staticArea = runTime.programCounter;
    for (var index = 0; index < staticArea; index++) {
        currByte = runTime.env[index];

        // All temp variables start with T
        if (currByte[0]=='T'){
            //var substringIndex = parseInt(currByte.substring(1), 10);
            var staticTableEntry = staticTable[currByte];
            var newIndex = staticArea + parseInt(staticTableEntry.offset);
            var hexAddress = decimalToHex(newIndex);

            if (newIndex < runTime.heapPointer) {
                //if newIndex does not have a collision with heap starting point
                putMessage('changed ' + currByte + ' to: ' + hexAddress,1);
                staticTableEntry.setAddress(hexAddress);//This does not work for some reason.
                this.addCodeAtIndex(hexAddress, index);
                this.addCodeAtIndex('00', index + 1);
            }else{
                var errorMessage = 'Error: static area conflicting with heap at ' + decimalToHex(runTime.heapPointer);
                putMessage(errorMessage,0);
                codeGenErrors++;
            }//eo if else
        }else if(currByte[0]=='J'){
            var jumpTableEntry = jumpTable[currByte];
            var distanceToJump = decimalToHex(jumpTableEntry.dist);

            putMessage('changed ' + currByte + ' to: ' + distanceToJump,1);

            this.addCodeAtIndex(distanceToJump, index);
        }else{
            //putMessage('SOMETHING WENT VERY VERY WRONG',0);
        }//eo if else
    }//eo for
}//eo backPatch
function generatePrint(astNode){
    var childNode = astNode.children[0];
    //console.log(childNode.name);
    // Integer addition
    if (isInt(childNode.name)){//print digit DONE
        putMessage('Print: digit',1);
        runTime.addCode('A0');
        runTime.addCode('0' + childNode.name);
        runTime.addCode('A2');
        runTime.addCode('01');
        runTime.addCode('FF');
    }else if(childNode.name =='+'){
        //Might need to make a temp left hand address.
    }else if(childNode.name.indexOf('\"')!=-1) {//String DONE
        var strippedString = childNode.name.substring(1,childNode.name.length-1);

        writeStringToMemory(strippedString);
        runTime.addCode('A0');
        runTime.addCode(decimalToHex(runTime.heapPointer));
        runTime.addCode('A2');
        runTime.addCode('02');
        runTime.addCode('FF');
    }else if(childNode.name=='!='||childNode.name=='==') {
        putMesssage('Print: comparison');
        var address = runTime.generateBooleanExpr(childNode);
        var firstByte = address.split(' ')[0];
        var secondByte = address.split(' ')[1];

        runTime.addCode('A2');
        runTime.addCode('01');
        runTime.addCode('AC');
        runTime.addCode(firstByte);
        runTime.addCode(secondByte);
        runTime.addCode('FF');
    }else if(isLetter(childNode.name)) {//print id DONE
        putMessage('Print: id');
        var val = astNode.children[0];
        var checkScope = findSymbolScope(varScope);//get current scope from symbol table
        var valSymbolEntry = lookUpNode(val,checkScope);//Get the symbol table entry for id
        var tempVal = staticTableLookUp(val.name,valSymbolEntry.scope);//get the static table entry's temp val
        runTime.addCode('AC');
        runTime.addCode(tempVal.temp);
        runTime.addCode('XX');
        var type = valSymbolEntry.type;
        runTime.addCode('A2');
        if(type =='Int' || type == 'Boolean'){
            runTime.addCode('01');
        }else{
            runTime.addCode('02');
        }//eo if else
        runTime.addCode('FF');
    }else if(childNode.name=='True'){//DONE
        putMessage('Print: boolean true',1);
        runTime.addCode('A0');
        runTime.addCode('01');
        runTime.addCode('A2');
        runTime.addCode('01');
        runTime.addCode('FF');
    }else if(childNode.name=='False'){//DONE
        putMessage('Print: boolean false',1);
        runTime.addCode('A0');
        runTime.addCode('00');
        runTime.addCode('A2');
        runTime.addCode('01');
        runTime.addCode('FF');
    }//eo if else
};//eo generatePrint

function addCodeAtIndex(code,index){
    if((index + 1) <= runTime.heapPointer){//
        runTime.env[index] = code;
    }else{
        var errorMessage = 'Error: Stack overflow at: ' + decimalToHex(runTime.programCounter + 1) + ' when inserting code ' + code +' to index '+index;
        putMessage(errorMessage);
    }//eo if else
}//eo addCodeAtIndex

//write a given string to memory
function writeStringToMemory(asciiString){
    runTime.writeToHeap('00');//always write 00 after a string to divide them.
    //loop over string backwards. Add at heapPointer. Deciment heapPointer.
    for(var ct = asciiString.length; ct>0; ct--){
        var currChar = asciiString.charCodeAt(ct-1);
        var hex = currChar.toString(16);
        runTime.writeToHeap(hex.toUpperCase());
    }//eo for
}//eo writeStringToMemory

function generateIntExpr(astNode){
    var left  = astNode.children[0];
    var right = astNode.children[1];
    var total = 0;
    var id;
    function traverseIntTree(plusNode){
        var plusLeft = plusNode.children[0];
        var plusRight = plusNode.children[1];
        //console.log(plusLeft.name + " and  "+plusRight.name );
        if(isInt(plusLeft.name)){
            total+=parseInt(plusLeft.name);
        }
        if(isInt(plusRight.name)){
            total+=parseInt(plusRight.name);
        }else if(isLetter(plusRight.name)){
            id=plusRight;
        }
        if(plusRight.name=='+'){
            traverseIntTree(plusRight);
        }
    }//eo getTotal
    traverseIntTree(astNode);
    return [total,id];
}//eo generateIntExpr

