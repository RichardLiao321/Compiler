	/*Tree Class*/
	function tree(){
		this.root=null;
		this.current={};//current node pointer to node
		this.addNode = function(name,kind,line){
			var newNode = {
							name:name,
							line:line,
							children:[],
							parent:{}
			};
			if((this.root == null) || (!this.root)){//see if we are at root
				this.root=newNode;
			}else{//we are at a child
				// Make our parent the CURrent node...
				newNode.parent = this.current;
				this.current.children.push(newNode);
			}//eo if else
			if (kind == "branch"){
				// ... update the CURrent node pointer to ourselves.
				this.current = newNode;
			}//eo if
		}//eo addNode
		//SYMBOL TABLE
		this.addSymbolNode = function(name,kind,line){
			var newNode = {
							name:name,
							line:line,
							symbolMap:{},
							children:[],
							parent:{}
			};
			if((this.root == null) || (!this.root)){//see if we are at root
				this.root=newNode;
			}else{//we are at a child
				// Make our parent the CURrent node...
				newNode.parent = this.current;
				this.current.children.push(newNode);
			}//eo if else
			if (kind == "branch"){
				// ... update the CURrent node pointer to ourselves.
				this.current = newNode;
			}//eo if
		};//eo addSymbolNode
		this.addSymbolEntry = function(id,value,type,line,scope){
			var newEntry = {
							//id:id,
							value:value,
							type:type,
							used:false,
							line:line,
							scope:scope
			};
			this.current.symbolMap[id]= newEntry;
		};//eo addSymbolEntry
		////////////////////////////////////////////////
		this.endChildren = function(){
			// ... by moving "up" to our parent node (if possible).
			if ((this.current.parent !== null) && (this.current.parent.name !== undefined)){
				this.current = this.current.parent;
			}else{
				// TODO: Some sort of error logging.
				// This really should not happen, but it will, of course.
			}//eo else if
		}//eo endChildren
		// Return a string representation of the tree.
	    this.toString = function() {
	        // Initialize the result string.
	        var traversalResult = "";
	        	//Treant js stuff
			simple_chart_config = {
			    chart: {
			        container: "#tree-simple"
			    },
			    
			    nodeStructure: {}
			};
			var my_chart = new Treant(simple_chart_config);

	        // Recursive function to handle the expansion of the nodes.
	        function expand(node, depth){
	            // Space out based on the current depth so
	            // this looks at least a little tree-like.
	            for (var i = 0; i < depth; i++){
	                traversalResult += "-";
	            }

	            // If there are no children (i.e., leaf nodes)...
	            if (!node.children || node.children.length === 0){
	                // ... note the leaf node.
	                traversalResult += "[" + node.name + "]";
	                traversalResult += "\n";
	            }else{
	                // There are children, so note these interior/branch nodes and ...
	                traversalResult += "<" + node.name + "> \n";
	                // .. recursively expand them.
	                for (var i = 0; i < node.children.length; i++){
	                    expand(node.children[i], depth + 1);
	                }
	            }//eo if else
	        }//eo expand
	        // Make the initial call to expand from the root.
	        expand(this.root, 0);
	        //console.log("HEY ROOT HERE"+this.root.printNode());
	        // Return the result.
	        return traversalResult;
	    };//eo toString
	}//eo tree class
	

