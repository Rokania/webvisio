var express = require('express');
var router = express.Router();
const uniqid = require('uniqid');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.post('/', (req, res) => {
  const roomId = uniqid();
  res.redirect(`/${roomId}`);
});

router.get('/:roomId', (req, res) => {
  const peerConfig = {
    host: process.env.HOST_PEER,
    port: process.env.PORT_PEER,
    path: process.env.PATH_PEER
  }
  const roomId = req.params.roomId;
  res.render('room', {roomId, peerConfig: JSON.stringify(peerConfig)});
}); 

module.exports = router;
