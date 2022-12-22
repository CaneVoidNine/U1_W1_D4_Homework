import express from "express"; // 3RD PARTY MODULE
import fs from "fs"; // CORE MODULE (package that doesn't need to be installed)
import { fileURLToPath } from "url"; // CORE MODULE
import { dirname, join } from "path"; // CORE MODULE
import uniqid from "uniqid"; // 3RD PARTY MODULE
const usersJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);

console.log("TARGET --> ", usersJSONPath);

const usersRouter = express.Router();
usersRouter.post("/", (request, response) => {
  console.log("REQUEST BODY: ", request.body);
  const newUser = { ...request.body, createdAt: new Date(), id: uniqid() };
  console.log("NEW USER: ", newUser);
  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath));
  usersArray.push(newUser);
  fs.writeFileSync(usersJSONPath, JSON.stringify(usersArray)); // We cannot pass an array to writeFile function
  response.status(201).send({ id: newUser.id });
});
//                                      2. READ --> GET http://localhost:3001/users/
usersRouter.get("/", (request, response) => {
  // 1. Read the content of users.json file
  const fileContent = fs.readFileSync(usersJSONPath); // this gives us back a BUFFER OBJECT (which is machine language)
  console.log("FILE CONTENT: ", fileContent);
  // 2. Obtain an array from that file
  const users = JSON.parse(fileContent);
  // 3. Send back the array as a response
  response.send(users);
});
//                                      3. READ (single user) --> GET http://localhost:3001/users/:userId
usersRouter.get("/:userId", (request, response) => {
  const userID = request.params.userId;
  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath));
  const foundUser = usersArray.find((user) => user.id === userID);
  response.send(foundUser);
});
//                                        4. UPDATE (single user) --> PUT http://localhost:3001/users/:userId (+ body)
usersRouter.put("/:userId", (request, response) => {
  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath));

  const index = usersArray.findIndex(
    (user) => user.id === request.params.userId
  );
  const oldUser = usersArray[index];

  const updatedUser = { ...oldUser, ...request.body, updatedAt: new Date() };

  usersArray[index] = updatedUser;

  fs.writeFileSync(usersJSONPath, JSON.stringify(usersArray));

  response.send(updatedUser);
});

//                                           5. DELETE (single user) --> DELETE http://localhost:3001/users/:userId
usersRouter.delete("/:userId", (request, response) => {
  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath));
  const remainingUsers = usersArray.filter(
    (user) => user.id !== request.params.userId
  );

  fs.writeFileSync(usersJSONPath, JSON.stringify(remainingUsers));
  response.status(204).send();
});

export default usersRouter; // Please do not forget this!
