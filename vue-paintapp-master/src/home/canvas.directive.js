import { v4 } from 'uuid';
import io from 'socket.io-client';

import { authHeader } from '../_helpers';
import { networkInterfaces } from 'os';

function inserted(el) {
  const apiUrl = 'http://' + location.hostname + ':4000';

  const canvas = el;
  const ctx = canvas.getContext('2d');
  var socket = io.connect(apiUrl);
  const user = JSON.parse(localStorage.getItem('user'));

  const users = JSON.parse(localStorage.getItem('users'));

  const userId = user[Object.keys(user)[0]];

  canvas.width = 1000;
  canvas.height = 800;

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = 5;

  socket.on('new message', function(data) {
    const { userId: id, line } = data.message;

    const result = users.find(user => user.id === id);

    let color = result.color;

    line.forEach(position => {
      paint(position.start, position.stop, color);
    });
  });
  let prevPos = { offsetX: 0, offsetY: 0 };
  let line = [];
  let isPainting = false;
  const USER_STROKE = user.color;
  const GUEST_STROKE = user.color;

  function handleMouseDown(e) {
    const { offsetX, offsetY } = e;
    isPainting = true;
    prevPos = { offsetX, offsetY };
  }

  function endPaintEvent() {
    if (isPainting) {
      isPainting = false;
      sendPaintData();
    }
  }

  function handleMouseMove(e) {
    if (isPainting) {
      const { offsetX, offsetY } = e;
      const offSetData = { offsetX, offsetY };
      const positionInfo = {
        start: { ...prevPos },
        stop: { ...offSetData }
      };
      line = line.concat(positionInfo);
      paint(prevPos, offSetData, USER_STROKE);
    }
  }

  function sendPaintData() {
    const body = {
      line,
      userId
    };

    socket.emit('sending message', body);
  }

  function paint(prevPosition, currPosition, strokeStyle) {
    const { offsetX, offsetY } = currPosition;
    const { offsetX: x, offsetY: y } = prevPosition;

    ctx.beginPath();
    ctx.strokeStyle = strokeStyle;
    ctx.moveTo(x, y);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    prevPos = { offsetX, offsetY };
  }

  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', endPaintEvent);
  canvas.addEventListener('mouseleave', endPaintEvent);
}

export default {
  inserted
};
