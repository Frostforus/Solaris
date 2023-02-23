//TODO probably dont need this anymore
function isHungarianLetter(char) {
	var hungarianLetters = "aábcdeéfghiíjklmnoóöőprstuúüűvz";
	return hungarianLetters.indexOf(char) !== -1;
}

//Works with github
function geturl() {
	let x = window.location.href
	if (x === "http://127.0.0.1:5500/") {
		x = "";
	}
	x += "letters/";
	return x;
}

const url = geturl()


//TODO: put this in preload, we dont need to reload the images each frame?
function loadLetter(letter = "a", tickness = 5) {
	let path = url + letter + "_" + tickness + ".png"
	var img = loadImage(path);
	return img;
}

function drawWord(letterArray, size = 300) {
	let letterSize = size / letterArray.length;
	let increment = (size - letterSize) / (letterArray.length - 1);

	letterArray.forEach(letter => {
		letter.image.resize(letterSize, letterSize)
		image(letter.image, width / 2, height / 2);

		letterSize += increment;
	});

}



let letter_images = [];
let lastdrawnSize = 0;

//TODO: this should be an array then we can store the separate letters too
let word = "Hellovilag"
let fr = 60;
let picture_delay = 5

let update_incr = picture_delay;

function getTextFromLetterImageArray(fromArray) {
	let word = "";

	fromArray.forEach(element => word += element.letter)

	return word
}


function popLetterFromArray(toArray) {
	toArray.pop();
}


//TODO: make this a class, have multiple words possible too
function addLetterToArray(newLetter, toArray, size = 5) {
	//TODO: resanitize thise
	//if (isHungarianLetter(newLetter)) {

			var letterAndImage = {};

			letterAndImage.letter = newLetter;
			letterAndImage.image = loadLetter(newLetter, size);
			toArray.push(letterAndImage);
			


	//}
}


function buttonClickedLoginnerText() {
	let letter = this.elt.innerText

	addLetterToArray(letter, letter_images, 5);
	//Force refresh
	lastdrawnSize = -1
	update_incr = picture_delay *2;
}



function createButtonBox(strings, maxWidth, x = width / 2, y = height / 2, buttonWidth= 50) {
	let buttonHeight = 30;
	let buttonPadding = 0;
	let boxPadding = 0;

	// Calculate the maximum number of buttons that can fit in a row
	let maxButtonsPerRow = floor((maxWidth - 2 * boxPadding) / buttonWidth);
	let numRows = ceil(strings.length / maxButtonsPerRow);

	// Calculate the width and height of the box
	let boxWidth = min(strings.length, maxButtonsPerRow) * buttonWidth + 2 * boxPadding;
	let boxHeight = numRows * (buttonHeight + buttonPadding) + 2 * boxPadding;

	// Draw the box
	push();

	// Draw the buttons
	textSize(12);
	textAlign(CENTER, CENTER);
	for (let i = 0; i < strings.length; i++) {
		let row = floor(i / maxButtonsPerRow);
		let col = i % maxButtonsPerRow;
		let buttonX = x - boxWidth / 2 + boxPadding + col * buttonWidth;
		let buttonY = y - boxHeight / 2 + boxPadding + row * (buttonHeight + buttonPadding) + buttonHeight / 2;
		let button = createButton(strings[i]);
		button.position(buttonX, buttonY);
		button.size(buttonWidth, buttonHeight);
		button.mousePressed(buttonClickedLoginnerText);
	}
	pop();
}

//TODO: store size of image somewhere too! because like this we dont know the size
function refreshImages(letterArray){
	let newLetterArray = [];

	letterArray.forEach(element =>{
		addLetterToArray(element.letter,newLetterArray)
	})
	return [...newLetterArray];
}


function setup() {
	createCanvas(750, 750);
	imageMode(CENTER);
	background(220);

	textSize(32);
	textAlign(CENTER, CENTER);
	frameRate(fr);

	let osszetettBetuk = ["cs", "dzs", "gy", "ly", "ny", "sz", "ty", "zs"];
	let maxWidth = 500;
	createButtonBox(osszetettBetuk, maxWidth, x = width / 2, y = 100);

	let szofajok = ["Főnév","határozó","ige","melléknév"];
	createButtonBox(szofajok, maxWidth*2, x = width / 2, y = 150,75, );
}

//TODO: use push and pop functionality better, wait for all pictures to load before drawing, because like this sometimes draws fail if we dont wait enough
function draw() {

	//TODO: rewrite this to be better, based on length
	if (lastdrawnSize !== letter_images.length) {
		//Wait for load
		if (update_incr > 0) {
			update_incr--;
		} else {
			background(220);
			drawWord(letter_images, 500);
			update_incr = picture_delay;
			lastdrawnSize = letter_images.length;
		}

	}



	text(getTextFromLetterImageArray(letter_images), width / 2, height / 10);
	text("Írj valamit:)"+lastdrawnSize, width / 2 - 250, height / 15 + 10);
	text("Ha homályos nyomj egy entert:o", width / 2 , height / 25 + 10);
}

//Since we have pngs i the backspace will mess it up

function keyPressed() {
	
	if (key === "Backspace") {
		popLetterFromArray(letter_images);
		//TODO: make this periodic or have a better handling
	} else 	if (key === "Enter") {
		letter_images = refreshImages(letter_images);
		//Force refresh
		lastdrawnSize = -1
		update_incr = picture_delay *2;
	} else if (key.match(/^[aábcdeéfghiíjklmnoóöőpqrstuúüűvwxyz]$/)) {
		// If it is a letter, print it to the console
		console.log(key);
		addLetterToArray(key, letter_images);
	} else  {
		// If it is not a letter, do nothing
		return;
	}
}