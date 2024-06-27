import express from "express";

const PORT = 3000;

let app = new express();

app.use(express.static("public"));
app.listen(PORT);
