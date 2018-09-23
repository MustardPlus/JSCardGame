/*
mustard
3/6/17
*/
// Constants
const NONE = -1;

// [ - - General Methods - - ]
/**
	* Get Element by use of ID.
	* @param name ID of Element.
*/
function getByID(name){
	return document.getElementById(name);
}

/**
	* Get Random Integer.
	* @param max Maximum Integer.
*/
function random_int(max){
	return Math.floor(Math.random()*max);
}

/**
	* Check if a Value is defined.
	* @param value Value to Check.
*/
function valid(value){
	return (value != NONE);
}

/**
	* Remove Random Value from Array. Warning, Will not check for remaining values.
	* @param array Array to remove value from.
*/
function array_random_removal(array){
	var length = array.length;
	var pos = random_int(length);
	var val = array[pos];
	while(val == NONE){
		pos = random_int(length);
		val = array[pos];
	}
	array[pos] = NONE;
	return val;
}

/**
	* Convert entire array into a String.
	* @param array Array to convert into String.
*/
function array_write(array){
	var str = "[";
	for(var i = 0; i < array.length; i++){
		var ext = ", ";
		if(i == array.length-1)ext = "]";
		str+=String(array[i])+ext;
	}
	return str;
}
/**
	* Convert entire 2D array into a String.
	* @param array Array to convert into String.
*/
function array_write2D(array){
	var str = "[";
	for(var i = 0; i < array.length; i++){
		var ext = ", ";
		if(i == array.length-1)ext = "]";
		str+=array_write(array[i])+ext;
	}
	return str;
}

// [ - - Alarms - - ]
// Initialize Alarms
var alarm = [[NONE, valid, NONE],
[NONE, valid, NONE],
[NONE, valid, NONE],
[NONE, valid, NONE],
[NONE, valid, NONE],
[NONE, valid, NONE],
[NONE, valid, NONE],
[NONE, valid, NONE]];
// Alarm Methods
/**
	* Update all Alarms.
*/
function alarm_update(){
	for(var i = 0; i < alarm.length; i++){
		var time = alarm[i][0];
		var ticking = (time > 0);
		alarm[i][0] = time - 1;
		if(ticking){
			//alert("Alarm ticking:"+String(i));
			continue;
		}
		if(time != 0)continue;
		// Alarm Alert
		var func = alarm[i][1], param = alarm[i][2];
		//alert("Alarm Function: "+String(i)+"\nParameter: "+param);
		if(param == NONE){
			//alert("Alarm Function. No Parameter\n"+func);
			func();
		}else{
			//alert("Alarm "+String(i)+" Function. With Parameter. "+String(func));
			func(param);
		}
		// Reset Alarm
		alarm_set(i, NONE, valid, NONE);
	}
}

/**
	* Add a new Alarm.
	* @param time Time (frames) to delay alarm.
	* @param func Function to execute upon alarm end.
	* @param param [OPT] Parameter to use with Function.
*/
function alarm_add(time, func, param){
	// Check Alarms for an Empty Slot
	var open = NONE;
	for(var i = 0; i < alarm.length; i++){
		var ff = alarm[i][1];
		if(ff == valid){
			open = i;
			break;
		}
	}
	//alert("Added Alarm: "+String(open)+" / "+String(time)+" / "+String(func)+" / "+String(param));
	alarm_set(open, time, func, param);
}

/**
	* Set Alarm.
	* @param aID Alarm Position.
	* @param time Time (frames) to delay alarm.
	* @param func Function to execute upon alarm end.
	* @param param [OPT] Parameter to use with Function.
*/
function alarm_set(aID, time, func, param){
	alarm[aID][0] = time;
	alarm[aID][1] = func;
	alarm[aID][2] = param;
}

/*
Details:
Card Matching Game
4x4 Grid
*/

