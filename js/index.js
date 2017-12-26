/* 
 * There are probably better ways of doing a lot of this,
 * but I'm just starting to wade into the deep end of
 * of vanilla JavaScript, so ¯\_(ツ)_/¯
 *
 * Inspired by day 1 of Wes Bos's 30 Day JavaScript Challenge
 * https://javascript30.com/
 */
	
var x = 'x';
let theTextBox = document.getElementById('enteredText'); 
let allTheKeys = document.getElementById('keyboard'); 
let changeKeys = document.getElementsByClassName('shifter'); 
let capsLockKey = document.getElementById('20');
let shiftKey = document.getElementById('16');
var pred1=document.getElementById("pred1");
var pred2=document.getElementById("pred2");
var pred3=document.getElementById("pred3");

//Store all the original values of the non-alphabetical keys
var originalShifterArray = []; 
for (i = 0; i<changeKeys.length; i++){
	originalShifterArray.push(changeKeys[i].innerHTML);
}

//Set up an array for the replacement values of the non-alphabetical keys that get subbed in when Shift is pressed
var shifterArray = ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '{', '}', '|', ':', '"', '<', '>', '?'];




//Function that clears the text box
function clearText(){
	theTextBox.innerHTML = '<br>';
}




//Function that detects keypresses and does the appropriate things
function highlightAndType(e){
	var keyPressed = e.keyCode;
	var charPressed = e.key;
	const keys = document.getElementById(keyPressed);
	
	keys.classList.add('pressed');
	
	
	if(!charPressed){
		theTextBox.innerHTML = "Sorry, this pen doesn't work in your browser. :( <br> Try Chrome, Firefox or Opera.";
		return;
	}
	
	//If the user presses CapsLock or Shift, make the alphabetical keys uppercase
	if (charPressed == 'CapsLock' || charPressed == 'Shift') {
		allTheKeys.classList.add('uppercase');
	} 
	//If the user presses Shift, also replace all non-alphabetical keys with their shifted values
	if (charPressed == 'Shift') {
		for(i = 0; i<changeKeys.length; i++){
			changeKeys[i].innerHTML = shifterArray[i];
		}
	}
	
	
	//Make sure the key that was typed was a character
	if (e.key.length <= 1){
		console.log(theTextBox.innerHTML);
		if(theTextBox.innerHTML.endsWith('<br>')){
			var newText = theTextBox.innerHTML.slice(0, -4);
			theTextBox.innerHTML = newText;
		}
		theTextBox.innerHTML += e.key;
	//If a backspace was typed, delete the last character in the text box. If shift was also held, delete all text.
	} else if (e.key == 'Backspace'){
		if(shiftKey.classList.contains('pressed')){
			clearText();
		} else {
			var newText = theTextBox.innerHTML.slice(0, -1);
			theTextBox.innerHTML = newText;
		}
	//If the Enter key was typed, remove all text from the text box
	} else if (e.key == 'Enter'){
		theTextBox.innerHTML += '<br><br>';
	}
	//if Tab is pressed, don't tab out of the window. Add extra space to the text box instead
	if(keyPressed == 9){
		e.preventDefault();
		theTextBox.innerHTML += '&emsp;&emsp;';
	}
	if(keyPressed == 32){
		doWork(theTextBox.innerHTML.slice(0, -1), 'pred');
	}
	else doWork(theTextBox.innerHTML,'med');
}


function doWork(str, work) {

	


	// ajax the JSON to the server
	$.ajax({
		url:"http://127.0.0.1:5000/output", 
		type:'GET',
		data:{'string':str,
			  'work': work},
		//dataType:'json',
		
		//contentType: 'application/json;charset=UTF-8',
		success:function(response){
			console.log(response);
			var obj=JSON.parse(response);
			pred1.innerHTML=obj[0][0];
			pred2.innerHTML=obj[1][0];
			pred3.innerHTML=obj[2][0];

			//alert("Success");
		},
		error:function(error){
			console.log(error);
		}

	});
	
}



//Function that detects when the user lets off a key and does the appropriate things
function removeKeypress(e){
	var keyDepressed = e.keyCode;	
	console.log(keyDepressed);
	const keys = document.getElementById(keyDepressed);
	console.log(keys);
	
	keys.classList.remove('pressed');
	//If CapsLock or Shift was just let off, and if the other isn't still on, return keys to lowercase
	if(keyDepressed == 20 && !shiftKey.classList.contains('pressed') || keyDepressed == 16 && !capsLockKey.classList.contains('pressed')) {
		allTheKeys.classList.remove('uppercase');
	}
	//If Shift was just let off, replace all non-alphabetical keys with their original values rather than their shifted values
	if(keyDepressed == 16 ) {
		for(i = 0; i<changeKeys.length; i++){
			changeKeys[i].innerHTML = originalShifterArray[i];
		}
	}
}

//Whenever the user presses a key down, run the proper function
window.addEventListener('keydown', highlightAndType );

//Whenever the user lets a key up, run the proper function
window.addEventListener('keyup', removeKeypress );

//Whenever the window is clicked, run the function to clear out the text box
window.addEventListener('click', clearText );