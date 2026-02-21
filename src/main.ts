const rpmArc = document.getElementById('rpmArc');
const rpmValue = document.getElementById('rpmValue');
const speedValue = document.getElementById('speedValue');

let rpm: number = 3.2;
let speed: number = 124;

function updateDashboard() {
  rpm = (Math.random() * 8).toFixed(1) as unknown as number;
  speed = Math.floor(Math.random() * 240);

  (rpmValue as HTMLElement).textContent = rpm.toFixed(1);
  (speedValue as HTMLElement).textContent = speed.toString();

  const maxOffset = 628;
  const offset = maxOffset - (rpm / 8) * maxOffset;
  (rpmArc as HTMLElement).style.strokeDashoffset = offset.toString();
}

setInterval(updateDashboard, 1500);
