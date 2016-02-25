/* lexer.js  */
	//Lookup map for characters received
	var map= new Object();
	map['a']=0;
	map['b']=1;
	map['c']=2;
	map['d']=3;
	map['e']=4;
	map['f']=5;
	map['g']=6;
	map['h']=7;
	map['i']=8;
	map['j']=9;
	map['k']=10;
	map['l']=11;
	map['m']=12;
	map['n']=13;
	map['o']=14;
	map['p']=15;
	map['q']=16;
	map['r']=17;
	map['s']=18;
	map['t']=19;
	map['u']=20;
	map['v']=21;
	map['w']=22;
	map['x']=23;
	map['y']=24;
	map['z']=25;
	map['0']=26;
	map['1']=27;
	map['2']=28;
	map['3']=29;
	map['4']=30;
	map['5']=31;
	map['6']=32;
	map['7']=33;
	map['8']=34;
	map['9']=35;
	map['=']=36;
	map['!']=37;
	map['(']=38;
	map[')']=39;
	map['{']=40;
	map['}']=41;
	map['$']=42;
	map['"']=43;
	map['+']=44;
	map[' ']=45;
	map['\n']=46;
	
	function get(k){
		return map[k];
	};
	function printTokens(){
	putMessage("Lexer got: ");
		for(i=0;i<tokens.length;i++){
			putMessage(tokens[i].printMe());
		}
		
	}//eo printTokens
