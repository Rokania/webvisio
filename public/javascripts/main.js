let clientId;
let peer;
let myVideoStream;
let myVideoComponent;
let videoComponents = {};
let isVideoDisplaying = true;
let isMute = false;
let btnShowVideo = document.getElementById('btn-show-video');
let btnMuteAudio = document.getElementById('btn-mute-audio');
let btnExit = document.getElementById('btn-exit');

async function getUserMedia() {
	myVideoStream = await navigator.mediaDevices.getUserMedia({
		video: true,
		audio: true
	});
	myVideoComponent = document.createElement('video');
	myVideoComponent.muted = true;
	addVideo(myVideoComponent, myVideoStream);
	initializeSocket();
}

function addVideo(videoComponent, stream) {
	const videos = document.getElementById('videos');
	videoComponent.srcObject = stream;
	videoComponent.addEventListener('loadedmetadata', (_) => {
		videoComponent.play();
	})
	videos.append(videoComponent);
}

function initializeSocket() {
    let socket = io(socketConfig.host);
	socket.on('connect', (_ => {
		clientId = socket.id;
		initializePeer();
		socket.emit('joinRoom', { roomId });
		socket.on('userConnected', (userId) => {
			const call = peer.call(userId, myVideoStream); // Fait un appel au nouveau user
			const videoComponent = document.createElement('video');
			videoComponents[userId] = videoComponent;
			call.on('stream', (mediaStream) => {
				addVideo(videoComponent, mediaStream);
			});
			call.on('close', () => {
				videoComponent.remove();
			})
		});
		socket.on('userDisconnected', (userId) => {
			videoComponents[userId].remove();
		});
	}))
}

function initializePeer() {
    peer = new Peer(clientId, {HOST_PEER:peerConfig.host, PATH_PEER:peerConfig.path});
	peer.on('open', (id) => {
	});
	peer.on('call', function (call) {
		const videoComponent = document.createElement('video');
		videoComponents[call.peer] = videoComponent;
		call.answer(myVideoStream);
		call.on('stream', (mediaStream) => {
			addVideo(videoComponent, mediaStream);
		});
		call.on('close', () => {
			videoComponent.remove();
		})
	});
}

btnShowVideo.onclick = () => {
	isVideoDisplaying = !isVideoDisplaying;
	if (isVideoDisplaying) {
		btnShowVideo.classList.remove('fa-video-slash');
		btnShowVideo.classList.add('fa-video');
		myVideoComponent.srcObject = myVideoStream;
		myVideoStream.getVideoTracks()[0].enabled = true;
	} else {
		btnShowVideo.classList.remove('fa-video');
		btnShowVideo.classList.add('fa-video-slash');
		myVideoComponent.srcObject = null;
		myVideoStream.getVideoTracks()[0].enabled = false;
	}
}

btnMuteAudio.onclick = () => {
	isMute = !isMute;
	if (isMute) {
		btnMuteAudio.classList.remove('fa-microphone');
		btnMuteAudio.classList.add('fa-microphone-slash');
		myVideoStream.getAudioTracks()[0].enabled = false;
	} else {
		btnMuteAudio.classList.remove('fa-microphone-slash');
		btnMuteAudio.classList.add('fa-microphone');
		myVideoStream.getAudioTracks()[0].enabled = true;
	}
}

btnExit.onclick = () => {
	window.location.href = '/';
}

getUserMedia();