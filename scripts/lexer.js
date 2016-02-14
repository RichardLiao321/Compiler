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
	map[' ']=44;
	
	function get(k){
		return map[k];
	};
/*HUGE MATRIX INCOMING. FINDING NE(M)O.
@==accepting state
*/
	var delta =[
		//		| 0 | 1	| 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10| 11| 12| 13| 14| 15| 16| 17| 18| 19| 20| 21| 22| 23| 24| 25| 26| 27| 28| 29| 30| 31| 32| 33| 34| 35| 36| 37| 38| 39| 40| 41| 42| 43| 44   |
		//      | a | b | c | d | e | f | g | h | i | j | k | l | m | n | o | p | q | r | s | t | u | v | w | x | y | z | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | = | ! | ( | ) | { | } | $ | " | space
		/*q0*/	[15 ,21 ,15 ,15 ,15 ,30 ,15 ,15 ,11 ,15 ,15 ,15 ,15 ,15 ,15 ,1  ,15 ,15 ,16 ,27 ,15 ,15 ,6	,15 ,15 ,15 ,43 ,43 ,43 ,43 ,43 ,43 ,43 ,43 ,43 ,43 ,37 ,35 ,47 ,48 ,45 ,46 ,49 ,42 ,0      ],
/*Print   q1*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,2  ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,15     ],
		/*q2*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,3  ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50     ],
		/*q3*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,4  ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],
		/*q4*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,5  ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],
/*@Print  q5*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,5 		],
/*While   q6*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,7  ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,15 	],
		/*q7*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,8  ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],
		/*q8*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,9  ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],
		/*q9*/	[50 ,50 ,50 ,50 ,10 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],
/*@While q10*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,10 	],
/*if     q11*/	[50 ,50 ,50 ,50 ,50 ,12 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,13 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,15		],
/*@if    q12*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,12 	],
/*Int    q13*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,14 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],
/*@type  q14*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,52 	],
/*@id    q15*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,15 	],
/*String q16*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,17 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,15 	],
		/*q17*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,18 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],
		/*q18*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,19 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],
		/*q19*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,20 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],
		/*q20*/	[50 ,50 ,50 ,50 ,50 ,50 ,14 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],
/*Boolean q21*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,22 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,15 	],
		/*q22*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,23 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],
		/*q23*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,24 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],
		/*q24*/	[50 ,50 ,50 ,50 ,25 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],
		/*q25*/	[26 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],
		/*q26*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,14 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],
/*True    q27*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,28 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,15 	],
		/*q28*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,29 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],
/*        q29*/	[50 ,50 ,50 ,50 ,34 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,31 	],
/*False   q30*/	[31 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,15 	],
		/*q31*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,32 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],
		/*q32*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,33 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],
		/*q33*/	[50 ,50 ,50 ,50 ,34 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],
/*@False  q34*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,34 	],
/* !=     q35*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,36 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],
/*@!=     q36*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,36 	],
/*==/=    q37*/	[39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,39 ,38 ,39 ,39 ,39 ,39 ,39 ,39 ,50 ,39 	],
/*@==     q38*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,38 	],
/*@=      q39*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,39 	],
/*ChrList q40*/	[41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 ,41 	],
		/*q41*/	[40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,40 ,42 ,40 	],
/*@ChrListq42*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,42 	],
/*@digit  q43*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,43 	],
/* @+     q44*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,44 	],
/* @{     q45*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,45 	],
/* @}     q46*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,46 	],
/* @(     q47*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,47 	],
/* @)     q48*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,48 	],
/* @$     q49*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,49 	],
/* ERROR  q50*/	[50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 ,50 	],	
	];
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
	}
	//makes code clearer. resets state back to 0. 
	function resetState(){
		state=0;
	}
    function lex(){
        //Grab the "raw" source code.
        var sourceCode = document.getElementById("taSourceCode").value;
        //Trim the leading and trailing spaces.
        sourceCode = trim(sourceCode);
        //remove line breaks too.
		sourceCode = sourceCode.replace(/(\r\n|\n|\r)/gm,"");
		//remove all spaces in the middle;
		//sourceCode = sourceCode.replace(/\s/g,'');
		process(sourceCode);
        return sourceCode;
    }
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
				console.log("moving to state: "+state);
				checkState();
			}catch(err) {
				//on err, go to state 50, error state
				state=50;
			}
		}
	}
	//Checks the current state for an accept state.
	//If so, creates the appropriate token and resets the state
	function checkState(){
		console.log("checking state: "+state);
		switch(state) {
			case 5:
				resetState();
				console.log('Token Created: Print');
				//create Print Token
				break;
			case 10:
				resetState();
				console.log('Token Created: While');
				//create While Token
				break;
			case 12:
				resetState();
				console.log('Token Created: If');
				//create if Token
				break;
 			case 15:
				resetState();
				console.log('Token Created: Identifier');
				//create id Token
				break; 
			case 14:
				resetState();
				console.log('Token Created: Type');
				//create BoolVal Token
				break;
			case 36:
				resetState();
				console.log('Token Created: Inequality');
				//create inequality Token
				break;
			case 38:
				resetState();
				console.log('Token Created: Equality');
				//create equality Token
				break;
			case 39:
				resetState();
				console.log('Token Created: Assignment');
				//create assignment Token
				break;
			case 42:
				resetState();
				console.log('Token Created: String');
				//create String Token
				break;
			case 43:
				resetState();
				console.log('Token Created: Digit');
				//create digit Token
				break;
			case 44:
				resetState();
				console.log('Token Created: Integer Operator');
				//create Integer Operator Token
				break;
			case 45:
				resetState();
				console.log('Token Created: Left Bracket');
				//create Left Bracket Token
				break;
			case 46:
				resetState();
				console.log('Token Created: Right Bracket');
				//create Right Bracket Token
				break;
			case 47:
				resetState();
				console.log('Token Created: Left Parenthesis');
				//create Left Parenthesis Token
				break;
			case 48:
				resetState();
				console.log('Token Created: Right Parenthesis');
				//create right Parenthesis Token
				break;
			case 49:
				resetState();
				console.log('Token Created: EOF');
				//create EOF Token
				break;
			case 50:
				resetState();
				console.log('Token Created: Error');
				//create Error Token
				break;
			default:
		}
	}