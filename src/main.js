const rpmArc = document.getElementById('rpmArc');
const rpmValue = document.getElementById('rpmValue');
const speedValue = document.getElementById('speedValue');

let rpm = 3.2;
let speed = 124;

function updateDashboard() {
  rpm = (Math.random() * 8).toFixed(1);
  speed = Math.floor(Math.random() * 240);

  rpmValue.textContent = rpm;
  speedValue.textContent = speed;

  const maxOffset = 628;
  const offset = maxOffset - (rpm / 8) * maxOffset;
  rpmArc.style.strokeDashoffset = offset;
}

setInterval(updateDashboard, 1500);
