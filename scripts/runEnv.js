function runEnv(){
	this.length =256;
	this.programCounter=0;
	this.heapPointer=256;
	this.env=[];
	//add "code" to "env"
	this.addCode = function(opCode){
		this.env[this.programCounter]=opCode;
		this.programCounter++;
	};//eo addCode
	this.writeToHeap = function(string){
		this.heapPointer--;
		this.env[this.heapPointer]=string;
		
	}
	//find a temp location
	this.getTemp = function(temp){

	}//eo getTemp
	//print runEnv
	this.toString = function(){
		var lineBytes ='';
		for(i=0;i<this.length;i++){
			//print in lines of 8
			if(i%8==0&&i!=0){
				putMessage(lineBytes,0);
				lineBytes =this.env[i]+" ";
			}else{
				lineBytes+=this.env[i]+" ";

			}//eo if else
			if(i+1==this.length){
				putMessage(lineBytes,0);
			}
		}//eo for
	}//eo toString
	this.initRunEnv = function(){
		for(var s = 0; s<this.length; s++){
			this.env[s]='00';
		}

	}//eo initRunEnv
}//eo runEnv