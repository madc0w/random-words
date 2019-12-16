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


var wordsDiv, sayAllWordsButton, clearWordsButton, voiceSelect, voices;
function load() {
	wordsDiv = document.getElementById('words');
	sayAllWordsButton = document.getElementById('say-all-words-button');
	clearWordsButton = document.getElementById('clear-words-button');
	voiceSelect = document.getElementById('voice-select');
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
			voiceSelect.value = selectedVoiceIndex;
		}
	}, 20);
}

function generateWord() {
	const wordLength = 6 + Math.random() * 6;

	var word = '';
	var isConsonant = true;
	do {
		const arr = isConsonant ? consonants : vowels;
		word += arr[Math.floor(Math.random() * arr.length)];
		isConsonant = !isConsonant;
	} while (word.length < wordLength);
	wordsDiv.innerHTML += word + ' <br/>';
	speak(word);

	sayAllWordsButton.className = 'button';
	clearWordsButton.className = 'button';
	wordsDiv.className = '';
	wordsDiv.scrollTop = wordsDiv.scrollHeight;
}

function sayAllWords() {
	console.log(wordsDiv.innerText);
	speak(wordsDiv.innerText);
}

function clearWords() {
	wordsDiv.innerHTML = '';
	sayAllWordsButton.className = 'hidden';
	clearWordsButton.className = 'hidden';
	wordsDiv.className = 'hidden';
}

function speak(str) {
	if (voices && voices.length > 0) {
		const utterance = new SpeechSynthesisUtterance(str);
		const i = parseInt(voiceSelect.selectedOptions.item(0).value);
		utterance.voice = voices[i];
		speechSynthesis.speak(utterance);
	}
}
