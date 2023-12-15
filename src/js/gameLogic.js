// Sites
const startSite = document.querySelector('.starter-site')
const testSite = document.querySelector('.test-site')
const summarySite = document.querySelector('.summary-site')

// Elements
const testText = document.querySelector('.test-site__text p')
const inputField = document.querySelector('.test-site__input')
let allSpans

// Stats elements
const statsHeader = document.querySelector('.test-site__header')
const statsContainer = document.querySelector('.test-site__actual-stats')
const statsRemainingTime = document.querySelector('#remaining-time')
const statsWPM = document.querySelector('#wpm')
const statsCPM = document.querySelector('#cpm')
const statsAccuracy = document.querySelector('#accuracy')
const summarySiteWPM = document.querySelector('#summary-site-wpm')
const summarySiteAccuracy = document.querySelector('#summary-site-accuracy')

// Buttons
const btn1minute = document.querySelector('#btn-1')
const btnFullText = document.querySelector('#btn-full')
const tryAgainBtn = document.querySelector('#try-again-btn')
const homeBtn = document.querySelector('#home-page-btn')

// Help variables
let charactersPerMinute = 0
let wordsPerMinute = 0
let accuracy = 0
let goodLetter = 0
let wrongLetter = 0
let actualLetter = 0
let letterToType = actualLetter + 1
let gameTimeRemaining
let gameTimeGone = 0
let gameMode
let doNotRepeatTimer = 0

// Functions

// Generating text for test
const generateText = () => {
	// Generating 3 random numbers, then create text with 3 elements from randomSentences.js
	let randomNumber1 = Math.floor(15 * Math.random())
	let randomNumber2 = Math.floor(15 * Math.random() + 15)
	let randomNumber3 = Math.floor((randomSentences.length - 30) * Math.random() + 30)

	// const testTextContent = `${randomSentences[randomNumber1]} ${randomSentences[randomNumber2]} ${randomSentences[randomNumber3]}`
	const testTextContent = `jebac szczecin`

	// Split game text letters to spans (beacuse it is easier to check wrong/good letter later)
	testTextContent.split('').forEach(letter => {
		let letterTag = `<span style="padding: .6px;margin: .4px;">${letter}</span>`
		testText.innerHTML += letterTag
	})

	// Declare spans and give animation to first span
	allSpans = document.querySelectorAll('.test-site__text p > span')
	allSpans[0].classList.add('letter-to-type')
}

const startTimer = () => {
	if (gameMode == 1) {
		gameTimeRemaining = 60
		window.setInterval(function () {
			gameTimeRemaining > 0 ? gameTimeRemaining-- : endGame()
			statsRemainingTime.innerHTML = gameTimeRemaining + 's'
			updateStats()
		}, 1000)
	} else if (gameMode == 0) {
		statsRemainingTime.innerHTML = `&infin;`
		window.setInterval(function () {
			gameTimeGone++
			updateStats()
		}, 1000)
	}
}

// Showing statistics during the test
const showStats = () => {
	statsHeader.style.display = 'none'
	statsContainer.style.display = 'flex'
}

// Updating statistics during the test
const updateStats = () => {
	if (gameMode == 1) {
		wordsPerMinute = Math.round((goodLetter / 5 / (60 - gameTimeRemaining)) * 60)
		charactersPerMinute = Math.round((goodLetter / (60 - gameTimeRemaining)) * 60)
		if (wordsPerMinute == Infinity) {
			wordsPerMinute = `-`
			charactersPerMinute = `-`
		}
	} else if (gameMode == 0) {
		wordsPerMinute = Math.round((goodLetter / 5 / gameTimeGone) * 60)
		charactersPerMinute = Math.round((goodLetter / gameTimeGone) * 60)
		if (wordsPerMinute == Infinity) {
			wordsPerMinute = `-`
			charactersPerMinute = `-`
		}
	}
	actualLetter == 0 ? (accuracy = 0) : (accuracy = Math.round((goodLetter / (goodLetter + wrongLetter)) * 100))
	statsWPM.innerText = `${wordsPerMinute}`
	statsCPM.innerText = `${charactersPerMinute}`
	statsAccuracy.innerText = `${accuracy}%`
}

// Start game, generating text and focus input
const startGame = () => {
	startSite.style.display = 'none'
	testSite.style.display = 'flex'
	generateText()
	document.addEventListener('keydown', () => inputField.focus())
	testText.addEventListener('click', () => inputField.focus())
}

// Whole game logic
const gameLogic = e => {
	const allLetters = testText.innerText.split('')

	if (inputField.value.split('')[actualLetter] === allLetters[actualLetter]) {
		allSpans[actualLetter].className = ''
		allSpans[actualLetter].classList.add('correct-letter')
		if (!(allSpans[letterToType] == undefined)) {
			allSpans[letterToType].classList.add('letter-to-type')
		}
		actualLetter++
		letterToType++
		goodLetter++
	} else if (inputField.value.split('')[actualLetter]) {
		allSpans[actualLetter].className = ''
		allSpans[actualLetter].classList.add('incorrect-letter')
		if (!(allSpans[letterToType] == undefined)) {
			allSpans[letterToType].classList.add('letter-to-type')
		}
		actualLetter++
		letterToType++
		wrongLetter++
	} else if ((e.key = 'backspace')) {
		allSpans[actualLetter].className = ''
		actualLetter--
		letterToType--
		allSpans[actualLetter].classList.contains('correct-letter') ? goodLetter-- : wrongLetter--
		allSpans[letterToType - 1].classList.add('letter-to-type')
	}

	if (gameMode == 1 && inputField.value.split('').length == 1) {
		if (doNotRepeatTimer == 0) {
			doNotRepeatTimer = 1
			startTimer()
			showStats()
		}
	}

	if (gameMode == 0 && inputField.value.split('').length == 1) {
		if (doNotRepeatTimer == 0) {
			doNotRepeatTimer = 1
			startTimer()
			showStats()
		}
	}
	updateStats()

	console.log(inputField.value.split('').length)
	console.log(allLetters.length)
	if (inputField.value.split('').length == allLetters.length) {
		endGame()
	}
}

// Choosing game mode (0 is full time game, 1 is time game)
// Full time game currently does not work
const fullTimeGameMode = () => {
	startGame()
	gameMode = 0
}

const remainingTimeGameMode = () => {
	startGame()
	gameMode = 1
}

// Ending game and show final statistics
const endGame = () => {
	testSite.style.display = 'none'
	summarySite.style.display = 'flex'
	summarySiteWPM.innerText = wordsPerMinute
	summarySiteAccuracy.innerText = Math.round((goodLetter / (goodLetter + wrongLetter)) * 100)
}

// const resetGame = () => {}

// Listeners to buttons
btn1minute.addEventListener('click', remainingTimeGameMode)
btnFullText.addEventListener('click', fullTimeGameMode)
inputField.addEventListener('input', gameLogic)
homeBtn.addEventListener('click', function () {
	location.reload()
})
