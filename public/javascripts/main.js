let clientId;
let peer;
let videoStream;
let videoComponents = {};

async function getUserMedia() {
	videoStream = await navigator.mediaDevices.getUserMedia({
		video: true,
		audio: true
	});
	addVideo(document.createElement('video'), videoStream);
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
	let socket = io();
	socket.on('connect', (_ => {
		clientId = socket.id;
		initializePeer();
		socket.emit('joinRoom', { roomId });
		socket.on('userConnected', (userId) => {
			const call = peer.call(userId, videoStream); // Fait un appel au nouveau user
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
	peer = new Peer(clientId, peerConfig);
	peer.on('open', (id) => {
	});
	peer.on('call', function (call) {
		const videoComponent = document.createElement('video');
		videoComponents[call.peer] = videoComponent;
		call.answer(videoStream);
		call.on('stream', (mediaStream) => {
			addVideo(videoComponent, mediaStream);
		});
		call.on('close', () => {
			videoComponent.remove();
		})
	});
}
getUserMedia();