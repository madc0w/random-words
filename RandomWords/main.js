const defaultVoiceLanguage = 'pl';

const consonants = [
	'b',
	'd',
	'f',
	'g',
	'h',
	'j',
	'k',
	'l',
	'm',
	'n',
	'p',
	'r',
	's',
	't',
	'v',
	'w',
	'z',
	'bl',
	'br',
	'brr',
	'd\'k',
	'dr',
	'fr',
	'f\'t',
	'gr',
	'grr',
	'gw',
	'gn',
	'gh',
	'h\'t',
	'h\'k',
	'kr',
	'krr',
	'kh',
	'kl',
	'k\'t',
	'ks',
	'km',
	'kw',
	'pr',
	'prr',
	'p\'t',
	'pš',
	'r',
	'rr',
	's',
	'ss',
	'sk',
	'sm',
	'sn',
	'sp',
	'sr',
	'srr',
	'š',
	'tr',
	'trr',
	'ts',
	'vr',
	'vrr',
	'zr',
	'zrr',
];

const vowels = [
	'a',
	'au',
	'aa',
	'ai',
	'e',
	'ee',
	'ei',
	'eu',
	'i',
	'ii',
	'o',
	'oo',
	'ö',
	'öö',
	'ou',
	'ü',
	'üü',
	'u',
	'uu',
];


var wordsDiv, sayAllWordsButton, clearWordsButton, generateInfiniteButton, shutUpCheckbox, voiceSelect, voices;
function load() {
	wordsDiv = document.getElementById('words');
	sayAllWordsButton = document.getElementById('say-all-words-button');
	clearWordsButton = document.getElementById('clear-words-button');
	generateInfiniteButton = document.getElementById('generate-infinite-button');
	voiceSelect = document.getElementById('voice-select');
	shutUpCheckbox = document.getElementById('shut-up-checkbox');
	const voiceCheckIntervalId = setInterval(() => {
		voices = speechSynthesis.getVoices();
		if (voices && voices.length > 0) {
			clearInterval(voiceCheckIntervalId);
			voiceSelect.innerHTML = '';
			var i = 0;
			var selectedVoiceIndex = 0;
			for (const voice of voices) {
				// console.log('voice ', voice);
				if (voice.lang.startsWith(defaultVoiceLanguage)) {
					selectedVoiceIndex = i;
				}
				voiceSelect.innerHTML += `<option value="${i++}">${voice.name} (${voice.lang})</option>`;
			}

			voiceSelect.value = localStorage.voice || selectedVoiceIndex;
		}
	}, 20);

	shutUpCheckbox.checked = true.toString() == localStorage.isShutUp;
	if (localStorage.words) {
		wordsDiv.innerHTML = localStorage.words;
		wordsDiv.className = '';
		sayAllWordsButton.className = 'button';
		clearWordsButton.className = 'button';
	}
}

function generateWord(speakEndedCallback) {
	const wordLength = 6 + Math.random() * 6;

	var word = '';
	var isConsonant = true;
	do {
		const arr = isConsonant ? consonants : vowels;
		word += arr[Math.floor(Math.random() * arr.length)];
		isConsonant = !isConsonant;
	} while (word.length < wordLength);
	wordsDiv.innerHTML += word + ' <br/>';
	localStorage.words = wordsDiv.innerHTML;

	sayAllWordsButton.className = 'button';
	clearWordsButton.className = 'button';
	wordsDiv.className = '';
	wordsDiv.scrollTop = wordsDiv.scrollHeight;
	speak(word, speakEndedCallback);
}

var isInfiniteRunning = false;
function generateInfinite() {
	isInfiniteRunning = !isInfiniteRunning;
	if (isInfiniteRunning) {
		function callback() {
			if (isInfiniteRunning) {
				generateWord(callback);
			}
		}
		speak(wordsDiv.innerText, () => {
			generateWord(callback);
		});
	}
	document.getElementById('generate-infinite-inactive').className = isInfiniteRunning ? 'hidden' : '';
	document.getElementById('generate-infinite-active').className = isInfiniteRunning ? '' : 'hidden';
}

function sayAllWords() {
	// console.log(wordsDiv.innerText);
	shutUpCheckbox.checked = false;
	speak(wordsDiv.innerText);
}

function clearWords() {
	wordsDiv.innerHTML = '';
	sayAllWordsButton.className = 'hidden';
	clearWordsButton.className = 'hidden';
	wordsDiv.className = 'hidden';
	delete localStorage.words;
}

function speak(str, endedCallback) {
	if (voices && voices.length > 0 && !shutUpCheckbox.checked) {
		const utterance = new SpeechSynthesisUtterance(str);
		const i = parseInt(voiceSelect.selectedOptions.item(0).value);
		utterance.voice = voices[i];
		if (endedCallback) {
			utterance.addEventListener('end', endedCallback);
		}
		speechSynthesis.speak(utterance);
	}
}

function saveState() {
	localStorage.isShutUp = shutUpCheckbox.checked;
	localStorage.voice = voiceSelect.value;
}
