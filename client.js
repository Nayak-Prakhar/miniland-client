let socket;
let playerName = "Player" + Math.floor(Math.random() * 1000);
let players = {};
let bombs = [];
let myX = 400;
let alive = true;

function joinGame() {
  document.getElementById("start-screen").hidden = true;
  document.getElementById("game-area").hidden = false;

  socket = io("wss://RENDER_BACKEND_URL"); // Replace this later
  socket.emit("join", playerName);

  socket.on("state", gameState => {
    players = gameState.players;
    bombs = gameState.bombs;
    drawGame();
  });

  socket.on("dead", () => {
    alive = false;
    alert("You lost! A bomb hit you.");
  });

  socket.on("winner", name => {
    alert(`${name} is the WINNER!`);
  });

  document.addEventListener("keydown", e => {
    if (!alive) return;
    if (e.key === "ArrowLeft") myX -= 20;
    if (e.key === "ArrowRight") myX += 20;
    socket.emit("move", myX);
  });

  setInterval(() => {
    if (alive) socket.emit("move", myX);
  }, 100);
}

function drawGame() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const [name, x] of Object.entries(players)) {
    ctx.fillStyle = (name === playerName) ? "lime" : "white";
    ctx.fillRect(x, 550, 30, 30);
    ctx.fillText(name, x, 540);
  }

  ctx.fillStyle = "red";
  bombs.forEach(bomb => {
    ctx.beginPath();
    ctx.arc(bomb.x, bomb.y, 10, 0, Math.PI * 2);
    ctx.fill();
  });
}
