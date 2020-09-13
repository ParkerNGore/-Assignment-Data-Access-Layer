const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const url = process.env.MONGODB_URL;
const databaseName = process.env.MONGODB_DATABASE;

// Validation for .env file.
if (!url) {
  console.log(
    "DATABASE URL NOT SPECIFIED PLEASE ADD THE URL TO YOUR ENV FILE."
  );
  return;
}

if (!databaseName) {
  console.log(
    "DATABASE DATABASE NAME NOT SPECIFIED. PLEASE ADD THE MONGODB_DATABASE TO YOUR ENV FILE."
  );
  return;
}

console.log(url);
console.log(databaseName);

const collectionName = "characters";
const settings = {
  seeUnifiedTopology: true,
};

let databaseClient;
let characterCollection;

const connect = function () {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, settings, (error, client) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }
      databaseClient = client.db(databaseName);
      characterCollection = databaseClient.collection(collectionName);
      console.log("SUCCESSFULLY CONNECTED TO DATABASE");
      resolve();
    });
  });
};

const insertOne = function (character) {
  return new Promise((resolve, reject) => {
    characterCollection.insertOne(character, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }
      console.log("SUCCESSFULLY INSTERED A NEW DOCUMENT!");
      resolve();
    });
  });
};

const findAll = function () {
  const query = {};

  return new Promise((resolve, reject) => {
    characterCollection.find(query).toArray((error, documents) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      console.log(`SUCCESSFULLY FOUND ${documents.length} DOCUMENTS`);
      resolve(documents);
    });
  });
};

const findOne = function (query) {
  return new Promise((resolve, reject) => {
    characterCollection.find(query).toArray((error, documents) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      if (documents.length > 0) {
        console.log("SUCCESSFULLY FOUND DOCUMENT!");
        const document = documents[0];
        resolve(document);
      } else {
        reject("No document found!");
      }
    });
  });
};

const updateOne = function (query, newCharacter) {
  const newCharacterQuery = {};

  if (newCharacter.name) {
    newCharacterQuery.name = newCharacter.name;
  }

  if (newCharacter.level) {
    newCharacterQuery.level = newCharacter.level;
  }

  if (newCharacter.race) {
    newCharacterQuery.race = newCharacter.race;
  }

  if (newCharacter.subrace) {
    newCharacterQuery.subrace = newCharacter.subrace;
  }

  if (newCharacter.class) {
    newCharacterQuery.class = newCharacter.class;
  }

  if (newCharacter.subclass) {
    newCharacterQuery.subclass = newCharacter.subclass;
  }

  if (newCharacter.background) {
    newCharacterQuery.background = newCharacter.background;
  }

  if (newCharacter.alignment) {
    newCharacterQuery.alignment = newCharacter.alignment;
  }

  return new Promise((resolve, reject) => {
    characterCollection.updateOne(
      query,
      { $set: newCharacterQuery },
      (error, result) => {
        if (error) {
          console.log(error);
          reject;
          return;
        } else if (result.modifiedCount === 0) {
          console.log("No Document Found");
          reject("No Document Found");
          return;
        }

        console.log("SUCCESSFULLY UPDATED DOCUMENT!");
        resolve();
      }
    );
  });
};

const deleteOne = function (query) {
  return new Promise((resolve, reject) => {
    characterCollection.deleteOne(query, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      } else if (result.deletedCount === 0) {
        console.log("No Document Found");
        reject("No Document Found");
        return;
      }

      console.log("SUCCESSFULLY DELETED DOCUMENT!");
      resolve();
    });
  });
};

module.exports = { connect, insertOne, findAll, findOne, updateOne, deleteOne };
