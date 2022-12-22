import express from "express"; // 3RD PARTY MODULE
import fs from "fs"; // CORE MODULE (package that doesn't need to be installed)
import { fileURLToPath } from "url"; // CORE MODULE
import { dirname, join } from "path"; // CORE MODULE
import uniqid from "uniqid"; // 3RD PARTY MODULE
const blogsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogposts.json"
);

const blogsRouter = express.Router();
// //                                      1. POST --> POST http://localhost:3001/users/
blogsRouter.post("/", (request, response) => {
  console.log("REQUEST BODY: ", request.body);
  const newBlog = { ...request.body, createdAt: new Date(), id: uniqid() };
  console.log("NEW USER: ", newBlog);
  const blogsArray = JSON.parse(fs.readFileSync(blogsJSONPath));
  blogsArray.push(newBlog);
  fs.writeFileSync(blogsJSONPath, JSON.stringify(blogsArray)); // We cannot pass an array to writeFile function
  response.status(201).send({ id: newBlog.id });
});

// //                                      2. READ --> GET http://localhost:3001/users/
blogsRouter.get("/", (request, response) => {
  // 1. Read the content of users.json file
  const fileContent = fs.readFileSync(blogsJSONPath); // this gives us back a BUFFER OBJECT (which is machine language)
  console.log("FILE CONTENT: ", fileContent);
  // 2. Obtain an array from that file
  const blogs = JSON.parse(fileContent);
  // 3. Send back the array as a response
  response.send(blogs);
});
// //                                      3. READ (single user) --> GET http://localhost:3001/users/:userId
// usersRouter.get("/:userId", (request, response) => {
//   const userID = request.params.userId;
//   const blogsArray = JSON.parse(fs.readFileSync(blogsJSONPath));
//   const foundUser = blogsArray.find((user) => user.id === userID);
//   response.send(foundUser);
// });
// //                                        4. UPDATE (single user) --> PUT http://localhost:3001/users/:userId (+ body)
// usersRouter.put("/:userId", (request, response) => {
//   const blogsArray = JSON.parse(fs.readFileSync(blogsJSONPath));

//   const index = blogsArray.findIndex(
//     (user) => user.id === request.params.userId
//   );
//   const oldUser = blogsArray[index];

//   const updatedUser = { ...oldUser, ...request.body, updatedAt: new Date() };

//   blogsArray[index] = updatedUser;

//   fs.writeFileSync(blogsJSONPath, JSON.stringify(blogsArray));

//   response.send(updatedUser);
// });

// //                                           5. DELETE (single user) --> DELETE http://localhost:3001/users/:userId
// usersRouter.delete("/:userId", (request, response) => {
//   const blogsArray = JSON.parse(fs.readFileSync(blogsJSONPath));
//   const remainingUsers = blogsArray.filter(
//     (user) => user.id !== request.params.userId
//   );

//   fs.writeFileSync(blogsJSONPath, JSON.stringify(remainingUsers));
//   response.status(204).send();
// });

export default blogsRouter; // Please do not forget this!
