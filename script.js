answers = {};
setTimeoutOld = setTimeout;
setTimeout = function (a, b, ...x) {
	setTimeoutOld(
		() => {
			try {
				a();
			} catch {}
		},
		b <= 3000 ? 1 : b,
		...x,
	);
};

function getQuestionText() {
	return $(".question-text")[0].innerText;
}

function getQuestionIdentifier() {
	qtext = String(CryptoJS.MD5(getQuestionText()));
	try {
		qtext += String(
			CryptoJS.MD5(
				Array.from($("li[role=option]"))
					.map((x) => x.innerText.toLowerCase())
					.sort()
					.join(),
			),
		);
	} catch {}
	try {
		qtext += String(CryptoJS.MD5($("img:eq(1)").attr("src")));
	} catch {}
	return qtext;
}

function typeAnswer(text) {
	box = $("input")[0];
	if (box.placeholder.includes("number"))
		text = text.match(/[+\-]?(?:0|[1-9]\d*)?(?:\.\d+)?(?:[eE][+\-]?\d+)?/)[0];
	box.value = text;
	box.dispatchEvent(
		new Event("input", {
			bubbles: true,
			cancelable: true,
		}),
	);
}

function clickOption(answer) {
	box = Array.from($("li[role=option]")).filter(
		(x) => x.innerText === answer.trim(),
	)[0];
	box.click();
}

function setCorrectAnswer() {
	if (getQuestionIdentifier() in answers) {
		setAnswer(answers[getQuestionIdentifier()][0]);
	} else {
		alert("Answer not found :(");
	}
}

function setAnswer(text) {
	try {
		typeAnswer(text);
	} catch {}
	try {
		clickOption(text);
	} catch {}
}

async function doQuestion() {
	result = setAnyAnswer();
	await new Promise((r) => setTimeoutOld(r, 100));
	$(".bg-green-80").click();
	await new Promise((r) => setTimeoutOld(r, 1000));
	$(".arrow-right").click();
}

function setAnyAnswer() {
	if (getQuestionIdentifier() in answers) {
		setAnswer(answers[getQuestionIdentifier()][0]);
	} else {
		try {
			x = $("li[role=option]")[0];
			x.click();
			return x.innerText;
		} catch {}
		setAnswer("123456");
	}
}

function play() {
	const player = $(
		'<iframe src="https://www.youtube.com/embed/At8v_Yc044Y?autoplay=1&loop=1&playlist=At8v_Yc044Y" allow="autoplay"></iframe>',
	);
	player.hide();
	$("body").prepend(player);
	$("button:contains(thick of it)")[0].innerText = "playing thick of it";
}
function generateButtons() {
	const template = (func, text) =>
		`<button class="btn bg-purple-80 bg-purple-hover ml-2 lh-close mb-2 mb-sm-0 r-bg-light r-bg-light-hover r-text-dark align-self-start" onclick="${func}()">${text}</button>`;
	$(template("setCorrectAnswer", "hint")).insertAfter($(".btn:eq(2)"));
	$(template("play", "play thick of it")).insertAfter($(".btn:eq(2)"));
}

function importFromURL(url, finished) {
	el = document.createElement("script");
	el.src = url;
	el.onload = finished;
	document.head.append(el);
}

async function fetchAnswers() {
	let response = await fetch(
		"https://raw.githubusercontent.com/smellyelephant/educake-hacks/refs/heads/main/answers.json",
	);
	response = await response.json();
	answers = response.hashed;
	unhashed = response.unhashed;
}

importFromURL("https://code.jquery.com/jquery-3.7.1.min.js", () => {
	console.log("jquery loaded", $);
	$ = jQuery;
	generateButtons();
});
importFromURL(
	"https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js",
);
fetchAnswers();
