//TODO probably dont need this anymore
function isHungarianLetter(char) {
	var hungarianLetters = "aábcdeéfghiíjklmnoóöőprstuúüűvz";
	return hungarianLetters.indexOf(char) !== -1;
}

//Works with github
function geturl(imageType="png") {
	let x = window.location.href
	if (x === "http://127.0.0.1:5500/") {
		x = "";
	}
	x += imageType+"/";
	return x;
}

//TODO: this needs to be better
const url = geturl()


//TODO: put this in preload, we dont need to reload the images each frame?
function loadLetter(symboltype ,symbol = "a", thickness = 5) {
	let path = url +symboltype+"/"+ symbol + "_" + thickness + ".png"
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

//TODO: rename this to symbol
class Letter {
	constructor(letter = "a", thickness = 5, type = "png",symboltype="letter") {
		this.letter = letter;
		this.thickness = thickness;
		this.type = type;
		//TODO: type handling
		this.image = loadLetter(symboltype,letter, thickness);

	}

	draw(sizeX = this.image.width, sizeY = this.image.height, x = 250, y = 250) {
		console.log(this.letter, sizeX, sizeY, x, y)
		this.image.resize(sizeX, sizeY)
		image(this.image, x, y);

	}


}

class Word {
	constructor() {
		this.letters = []
		this.szofaj;

		//TODO: add location and rotation and size
	}

	addSzofaj(szofaj, thickness, type) {
		this.szofaj = new Letter(szofaj, thickness, type,"szofaj")
	}

	addLetter(letter, thickness, type) {
		this.letters.push(new Letter(letter, thickness, type,"letter"))
	}
	popLastLetter(){
		console.log("Popped: ",this.letters.pop())
	}
	getlength() {

		let length = 0;
		if (this.letters.length) {
			if (this.szofaj) {
				length = this.letters.length + 1	;
			} else {
				length = this.letters.length;
			}
		}
		return length;
	}

	drawSzofaj(sizeX, sizeY, x, y) {
		if(!this.szofaj){
			return
		}
		print(sizeX,sizeY,x,y)
		this.szofaj.image.resize(sizeX, sizeY)
		image(this.szofaj.image, x, y);
	}

	draw(sizeX, sizeY, x, y) {
		//TODO: Handle 0 1 2 length words put this in a function 
		let length = this.getlength() <= 0 ? 1 : this.getlength();

		let letterSize = sizeX / length;
		let increment = (sizeX - letterSize) / length;

		this.drawSzofaj(letterSize, letterSize, x, y)
		letterSize += increment;

		this.letters.forEach(letter => {
			letter.draw(letterSize, letterSize, x, y)


			letterSize += increment;
		});
		text(this.getText(), x , y+sizeX/2 +5);
		console.log(this.getText(),x,y,y-sizeX/2 -5);
		text("Írj valamit:)", width / 2 - 250, height / 15 + 10);
	}

	getText(){
		let text = ""

		if(this.szofaj){
			text +="(" + this.szofaj.letter + ") "
		}

		this.letters.forEach(letter => {
			text += letter.letter
		});
		return text
	}
}


let letter_images = [];
let lastdrawnSize = 0;

//TODO: this should be an array then we can store the separate letters too
let word = "Hellovilag"
let fr = 24;
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

let wordInFocus;

function letterOnClick() {
	let letter = this.elt.innerText

	wordInFocus.addLetter(letter,5);

	//Force refresh
	lastdrawnSize = -1
	update_incr = picture_delay * 2;
}

function szofajOnClick() {
	let letter = this.elt.innerText

	wordInFocus.addSzofaj(letter, 5);
	//Force refresh
	lastdrawnSize = -1
	update_incr = picture_delay * 2;
}



function createButtonBox(strings, maxWidth, x = width / 2, y = height / 2, buttonWidth = 50, onclickfunction = letterOnClick) {
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
		button.mousePressed(onclickfunction);
	}
	pop();
}

//TODO: store size of image somewhere too! because like this we dont know the size
function refreshImages(letterArray) {
	let newLetterArray = [];

	letterArray.forEach(element => {
		addLetterToArray(element.letter, newLetterArray)
	})
	return [...newLetterArray];
}

let bigword



function setup() {
	createCanvas(1500, 750);
	imageMode(CENTER);
	background(220);

	textSize(32);
	textAlign(CENTER, CENTER);
	frameRate(fr);
	bigword = new Word();


	wordInFocus = bigword


	let osszetettBetuk = ["cs","dz", "dzs", "gy", "ly", "ny", "sz", "ty", "zs"];
	let maxWidth = 500;
	createButtonBox(osszetettBetuk, maxWidth, x = width / 2, y = 100);

	let szofajok = ["főnév","határozó","ige","melléknév"];
	createButtonBox(szofajok, maxWidth*2, x = width / 2, y = 150,75, szofajOnClick);

}

//TODO: use push and pop functionality better, wait for all pictures to load before drawing, because like this sometimes draws fail if we dont wait enough
function draw() {

	background(220);
	bigword.draw(500, 500, width / 2, height / 2);
	

}

//Since we have pngs i the backspace will mess it up

function keyPressed() {

	if (key === "Backspace") {
		wordInFocus.popLastLetter();
		//TODO: make this periodic or have a better handling
	} else if (key === "Enter") {
		letter_images = refreshImages(letter_images);
		//Force refresh
		lastdrawnSize = -1
		update_incr = picture_delay * 2;
	} else if (key.match(/^[aábcdeéfghiíjklmnoóöőpqrstuúüűvwxyz]$/)) {
		// If it is a letter, print it to the console
		console.log(key);
		wordInFocus.addLetter(key,5);
	} else {
		// If it is not a letter, do nothing
		return;
	}
}