/*
GAME STATES:
0 - INITIALIZATION
1 - WAIT FOR PLAYER START
[Within Game Loop]
2 - CHECK CARD STATUS [LOSE / WIN -> 5]
3 - SETUP CARDS
4 - WAIT FOR PLAYER INPUT
5 - END [-> 1]
*/
var STATE = 0;
var GAME = {
    start : function() {
        this.interval = setInterval(update, 60);
        },
    //alarm: [[NONE, valid, NONE], [NONE, valid, NONE]],
    cards : [[NONE, NONE, NONE, NONE],
    [NONE, NONE, NONE, NONE],
    [NONE, NONE, NONE, NONE],
    [NONE, NONE, NONE, NONE],
    [NONE, NONE, NONE, NONE],
    [NONE, NONE, NONE, NONE],
    [NONE, NONE, NONE, NONE],
    [NONE, NONE, NONE, NONE]],
    // Deck of 16 Cards, 2 of Each
    deck : [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
    card_lst : NONE,
    match : function() {
    	//alert("Card Match!");
    },
    miss : function() {
    	//alert("Oh No! Those cards don't match!");
    }
}

// [ - - Game Methods - - ]
/**
	* Begin Game.
*/
function play(){
	GAME.start();
}

/**
	* Update Game.
*/
function update(){
	alarm_update();
	switch(STATE){
		case 0: // INITIALIZATION
			cards_wipe();
			
			STATE = 1;
			break;
		case 1: // WAIT FOR PLAYER START
			var next = true;// Push Start
			// Game Setup
			if(next){
				cards_refresh();
				STATE = 2;
			}
			break;
		case 2: // Player Turn

			break;
		case 3: // Check Card Status
			// All Cards Used
			if(deck_remaining == 0){
				alert("End Game");
				STATE = 5;
			}
			break;
		case 4: // not used yet

			break;
		case 5: // Win
			alert("You Win!");
			break;
	}
}

// [ - - Cards - - ]
// Main Card Function
/**
	* Card Functionality.
	* @param cID CardID.
*/
function card(cID){
	if(STATE != 2)return;
	var cc = $('#card'+String(cID));
	if(cc.hasClass('card_flipped'))return;
	// Check Card Status

	// Flip Card
	//$("#card0").attr("src", "assets/pizza.png");
	alarm_add(7, card_check, cID);
	card_flip_first(cID);
}

function card_check(cID){
	// Check Deck Status
	if(GAME.card_lst != NONE){
		// Compare to Held Card
		var c2ID = GAME.card_lst;
		var c1 = card_get(cp_x(cID), cp_y(cID));
		var c2 = card_get(cp_x(c2ID), cp_y(c2ID));
		if(c1 == c2){ // Match
			GAME.match();
			$('#card'+cID).toggleClass('card_final');
			$('#card'+c2ID).toggleClass('card_final');
		}else{ // Not a Match
			GAME.miss();
			// Re-Flip both Cards
			STATE = 3;
			//alert("Flip both back, "+cID+" "+c2ID);
			card_flip_delay(cID, 12);
			card_flip_delay(c2ID, 12);
			//alert("flip both cards back");
		}
		// Set Held Card to NONE
		//alert("Reseting Held Card!");
		GAME.card_lst = NONE;
		
	}else{
		// Hold this card
		GAME.card_lst = cID;
		//alert("Now Holding: "+String(cID));
	}
}

/**
	* Flip Card.
	* @param cID CardID of card to flip.
*/
function card_flip(cID){
	var cc = $('#card'+String(cID));
	cc.toggleClass("card");
	cc.toggleClass("card_flipped");
	var cvID = card_get(cp_x(cID), cp_y(cID));
	//alert("cvID="+cvID);
	var ext = String(cvID);
	if(cc.hasClass('card'))ext = "";
	cc.attr("src", "assets/card"+ext+".png");
}

/**
	* Card Flip EX. Used by Alarms.
	* @param cID CardID of card to flip.
*/
function card_flip_ex(cID){
	//alert("Card Flip EX: "+cID);
	card_flip_first(cID);
	STATE = 2;
}

function card_flip_first(cID){
	//alert("card flip first: "+cID);
	card_flip_anim(cID);
	alarm_add(7, card_flip_anim_ex, cID);
}

function card_flip_anim(cID){
	var cc = $('#card'+String(cID));
	cc.toggleClass("card_flipping");
}

function card_flip_anim_ex(cID){
	card_flip(cID);
	card_flip_anim(cID);
}

/**
	* Flip a card after a delay in time.
	* @param cID CardID of card to flip.
	* @param time Time (frames) to delay cardflip.
*/
function card_flip_delay(cID, time){
	alarm_add(time, card_flip_ex, cID);
}

/**
	* Refresh all Cards, rearranging values of the cards.
*/
function cards_refresh(){
	// Each Card selects a random value from the Deck
	// Duplicate Deck
	var deck = GAME.deck.slice(0);
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++)card_set(i, j, array_random_removal(deck));
	}
	//alert("Card Selection:\n"+array_write2D(GAME.cards));
}

/**
	* Wipe all Cards, removing attached classes and resetting game variables.
*/
function cards_wipe(){
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++)card_set(i, j, NONE);
	}
	// Reset Image Sources + Classes
	for(var k = 0; k < 16; k++){
			var cc = $('#card'+String(k));
			cc.attr('src', 'assets/card.png');
			if(cc.hasClass('card_flipped')){
				cc.toggleClass('card');
				cc.toggleClass('card_flipped');
			}
			if(cc.hasClass('card_final'))cc.toggleClass('card_final');
		}
}

/**
	* Get Card at position given.
	* @param cx CardX.
	* @param cy CardY.
*/
function card_get(cx, cy){
	//alert("Card Get : "+cx+" "+cy);
	return GAME.cards[cx][cy];
}

/**
	* Set Card at position given.
	* @param cx CardX.
	* @param cy CardY.
	* @param cv CardValue to set to.
*/
function card_set(cx, cy, cv){
	return GAME.cards[cx][cy] = cv;
}

/**
	* Card Position Get X.
	* @param cID CharID to get cx of.
*/
function cp_x(cID){
	//alert("cp_x:"+cID+" = "+(cID%4));
	return (cID%4);
}

/**
	* Card Position Get Y.
	* @param cID CharID to get cy of.
*/
function cp_y(cID){
	return Math.floor(cID/4);
}

// [ - - Deck - - ]
/**
	* Get number of remaining cards in the deck.
*/
function deck_remaining(){
	var num = 0;
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			if(valid(card_get(i, j)))num++;
		}
	}
	return num;
}

// [ - - Player Control Buttons - - ]
/**
	* Player Reset Button.
*/
function btn_reset(){
	STATE = 0;
}

/*
TO-DO List: <X = finished>
X- Finsh Game States {
	- Hold Last Flipped Card
	- Compare recent flip to new flip
}
- Display Game Over Pop-Up
- Style Buttons
- New Card Art
- Card Flip Animation
*/
