function runEnv(){
	this.programCounter=0;
	this.env=[];
	//add "code" to "env"
	this.addCode = function(opCode){
		this.env[this.programCounter]=opCode;
		this.programCounter++;
	};//eo addCode
	//find a temp location
	this.getTemp = function(temp){

	}//eo getTemp
	//print runEnv
	this.toString = function(){
		var lineBytes ='';
		for(i=0;i<this.env.length;i++){
			//print in lines of 8
			if(i%8==0&&i!=0){
				putMessage(lineBytes,0);
				lineBytes =this.env[i]+" ";
			}else{
				lineBytes+=this.env[i]+" ";

			}//eo if else
			if(i+1==this.env.length){
				putMessage(lineBytes,0);
			}
		}//eo for
	}//eo toString

}//eo runEnv