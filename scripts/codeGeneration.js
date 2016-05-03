/*
TODO
How to evaluate int expr like 1+1+1+3?
how to do assignment? look up from static table?
*/
var codeGenErrors=0;
var codeGenWarnings=0;
var staticTable=[];
var jumpTable=[];
var tempCt;
var varScope = -1;
//Add an entry to the static table.
function addStaticEntry(temp,variable,scope,address){
    var newStatic = {
        temp:temp,
        variable:variable,
        scope:scope,
        address:address,
        toString:function(){
            putMessage("Temp: "+temp+" Var: "+variable + " scope: "+scope +" address: "+address,1);
        }
    };
    //staticTable[temp]=newStatic;
    staticTable.push(newStatic);
};//eo addSymbolEntry
//print static table
function staticTabletoString(){
    for(var i = 0; i<staticTable.length;i++){
        staticTable[i].toString();
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
    staticTable=[];
    jumpTable=[];
    varScope = -1;

    function traverseAST(astNode){
        if(astNode.name=='block'){
        	generateBlock(astNode);
    	}
    }//eo traverseAST
    // Make the initial call to expand from the root.
    traverseAST(rt);
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
            var type = astNode.children[0].name;
            varCt++;
            if(type=='Int'){
                //load accumulator with 00. i.e initialize int to 0.
                runTime.addCode('A9');
                runTime.addCode('00');
                //store temp address in accumulator
                runTime.addCode('8D');
                runTime.addCode('T'+varCt);
                runTime.addCode('XX');
                //add entry to static table
                addStaticEntry('T'+varCt+'XX',astNode.children[1].name,varScope,varCt);
            }else if(type=='String'){

            }else if(type=='Boolean'){

            }else{
                putMessage("Unknown var decl type: "+astNode.children[0],0);
                return;
            }//eo if else
            break;
        case 'assign':
            var checkScope = findSymbolScope(varScope);
            var type;
            if(checkScope!=undefined){
                //look up
                type = checkScope.symbolMap[astNode.children[0].name].type;
                if(type=='Int'){
                    //HOW TO EVALUATE 1+2+3+b????
                    var val = parseInt(astNode.children[1]);
                    var tempVal = staticTableLookUp(astNode.children[0].name,varScope);
                    runTime.addCode('A9');
                    runTime.addCode('0'+astNode.children[1].name);
                    runTime.addCode('8D');
                    runTime.addCode(tempVal.temp.substr(0,2));
                    runTime.addCode(tempVal.temp.substr(2,4));
                }else if(type =='String'){

                }else if(type =='Boolean'){

                }else{
                    putMessage("type not recognized "+type,0);
                }//eo if else
            }else{
                putMessage("Scope: "+varScope+" not found",0);
            }//eo if else
            break;
        case 'print':
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
    for(var y = 0;y<staticTable.length;y++){
        //console.log(staticTable[y].variable+" vs "+varName+ " @ scope: "+staticTable[y].scope+" vs "+vScope);

        if(staticTable[y].variable == varName && staticTable[y].scope==vScope){
            ret = staticTable[y];
            //console.log(ret.temp);
        }//eo if
    }//eo for
    return ret;
}//eo staticTableLookUp