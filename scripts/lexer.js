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
	map[')']=41;
	map['{']=42;
	map['}']=41;
	map['$']=42;
	map['"']=43;
	map['+']=44;
	map[' ']=45;
	map['\n']=46;
	
	function get(k){
		return map[k];
	};
/*HUGE MATRIX INCOMING. FINDING NE(M)O.
@==accepting state
@TODO: 
DONE   deny continous word ex:yay!
DONE   assignment vs equality
DONE   deny multiple digits
       token line #
       what happens after token is found/found?
	   Check for even num of quotes 
	   HANDLE WHATEVER IS IN BETWEEN QUOTES OHGODHOW
	   Error handling.
DONE   newLineChar
*/
	var delta =[
		//		| 0 | 1	| 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10| 11| 12| 13| 14| 15| 16| 17| 18| 19| 20| 21| 22| 23| 24| 25| 26| 27| 28| 29| 30| 31| 32| 33| 34| 35| 36| 37| 38| 41| 42| 41| 42| 43| 44| 45| 46|
		//      | a | b | c | d | e | f | g | h | i | j | k | l | m | n | o | p | q | r | s | t | u | v | w | x | y | z | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | = | ! | ( | ) | { | } | $ | " | + | sp| \n|
		/*q0*/	[15 ,22 ,15 ,15 ,15 ,33 ,15 ,15 ,11 ,15 ,15 ,15 ,15 ,15 ,15 ,1  ,15 ,15 ,16 ,29 ,15 ,15 ,6	,15 ,15 ,15 ,44 ,44 ,44 ,44 ,44 ,44 ,44 ,44 ,44 ,44 ,40 ,38 ,48 ,49 ,46 ,47 ,50 ,42 ,45 , 0 , 0	],
/*Print   q1*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,2  ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 15, 15],
		/*q2*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,3  ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
		/*q3*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,4  ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
		/*q4*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,5  ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
/*@Print  q5*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 15, 51],
/*While   q6*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,7  ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 15, 15],
		/*q7*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,8  ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
		/*q8*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,9  ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
		/*q9*/	[51 ,51 ,51 ,51 ,10 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
/*@While q10*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 10, 10],
/*if     q11*/	[51 ,51 ,51 ,51 ,51 ,12 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,13 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 15, 15],
/*@if    q12*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 12, 12],
/*Int    q13*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,14 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
/*@int   q14*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 14, 14],
/*@id    q15*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 15, 15],
/*String q16*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,17 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 15, 15],
		/*q17*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,18 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
		/*q18*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,19 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
		/*q19*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,20 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
		/*q20*/	[51 ,51 ,51 ,51 ,51 ,51 ,14 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
/*@String q21*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 21, 21],
/*Boolean q22*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,23 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 15, 15],
		/*q23*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,24 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
		/*q24*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,25 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
		/*q25*/	[51 ,51 ,51 ,51 ,26 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
		/*q26*/	[27 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
		/*q27*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,28 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
/*@Bool   q28*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 28, 28],		
/*True    q29*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,30 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 15, 15],
		/*q30*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,31 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
/*        q31*/	[51 ,51 ,51 ,51 ,32 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
/*@true   q32*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 32, 32],
/*False   q33*/	[34 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 15, 15],
		/*q34*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,35 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
		/*q35*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,36 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
		/*q36*/	[51 ,51 ,51 ,51 ,37 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
/*@false  q37*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 37, 37],
/* !=     q38*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,39 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],
/*@!=     q39*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 39, 39],
/*==  @=  q40*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,41 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 40, 40],
/*@==     q41*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 41, 41],
/*ChrList q42*/	[42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,43 ,42 , 42, 42],
//		/*q43*/	[42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,42 ,43 ,51 , 42, 51],
/*@ChrListq43*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 43, 43],
/*@digit  q44*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 44, 44],
/* @+     q45*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 45, 45],
/* @{     q46*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 46, 46],
/* @}     q47*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 47, 47],
/* @(     q48*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 48, 48],
/* @)     q48*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 49, 49],
/* @$     q50*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 50, 50],
/* ERROR  q51*/	[51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 ,51 , 51, 51],	
	];//eo matrix. Ne(m)o not found :(
	var state;//global DFA position variable
	/*Token Class
		var x = new token('Int',1);
	*/
	function token(type,val){
		this.type=type;
		this.val=val;
		this.printMe = function(){
			return "Type: "+this.type+'Val: '+this.val;
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
		console.log('Lexing String: '+sourceCode);
		//remove all spaces in the middle;
		//sourceCode = sourceCode.replace(/\s/g,'');
		process(sourceCode);
        return sourceCode;
    }//eo lex
	function process(str){
		//DFA State starts at 0
		state=0;
		var c;
		//loop through input string
		for(i=0;i<str.length;i++){
			//c is the character at i, mapped to the map
			c=get(str.charAt(i));
			console.log("got char "+str.charAt(i)+": "+c);
			try {
				//find next state in matrix.
				state=delta[state][c];
				//console.log("moving to state: "+state);
				//pass string and current position to checkState to check next char in input
				checkState(str,i);
			}catch(err) {
				//on err, go to state 51, error state
				state=51;
			}//eo try catch
		}//eo for
	}//eo process
	//Checks the current state for an accept state.
	//If so, creates the appropriate token and resets the state
	function checkState(string,pos){
		var input=string;
		var i=pos;
		console.log("checking state: "+state);
		switch(state) {
			case 1://receive just "p"
				if(lookAhead(input,i,1)=='' || lookAhead(input,i,1)==' '|| lookAhead(input,i,1)=='\n'|| (isLetter(lookAhead(input,i,1))==true&&lookAhead(input,i,1)!='r')){
					resetState();
					console.log('Token found: Identifier');
					//create identifier token
				}
				break;
			case 5:
				resetState();
				console.log('Token found: Print');
				//create Print Token
				break;
			case 6://receive just "w"
				if(lookAhead(input,i,1)=='' || lookAhead(input,i,1)==' '|| lookAhead(input,i,1)=='\n'|| (isLetter(lookAhead(input,i,1))==true&&lookAhead(input,i,1)!='h')){//lookAhead(input,i,1)=='' || lookAhead(input,i,1)==' '|| lookAhead(input,i,1)=='\n'
					resetState();
					console.log('Token found: Identifier');
					//create identifier token
				}
				break;
			case 10:
				resetState();
				console.log('Token found: While');
				//create While Token
				break;
			case 11://receive just "i"
				if(lookAhead(input,i,1)=='' || lookAhead(input,i,1)==' '|| lookAhead(input,i,1)=='\n'|| (isLetter(lookAhead(input,i,1))==true&&(lookAhead(input,i,1)!='n')||lookAhead(input,i,1)!='f')){
					resetState();
					console.log('Token found: Identifier');
					//create identifier token
				}
				break;
			case 12:
				resetState();
				console.log('Token found: If');
				//create if Token
				break;
			case 14:
				resetState();
				console.log('Token found: Type');
				//create type Token
				break;
 			case 15:
			//readd this if statement if continuous string are to be disallowed
				if(1==2) {//&& lookAhead(input,i,1)!= 'b'&& lookAhead(input,i,1)!= 'p'&& lookAhead(input,i,1)!= 'w'&& lookAhead(input,i,1)!= 's'&& lookAhead(input,i,1)!= 'i'&& lookAhead(input,i,1)!= 't'&& lookAhead(input,i,1)!= 'f')
					console.log('LOOK MA CHARACTERS');
					state=51;
					return;
				}else{
					resetState();
					console.log('Token found: Identifier');
				}
				//create identifier Token
				break;
			case 16://receive just "s"
				if(lookAhead(input,i,1)=='' || lookAhead(input,i,1)==' '|| lookAhead(input,i,1)=='\n'|| (isLetter(lookAhead(input,i,1))==true&&lookAhead(input,i,1)!='t')){
					resetState();
					console.log('Token found: Identifier');
					//create identifier token
				}
				break;
			case 21:
				//FIXME
				resetState();
				console.log(input.substr(i));
				console.log('Token found: Type');
				//create string type Token
				break;
			case 22://check for just "b"
				if(lookAhead(input,i,1)=='' || lookAhead(input,i,1)==' '|| lookAhead(input,i,1)=='\n'|| (isLetter(lookAhead(input,i,1))==true&&lookAhead(input,i,1)!='o')){
					resetState();
					console.log('Token found: Identifier');
					//create identifier token
				}
				break;
			case 28:
				//FIXME
				resetState();
				console.log('Token found: Type');
				//create boolean type Token
				break;
			case 29://receive just "t"
				if(lookAhead(input,i,1)=='' || lookAhead(input,i,1)==' '|| lookAhead(input,i,1)=='\n'|| (isLetter(lookAhead(input,i,1))==true&&lookAhead(input,i,1)!='r')){
					resetState();
					console.log('Token found: Identifier');
					//create identifier token
				}
				break;
			case 32:
				resetState();
				console.log('Token found: Boolean Value');
				//create True BoolVal Token
				break;
			case 33://receive just "f"
				if(lookAhead(input,i,1)=='' || lookAhead(input,i,1)==' '|| lookAhead(input,i,1)=='\n'|| (isLetter(lookAhead(input,i,1))==true&&lookAhead(input,i,1)!='a')){
					resetState();
					console.log('Token found: Identifier');
					//create identifier token
				}
				break;
			case 37:
				resetState();
				console.log('Token found: Boolean Value');
				//create False BoolVal Token
				break;
			case 39:
				resetState();
				console.log('Token found: Inequality');
				//create inequality Token
				break;
			case 40:
				//Need to check for this case because == has same initial input as =
				if(lookAhead(input,i,1)=='='){
					return;
				}else{
					resetState();
					console.log('Token found: Assignment');
					//create Assignment Token
				}
				break;
			case 41:
				resetState();
				console.log('Token found: Equality');
				//create equality Token
				break;
			case 42:
				//resetState();
				console.log('Token found: "');
				//create " Token
				break;
			case 43:
			//FIXME
				resetState();
				console.log('Token found: String');
				//create String Token
				//create " Token
				break;
			case 44:
			//check for more than 1 digit. If so, self destruct computer
				if(!isNaN(parseInt(lookAhead(input,i,1)))){
					console.log("ANOTHER DIGIT! BURN THE WITCH!");
					return;
				}else{
					resetState();
					console.log('Token found: Digit');
					//create digit Token
				}
				break;
			case 45:
				resetState();
				console.log('Token found: Integer Operator');
				//create Integer Operator Token
				break;
			case 46:
				resetState();
				console.log('Token found: Left Bracket');
				//create Left Bracket Token
				break;
			case 47:
				resetState();
				console.log('Token found: Right Bracket');
				//create Right Bracket Token
				break;
			case 48:
				resetState();
				console.log('Token found: Left Parenthesis');
				//create Left Parenthesis Token
				break;
			case 49:
				resetState();
				console.log('Token found: Right Parenthesis');
				//create right Parenthesis Token
				break;
			case 50:
				resetState();
				console.log('Token found: EOF');
				//create EOF Token
				break;
			case 51:
				console.log('Token found: Error');
				//create Error Token
				break;
			default:
				if(lookAhead(input,i,1)==""){
					console.log('ERROR ERROR ERROR');
					state =51;
					return;
				}
				break;
		}//eo switch
	}//eo checkState
	//simple function that returns a substring. Intended for looking ahead for context.
	function lookAhead(str, start, num){
		var input = str;
		var x=start+1;
		var y=num;
		var out=input.substr(x,y);
		//console.log("lookAhead: "+out)
		return out;
	}//eo lookAhead
	//simple function to check if a string(char) is only letters
	function isLetter(str) {
		//console.log("letter???: "+str)
		return /^[a-z]+$/.test(str);
	}//eo lookAhead