/*HUGE MATRIX INCOMING. FINDING NE(M)O.
@==accepting state
@TODO: 
DONE   assignment vs equality
DONE   deny multiple digits
DONE   token line #
DONE   what happens after token is found/found?
DONE   HANDLE WHATEVER IS IN BETWEEN QUOTES OHGODHOW
DONE   Error handling.
DONE   Replace console.logs() with real messages
DONE   newLineChar
*/
	var delta =[
		//		| 0 | 1	| 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10| 11| 12| 13| 14| 15| 16| 17| 18| 19| 20| 21| 22| 23| 24| 25| 26| 27| 28| 29| 30| 31| 32| 33| 34| 35| 36| 37| 38| 41| 42| 41| 42| 43| 44| 45| 46|
		//      | a | b | c | d | e | f | g | h | i | j | k | l | m | n | o | p | q | r | s | t | u | v | w | x | y | z | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | = | ! | ( | ) | { | } | $ | " | + | sp| \n|
		/*q0*/	[15 ,22 ,15 ,15 ,15 ,33 ,15 ,15 ,11 ,15 ,15 ,15 ,15 ,15 ,15 ,1  ,15 ,15 ,16 ,29 ,15 ,15 ,6	,15 ,15 ,15 ,44 ,44 ,44 ,44 ,44 ,44 ,44 ,44 ,44 ,44 ,40 ,38 ,48 ,49 ,46 ,47 ,50 ,42 ,45 , 0 , 0	],
/*Print   q1*/	[15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,2  ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 , 15, 15],
		/*q2*/	[52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,3  ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52],
		/*q3*/	[52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,4  ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52],
		/*q4*/	[52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,5  ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52],
/*@Print  q5*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 15, 51],
/*While   q6*/	[15 ,15 ,15 ,15 ,15 ,15 ,15 ,7  ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 , 15, 15],
		/*q7*/	[52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,8  ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52],
		/*q8*/	[52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,9  ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52],
		/*q9*/	[52 ,52 ,52 ,52 ,10 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52],
/*@While q10*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 10, 10],
/*if     q11*/	[15 ,15 ,15 ,15 ,15 ,12 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,13 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 , 15, 15],
/*@if    q12*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 12, 12],
/*Int    q13*/	[15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,14 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 , 15, 15],
/*@int   q14*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 14, 14],
/*@id    q15*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 15, 15],
/*String q16*/	[15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,17 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 , 15, 15],
		/*q17*/	[52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,18 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52],
		/*q18*/	[52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,19 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52],
		/*q19*/	[52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,20 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52],
		/*q20*/	[52 ,52 ,52 ,52 ,52 ,52 ,14 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52],
/*@String q21*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 21, 21],
/*Boolean q22*/	[15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,23 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 , 15, 15],
		/*q23*/	[52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,24 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52],
		/*q24*/	[52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,25 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52],
		/*q25*/	[52 ,52 ,52 ,52 ,26 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52],
		/*q26*/	[27 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52],
		/*q27*/	[52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,28 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52],
/*@Bool   q28*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 28, 28],		
/*True    q29*/	[15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,30 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 , 15, 15],
		/*q30*/	[52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,31 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52],
/*        q31*/	[52 ,52 ,52 ,52 ,32 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52],
/*@true   q32*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 32, 32],
/*False   q33*/	[34 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 ,15 , 15, 15],
		/*q34*/	[52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,35 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52],
		/*q35*/	[52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,36 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52],
		/*q36*/	[52 ,52 ,52 ,52 ,37 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52],
/*@false  q37*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 37, 37],
/* !=     q38*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,39 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
/*@!=     q39*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 39, 39],
/*==  @=  q40*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,41 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 40, 40],
/*@==     q41*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 41, 41],
/*ChrList q42*/	[42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,43 ,42 , 42, 42],
/*@ChrListq43*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 43, 43],
/*@digit  q44*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 44, 44],
/* @+     q45*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 45, 45],
/* @{     q46*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 46, 46],
/* @}     q47*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 47, 47],
/* @(     q48*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 48, 48],
/* @)     q48*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 49, 49],
/* @$     q50*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 50, 50],
/* ERROR  q51*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
				[52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 ,52 , 52, 52]	
	];//eo matrix. Ne(m)o not found :(
	var state;//global DFA position variable
	/*Token Class*/
	function token(type,val,line){
		this.type=type;
		this.val=val;
		this.line=line;
		this.printMe = function(){
			return this.type+'['+this.val+"] at line "+this.line;
		};
	}//eo token class
	//makes code clearer. resets state back to 0. 
	function resetState(){
		state=0;
	}//eo resetState
    function lex(){
        //Grab the "raw" source code.
        var sourceCode = document.getElementById("taSourceCode").value;
        //Trim the leading and trailing spaces.
        sourceCode = trim(sourceCode);
        //remove \n too.
		//sourceCode = sourceCode.replace(/(\r\n|\n|\r)/gm,"");
		putMessage("--------Lexing!-------");
		putMessage('Lexing String: '+sourceCode);
		/* if(!sourceCode.includes('$')){
			putMessage('Warning No EOF character($) found...');
			sourceCode=sourceCode+'$';
		} */
		//remove all spaces in the middle;
		//sourceCode = sourceCode.replace(/\s/g,'');
		process(sourceCode);
		printTokens();
        return tokens;
    }//eo lex
	function process(str){
		//DFA State starts at 0
		state=0;
		var c;
		var lineNum=1;
		//loop through input string
		for(i=0;i<str.length;i++){
			//c is the character at i, mapped to the map
			c=get(str.charAt(i));
			//Check for inputs not in the alphabet
			if(str.charAt(i)=="\n"){
				lineNum++;
			}
			if(!isNaN(c)){
				putMessage("got char "+str.charAt(i)+": "+c);
				try {
					//find next state in matrix.
					state=delta[state][c];
					//putMessage("moving to state: "+state);
					//pass string and current position to checkState to check next char in input
					checkState(str,i,lineNum);
				}catch(err) {
					//on err, go to state 51, error state
					state=51;
				}//eo try catch
			}else{
				putMessage("Invalid input: "+str.charAt(i));
				return;
			}//eo if
		}//eo for
	}//eo process
	//Checks the current state for an accept state.
	//If so, creates the appropriate token and resets the state
	var inString=false;
	var st="";
	var ct=0;
	function checkState(string,pos,lineNum){
		var input=string;
		var i=pos;
		var line=lineNum;
		putMessage("checking state: "+state);
		switch(state) {
			case 0:
			return;
				break;
 			case 1://receive just "p"
				if(lookAhead(input,i,1)=='' || lookAhead(input,i,1)==' '|| lookAhead(input,i,1)=='\n'|| lookAhead(input,i,1)=='$' || (isLetter(lookAhead(input,i,1))&&lookAhead(input,i,1)!='r')){
					resetState();
					//putMessage('Token found: Identifier('+input.charAt(i)+') at line '+line);
					//create identifier token
					//var x = new token('Identifier',input.charAt(i),line);
					tokens.push(new token('Identifier',input.charAt(i),line));
				}
				break; 
			case 5:
				resetState();
				putMessage('Token found: Print');
				//create Print Token
				tokens.push(new token('Keyword','Print',line));
				//tokens.push(x);
				break;
 			case 6://receive just "w"
				if(lookAhead(input,i,1)=='' || lookAhead(input,i,1)==' '|| lookAhead(input,i,1)=='\n'|| lookAhead(input,i,1)=='$' || (isLetter(lookAhead(input,i,1))==true&&lookAhead(input,i,1)!='h')){
					//lookAhead(input,i,1)=='' || lookAhead(input,i,1)==' '|| lookAhead(input,i,1)=='\n'
					resetState();
					//putMessage('Token found: Identifier('+input.charAt(i)+') at line '+line);
					//create identifier token
					//var x = new token('Identifier',input.charAt(i),line);
					tokens.push(new token('Identifier',input.charAt(i),line));
				}
				break; 
			case 10:
				resetState();
				//putMessage('Token found: While');
				//create While Token
				//var x = new token('While',null,line);
				tokens.push(new token('Keyword','While',line));
				break;
			case 11://receive just "i"
				if(lookAhead(input,i,1)=='n'||lookAhead(input,i,1)=='f'){
					//console.log('I found i'+lookAhead(input,i,1))
					return;
				}else if(isLetter(lookAhead(input,i,1))||lookAhead(input,i,1)=='' || lookAhead(input,i,1)==' '|| lookAhead(input,i,1)=='\n'|| lookAhead(input,i,1)=='$'){
					resetState();
					//putMessage('Token found: Identifier('+input.charAt(i)+') at line '+line);
					//create identifier token
					//var x = new token('Identifier',input.charAt(i),line);
					tokens.push(new token('Identifier',input.charAt(i),line));
				}
				break; 
			case 12:
				resetState();
				//putMessage('Token found: If at line '+line);
				//create if Token
				//var x = new token('If',null,line);
				tokens.push(new token('Keyword','If',line));
				break;
			case 14:
				resetState();
				//putMessage('Token found: Type(int) at line '+line);
				//create type Token
				//var x = new token('Type','int',line);
				tokens.push(new token('Type','Int',line));
				break;
 			case 15:
			//readd this if statement if continuous string are to be disallowed
				 if(1==2) {
					//isLetter(lookAhead(input,i,1))===true && lookAhead(input,i,1)!= 'b'&& lookAhead(input,i,1)!= 'p'&& lookAhead(input,i,1)!= 'w'&& lookAhead(input,i,1)!= 's'&& lookAhead(input,i,1)!= 'i'&& lookAhead(input,i,1)!= 't'&& lookAhead(input,i,1)!= 'f'
					putMessage('LOOK MA CHARACTERS');
					state=51;
					return;
				}else{
				resetState();
				//putMessage('Token found: Identifier('+input.charAt(i)+') at line '+line);
				//create identifier Token
				//var x = new token('Identifier',input.charAt(i),line);
				tokens.push(new token('Identifier',input.charAt(i),line));
				ct++;
				}
				break;
 			case 16://receive just "s"
				if(lookAhead(input,i,1)=='' || lookAhead(input,i,1)==' '|| lookAhead(input,i,1)=='\n'|| lookAhead(input,i,1)=='$' || (isLetter(lookAhead(input,i,1))==true&&lookAhead(input,i,1)!='t')){
					resetState();
					//putMessage('Token found: Identifier('+input.charAt(i)+') at line '+line);
					//create identifier token
					//var x = new token('Identifier',input.charAt(i),line);
					tokens.push(new token('Identifier',input.charAt(i),line));
				}
				break; 
			case 21:
				resetState();
				//putMessage('Token found: Type(string) at line '+line);
				//create string type Token
				break;
 			case 22://check for just "b"
				if(lookAhead(input,i,1)=='' || lookAhead(input,i,1)==' '|| lookAhead(input,i,1)=='\n'|| lookAhead(input,i,1)=='$' || (isLetter(lookAhead(input,i,1))==true&&lookAhead(input,i,1)!='o')){
					resetState();
					//putMessage('Token found: Identifier('+input.charAt(i)+') at line '+line);
					//create identifier token
					//var x = new token('Identifier',input.charAt(i),line);
					tokens.push(new token('Identifier',input.charAt(i),line));
				}
				break; 
			case 28:
				resetState();
				//putMessage('Token found: Type(boolean)');
				//create boolean type Token
				tokens.push(new token('Type','Boolean',line));
				break;
			case 29://receive just "t"
				if(lookAhead(input,i,1)=='' || lookAhead(input,i,1)==' '|| lookAhead(input,i,1)=='\n'|| lookAhead(input,i,1)=='$' || (isLetter(lookAhead(input,i,1))==true&&lookAhead(input,i,1)!='r')){
					resetState();
					//putMessage('Token found: Identifier('+input.charAt(i)+') at line '+line);
					//create identifier token
					//var x = new token('Identifier',input.charAt(i),line);
					tokens.push(new token('Identifier',input.charAt(i),line));
				}
				break;
			case 32:
				resetState();
				//putMessage('Token found: Boolean Value(true)');
				//create True BoolVal Token
				tokens.push(new token('Boolean Value','True',line));
				break;
 			case 33://receive just "f"
				if(lookAhead(input,i,1)=='' || lookAhead(input,i,1)==' '|| lookAhead(input,i,1)=='\n'|| lookAhead(input,i,1)=='$' || (isLetter(lookAhead(input,i,1))==true&&lookAhead(input,i,1)!='a')){
					resetState();
					//putMessage('Token found: Identifier('+input.charAt(i)+') at line '+line);
					//create identifier token
					tokens.push(new token('Identifier',input.charAt(i),line));
				}
				break; 
			case 37:
				resetState();
				//putMessage('Token found: Boolean Value('+input.charAt(i)+') at line '+line);
				//create False BoolVal Token
				tokens.push(new token('Type','False',line));
				break;
			case 39:
				resetState();
				//putMessage('Token found: Inequality(!=) at line '+line);
				tokens.push(new token('Inequality','!=',line));
				//create inequality Token
				break;
			case 40:
				//Need to check for this case because == has same initial input as =
				if(lookAhead(input,i,1)=='='){
					return;
				}else{
					resetState();
					//putMessage('Token found: Assignment(=) at line '+line);
					//create Assignment Token
					tokens.push(new token('Assignment','=',line));
				}
				break;
			case 41:
				resetState();
				//putMessage('Token found: Equality(==) at line '+line);
				//create equality Token
				tokens.push(new token('Equality','==',line));
				break;
			case 42:
			//putMessage("at state 42: "+inString);
				if(!inString){
					//resetState();
					//putMessage('Token found: Quote(") at line '+line);
					st="";
					inString=true;
					//create " Token
					tokens.push(new token('Quote','"',line));
				}else if(inString){
					//resetState();
					//inString=false;
					//putMessage('Token found:Char('+input.charAt(i)+') at line '+line);
					//st=st+input.charAt(i);
					putMessage("String:"+st);
					tokens.push(new token('String Char',input.charAt(i),line));
				}else{
					//console.log(st);
					return;
				}
				break;
			case 43:
			//FIXME
			//console.log(inString);
				inString=false;
				resetState();
				//putMessage('Token found: String at line '+line);
				//create String Token
				//create " Token
				/* tokens.push(new token('String',st,line));
				st=""; */
				tokens.push(new token('Quote','"',line));
				break;
			case 44:
			//check for more than 1 digit. If so, self destruct computer
				/*  if(!isNaN(parseInt(lookAhead(input,i,1)))){
					putMessage("ANOTHER DIGIT! BURN THE WITCH!");
					return;
				}else{
					resetState();
					putMessage('Token found: Digit');
					//create digit Token
					tokens.push(new token('Digit',input.charAt(i),line));
				}  */
				resetState();
				//putMessage('Token found: Digit('+i+') at line '+line);
				//create Digit token
				tokens.push(new token('Digit',input.charAt(i),line));
				break;
			case 45:
				resetState();
				//putMessage('Token found: Integer Operator(+) at line '+line);
				//create Integer Operator Token
				tokens.push(new token('Intop',input.charAt(i),line));
				break;
			case 46:
				resetState();
				//putMessage('Token found: Left Bracket("{") at line '+line);
				//create Left Bracket Token
				tokens.push(new token('LeftBracket',input.charAt(i),line));
				break;
			case 47:
				resetState();
				//putMessage('Token found: Right Bracket("}") at line '+line);
				//create Right Bracket Token
				tokens.push(new token('RightBracket',input.charAt(i),line));
				break;
			case 48:
				resetState();
				//putMessage('Token found: Left Parenthesis("(") at line '+line);
				//create Left Parenthesis Token
				tokens.push(new token('LeftParen',input.charAt(i),line));
				break;
			case 49:
				resetState();
				//putMessage('Token found: Right Parenthesis(")") at line '+line);
				//create right Parenthesis Token
				tokens.push(new token('RightParen',input.charAt(i),line));
				break;
			case 50:
				resetState();
				//putMessage('Token found: EOF($) at line '+line);
				//create EOF Token
				tokens.push(new token('EOF',input.charAt(i),line));
				break;
			case 51:
				//resetState();
				//putMessage('Error: Lexer at line '+line);
				//create Error Token
				break;
			default:
			if(lookAhead(input,i,1)=='' || lookAhead(input,i,1)==' '|| lookAhead(input,i,1)=='\n'|| lookAhead(input,i,1)=='$'&&
			(lookAhead(input,i,1)!='b'&&lookAhead(input,i,1)!='s'&&lookAhead(input,i,1)!='w'&&lookAhead(input,i,1)!='f'&&lookAhead(input,i,1)!='t'&&lookAhead(input,i,1)!='i'&&lookAhead(input,i,1)!='p')){
				for(i2=ct;i2<pos+1;i2++){
					tokens.push(new token('Identifier',input.charAt(i2),line));
				}
				resetState();
			}else{
				//ct++
			}
				/* if(lookAhead(input,i,1)=='$'){
					putMessage('Lex error at line '+line);
					//create error token
					state =51;
					return;
				} */
				break;
		}//eo switch
	}//eo checkState