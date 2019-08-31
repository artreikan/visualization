var analyzer, canvas, ctx, random = Math.random, circles = [];

window.onload = function () {
	canvas = document.createElement('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	document.body.appendChild(canvas);
	ctx = canvas.getContext('2d');

	setUpAudio();

	for (var i = 0; i < 20; i++) {
		circles[i] = new Circle();
		circles[i].draw();
	}

	draw();
}

function setUpAudio () {
	var audio = document.createElement('audio');
	audio.src = 'Wice - Vandalism.mp3';
	audio.controls = 'true';
	document.body.appendChild(audio);

	var audioContext = new AudioContext();
	analyzer = audioContext.createAnalyser();
	var source = audioContext.createMediaElementSource(audio);
	source.connect(analyzer);
	analyzer.connect(audioContext.destination);
	audio.play();
}

function draw () {
	requestAnimationFrame(draw);
	var freqByteData = new Uint8Array(analyzer.frequencyBinCount);
	analyzer.getByteFrequencyData(freqByteData);

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (var i = 1; i < circles.length; i++) {
		circles[i].radius = freqByteData[i] * 2;
		circles[i].y = circles[i].y > canvas.height ? 0 : circles[i].y + 1;
		circles[i].draw();
	}

	for (var i = 1, freqLength = freqByteData.length; i < freqLength; i+=10) {

		ctx.fillStyle = 'rgb(' + getRandomColor() + ',' + getRandomColor() + ',' + getRandomColor() + ')';
		ctx.fillRect(i + 300, canvas.height - freqByteData[i] * 1.5, 10, canvas.height);
		ctx.strokeRect(i + 300, canvas.height - freqByteData[i] * 1.5, 10, canvas.height);
	}
}

function getRandomColor () {
	return random() * 255 >> 0;
}

function Circle () {
	this.x = random() * canvas.width;
	this.y = random() * canvas.height;
	this.radius = random() * 100 + 50;
	this.color = 'rgb(' + getRandomColor() + ',' + getRandomColor() + ',' + getRandomColor() + ')';
}

Circle.prototype.draw = function () {
	var that = this;
	ctx.save();
	ctx.beginPath();
	ctx.globalAlpha = random() / 3 + 0.2;
	ctx.arc(that.x, that.y, that.radius, 0, Math.PI * 2);
	ctx.fillStyle = that.color;
	ctx.fill();
	ctx.restore();
}
