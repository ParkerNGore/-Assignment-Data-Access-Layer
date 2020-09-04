const express = require("express");
const bodyParser = require("body-parser");
const dataAccessLayer = require("./dataAccessLayer");
const cors = require("cors");
const { ObjectId, ObjectID } = require("mongodb");

dataAccessLayer.connect();

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.get("/api/characters", async (request, response) => {
  const characters = await dataAccessLayer.findAll();

  response.send(characters);
});

app.get("/api/characters/:id", async (request, response) => {
  const characterId = request.params.id;

  if (!ObjectID.isValid(characterId)) {
    response.status(400).send(`CharacterID ${characterId} is incorrect.`);
    return;
  }

  const characterQuery = {
    _id: new ObjectId(characterId),
  };
  let character;
  try {
    character = await dataAccessLayer.findOne(characterQuery);
  } catch (error) {
    response.status(404).send(`Character with id ${characterId} not found!`);
    return;
  }
  response.send(character);
});

app.post("/api/characters", async (request, response) => {
  const body = request.body;

  if (!body.name || !body.level || !body.class || !body.race) {
    response
      .status(400)
      .send(
        "Bad Request. Validation Error. Please ensure all parameters are included."
      );
    return;
  }

  if (typeof body.name !== "string") {
    response.status(400).send("The name parameter must be of type string");
    return;
  }

  if (isNaN(Number(body.level)) || body.level <= 0) {
    response.status(400).send("The level parameter must be of type number");
    return;
  }

  if (typeof body.class !== "string") {
    response
      .status(400)
      .send("The class name parameter must be of type string");
    return;
  }

  if (typeof body.race !== "string") {
    response.status(400).send("The race name parameter must be of type string");
    return;
  }

  if (typeof body.alignment !== "string") {
    response
      .status(400)
      .send("The alignment name parameter must be of type string");
    return;
  }

  if (typeof body.background !== "string") {
    response
      .status(400)
      .send("The background name parameter must be of type string");
    return;
  }

  await dataAccessLayer.insertOne(body);

  response.status(201).send();
});

app.put("/api/characters/:id", async (request, response) => {
  const characterId = request.params.id;
  const body = request.body;

  if (!ObjectID.isValid(characterId)) {
    response.status(400).send(`CharacterID: ${characterId} is incorrect.`);
    return;
  }

  if (body.name && typeof body.name !== "string") {
    response.status(400).send("The name parametr must be of type string");
  }
  if ((body.level && isNaN(Number(body.level))) || body.level <= 0) {
    response.status(400).send("The level parameter must be of type number");
  }
  if (body.class && typeof body.class !== "string") {
    response.status(400).send("The class parameter must be of type string");
  }
  if (body.race && typeof body.race !== "string") {
    response.status(400).send("The race parameter must be of type string");
  }
  if (body.background && typeof body.background !== "string") {
    response
      .status(400)
      .send("The background parameter must be of type string");
  }
  if (body.alignment && typeof body.alignment !== "string") {
    response.status(400).send("The alignment parameter must be of type string");
  }

  const characterQuery = {
    _id: new ObjectID(characterId),
  };
  try {
    await dataAccessLayer.updateOne(characterQuery, body);
  } catch (error) {
    response.status(404).send(`Character with id: ${characterId} not found!`);
    return;
  }

  response.send();
});

app.delete("/api/characters/:id", async (request, response) => {
  const characterId = request.params.id;

  if (!ObjectID.isValid(characterId)) {
    response.status(400).send(`CharacterID ${characterId} is incorrect.`);
    return;
  }

  const characterQuery = {
    _id: new ObjectId(characterId),
  };
  try {
    await dataAccessLayer.deleteOne(characterQuery);
  } catch (error) {
    response.status(404).send(`Character with id ${characterId} not found!`);
    return;
  }

  response.send();
});

const port = process.env.PORT ? process.env.PORT : 3005;
app.listen(port, () => {
  console.log("Character Collection API Server Started");
});
