const socket = io();
const list = document.getElementById("list");
const dateInput = document.getElementById("date");

dateInput.valueAsDate = new Date();

let allData = {};

socket.on("update", data => {
  allData = data;
  render();
});

function render() {
  list.innerHTML = "";
  const date = dateInput.value;
  if (!allData[date]) return;

  allData[date].forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.score}</p>
      <button onclick="changeScore(${i},1)">＋</button>
      <button onclick="changeScore(${i},-1)">－</button>
    `;
    list.appendChild(div);
  });
}

function addPerson() {
  const name = document.getElementById("name").value;
  if (!name) return;
  socket.emit("addPerson", { date: dateInput.value, name });
  document.getElementById("name").value = "";
}

function changeScore(index, delta) {
  socket.emit("changeScore", {
    date: dateInput.value,
    index,
    delta
  });
}

function exportCSV() {
  socket.emit("exportCSV", dateInput.value);
  alert("CSVをサーバーに保存しました（RenderからDL可）");
}
