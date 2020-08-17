let btnJoinRoom = document.getElementById('btn-join-room');
let roomIdComponent = document.getElementById('input-roomId')

btnJoinRoom.onclick = () => {
	window.location.href = roomIdComponent.value;
}