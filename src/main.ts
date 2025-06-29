import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;

const calendarContainer = document.createElement('div');
calendarContainer.id = 'calendar-container';

const clockContainer = document.createElement('div');
clockContainer.id = 'clock-container';

const canvas = document.createElement('canvas');
canvas.id = 'clock-canvas';
canvas.width = 400;
canvas.height = 400;

clockContainer.appendChild(canvas);

app.appendChild(calendarContainer);
app.appendChild(clockContainer);

const getRepublicanDate = (date: Date) => {
  const year = date.getFullYear();
  const startOfRepublicanYear = new Date(Date.UTC(year, 8, 22));

  let republicanYear = year - 1792;

  if (date < startOfRepublicanYear) {
    republicanYear--;
  }

  const isLeapYear = (republicanYear % 4 === 3 && republicanYear % 100 !== 99) || republicanYear % 400 === 399;

  const startOfGregorianYear = new Date(Date.UTC(republicanYear + 1792, 8, 22));

  const diff = date.getTime() - startOfGregorianYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (dayOfYear >= 365 + (isLeapYear ? 1 : 0)) {
    return null;
  }

  if (dayOfYear < 0) {
    return null;
  }

  const month = Math.floor(dayOfYear / 30);
  const day = dayOfYear % 30 + 1;

  return { republicanYear, month, day, dayOfYear };
};

const monthNames = [
  'Vendémiaire', 'Brumaire', 'Frimaire', 'Nivôse', 'Pluviôse', 'Ventôse',
  'Germinal', 'Floréal', 'Prairial', 'Messidor', 'Thermidor', 'Fructidor'
];

const dayNames = [
  'Primidi', 'Duodi', 'Tridi', 'Quartidi', 'Quintidi', 'Sextidi', 'Septidi', 'Octidi', 'Nonidi', 'Décadi'
];

const sansculottides = [
  'Jour de la Vertu', 'Jour du Génie', 'Jour du Travail', "Jour de l'Opinion", 'Jour des Récompenses', 'Jour de la Révolution'
];

const updateCalendar = () => {
  const now = new Date();
  const republicanDate = getRepublicanDate(now);

  if (republicanDate) {
    const { republicanYear, month, day, dayOfYear } = republicanDate;

    if (month < 12) {
      calendarContainer.innerHTML = `
        <h2>${monthNames[month]} An ${republicanYear}</h2>
        <p>${dayNames[(day - 1) % 10]}</p>
        <p>${day}</p>
      `;
    } else {
      calendarContainer.innerHTML = `
        <h2>Sans-culottides An ${republicanYear}</h2>
        <p>${sansculottides[dayOfYear - 360]}</p>
      `;
    }
  }
};

const drawClock = () => {
  const ctx = canvas.getContext('2d')!;
  const radius = canvas.width / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(radius, radius, radius * 0.9, 0, 2 * Math.PI);
  ctx.fillStyle = '#333';
  ctx.fill();

  ctx.font = '20px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 1; i <= 10; i++) {
    const angle = (i - 2.5) * (Math.PI / 5);
    const x = radius + radius * 0.75 * Math.cos(angle);
    const y = radius + radius * 0.75 * Math.sin(angle);
    ctx.fillText(i.toString(), x, y);
  }

  const now = new Date();
  // Calculate total seconds from midnight in Gregorian time, including milliseconds for smoother movement
  const gregorianSecondsToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000;

  // Convert to a fraction of the day, then to Republican time units
  const dayFraction = gregorianSecondsToday / 86400;
  const republicanHours = dayFraction * 10;
  const republicanMinutes = (republicanHours * 100) % 100;
  const republicanSeconds = Math.floor((republicanMinutes * 100) % 100);

  // Calculate hand angles
  // Hour hand: 10 hours for a full 2*PI rotation
  const hourAngle = (republicanHours * (Math.PI / 5)) - (Math.PI / 2);
  // Minute hand: 100 minutes for a full 2*PI rotation
  const minuteAngle = (republicanMinutes * (Math.PI / 50)) - (Math.PI / 2);
  // Second hand: 100 seconds for a full 2*PI rotation
  const secondAngle = (republicanSeconds * (Math.PI / 50)) - (Math.PI / 2);

  drawHand(ctx, hourAngle, radius * 0.5, 6, 'white');
  drawHand(ctx, minuteAngle, radius * 0.7, 4, 'white');
  drawHand(ctx, secondAngle, radius * 0.8, 2, 'red');
};

const drawHand = (ctx: CanvasRenderingContext2D, pos: number, length: number, width: number, color: string) => {
  const radius = canvas.width / 2;
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.strokeStyle = color;
  ctx.moveTo(radius, radius);
  ctx.lineTo(radius + length * Math.cos(pos), radius + length * Math.sin(pos));
  ctx.stroke();
};

setInterval(() => {
  updateCalendar();
  drawClock();
}, 864);

updateCalendar();
drawClock();
