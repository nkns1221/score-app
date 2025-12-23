const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let dataByDate = {};

io.on("connection", socket => {
  socket.emit("update", dataByDate);

  socket.on("addPerson", ({ date, name }) => {
    if (!dataByDate[date]) dataByDate[date] = [];
    dataByDate[date].push({ name, score: 0 });
    io.emit("update", dataByDate);
  });

  socket.on("changeScore", ({ date, index, delta }) => {
    dataByDate[date][index].score += delta;
    io.emit("update", dataByDate);
  });

  socket.on("exportCSV", date => {
    if (!dataByDate[date]) return;

    const csvWriter = createObjectCsvWriter({
      path: `scores_${date}.csv`,
      header: [
        { id: "name", title: "名前" },
        { id: "score", title: "得点" }
      ]
    });

    csvWriter.writeRecords(dataByDate[date]);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
