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

  if (
    !body.name ||
    !body.level ||
    !body.class ||
    !body.race ||
    !body.subclass ||
    !body.subrace ||
    !body.alignment ||
    !body.background ||
    !body.attributes.constitution ||
    !body.attributes.strength ||
    !body.attributes.dexterity ||
    !body.attributes.wisdom ||
    !body.attributes.intelligence ||
    !body.attributes.charisma
  ) {
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

  if (isNaN(Number(body.level)) || body.level < 1) {
    response.status(400).send("The level parameter must be of type number");
    return;
  }

  if (typeof body.class !== "string") {
    response.status(400).send("The class parameter must be of type string");
    return;
  }

  if (typeof body.subclass !== "string") {
    response.status(400).send("The subclass parameter must be of type string");
    return;
  }

  if (typeof body.race !== "string") {
    response.status(400).send("The race parameter must be of type string");
    return;
  }

  if (typeof body.subrace !== "string") {
    response.status(400).send("The subrace parameter must be of type string");
    return;
  }

  if (typeof body.alignment !== "string") {
    response.status(400).send("The alignment parameter must be of type string");
    return;
  }

  if (typeof body.background !== "string") {
    response
      .status(400)
      .send("The background name parameter must be of type string");
    return;
  }

  if (
    isNaN(Number(body.attributes.constitution)) ||
    body.attributes.constitution < 3 ||
    body.attributes.constitution > 20
  ) {
    response
      .status(400)
      .send("The Constitution cannot be lower than 3 or higher than 20.");
    return;
  }

  if (
    isNaN(Number(body.attributes.strength)) ||
    body.attributes.strength < 3 ||
    body.attributes.strength > 20
  ) {
    response
      .status(400)
      .send("The Strength cannot be lower than 3 or higher than 20.");
    return;
  }

  if (
    isNaN(Number(body.attributes.dexterity)) ||
    body.attributes.dexterity < 3 ||
    body.attributes.dexterity > 20
  ) {
    response
      .status(400)
      .send("The Dexterity cannot be lower than 3 or higher than 20.");
    return;
  }

  if (
    isNaN(Number(body.attributes.wisdom)) ||
    body.attributes.wisdom < 3 ||
    body.attributes.wisdom > 20
  ) {
    response
      .status(400)
      .send("The Wisdom cannot be lower than 3 or higher than 20.");
    return;
  }

  if (
    isNaN(Number(body.attributes.intelligence)) ||
    body.attributes.intelligence < 3 ||
    body.attributes.intelligence > 20
  ) {
    response
      .status(400)
      .send("The Intelligence cannot be lower than 3 or higher than 20.");
    return;
  }

  if (
    isNaN(Number(body.attributes.charisma)) ||
    body.attributes.charisma < 3 ||
    body.attributes.charisma > 20
  ) {
    response
      .status(400)
      .send("The Charisma cannot be lower than 3 or higher than 20.");
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
    return;
  }
  if (
    (body.level && isNaN(Number(body.level))) ||
    body.level < 1 ||
    body.level > 20
  ) {
    response.status(400).send("The level parameter must be of type number");
    return;
  }
  if (body.class && typeof body.class !== "string") {
    response.status(400).send("The class parameter must be of type string");
    return;
  }
  if (body.class && typeof body.subclass !== "string") {
    response.status(400).send("The subclass parameter must be of type string");
    return;
  }
  if (body.race && typeof body.race !== "string") {
    response.status(400).send("The race parameter must be of type string");
    return;
  }
  if (body.race && typeof body.subrace !== "string") {
    response.status(400).send("The subrace parameter must be of type string");
    return;
  }
  if (body.background && typeof body.background !== "string") {
    response
      .status(400)
      .send("The background parameter must be of type string");
    return;
  }
  if (body.alignment && typeof body.alignment !== "string") {
    response.status(400).send("The alignment parameter must be of type string");
    return;
  }

  if (
    (body.attributes.constitution &&
      isNaN(Number(body.attributes.constitution))) ||
    body.attributes.constitution < 3 ||
    body.attributes.constitution > 20
  ) {
    response
      .status(400)
      .send("The constitution parameter must be of type number");
    return;
  }
  if (
    (body.attributes.strength && isNaN(Number(body.attributes.strength))) ||
    body.attributes.strength < 3 ||
    body.attributes.strength > 20
  ) {
    response.status(400).send("The strength parameter must be of type number");
    return;
  }
  if (
    (body.attributes.dexterity && isNaN(Number(body.attributes.dexterity))) ||
    body.attributes.dexterity < 3 ||
    body.attributes.dexterity > 20
  ) {
    response.status(400).send("The dexterity parameter must be of type number");
    return;
  }
  if (
    (body.attributes.wisdom && isNaN(Number(body.attributes.wisdom))) ||
    body.attributes.wisdom < 3 ||
    body.attributes.wisdom > 20
  ) {
    response.status(400).send("The wisdom parameter must be of type number");
    return;
  }
  if (
    (body.attributes.intelligence &&
      isNaN(Number(body.attributes.intelligence))) ||
    body.attributes.intelligence < 3 ||
    body.attributes.intelligence > 20
  ) {
    response
      .status(400)
      .send("The intelligence parameter must be of type number");
    return;
  }
  if (
    (body.attributes.charisma && isNaN(Number(body.attributes.charisma))) ||
    body.attributes.charisma < 3 ||
    body.attributes.charisma > 20
  ) {
    response.status(400).send("The charisma parameter must be of type number");
    return;
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
