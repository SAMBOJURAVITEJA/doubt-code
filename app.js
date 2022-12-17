let express = require("express");
let app = express();
app.use(express.json());
module.exports = app;
let DB = null;
let sqlite3 = require("sqlite3");
let { open } = require("sqlite");
let path = require("path");
let DBpath = path.join(__dirname, "todoApplication.db");
let initializingDb = async () => {
  try {
    DB = await open({
      filename: DBpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running properly");
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};
initializingDb();
app.get("/todos/", async (request, response) => {
  let { priority } = request.query;
  console.log(priority);
  let query1 = `
    select 
    *
    from 
    todo 
    where todo.priority like "${priority}"    
    `;
  let result1 = await DB.get(query1);

  response.send(result1);
});
app.get("/todos/", async (request, response) => {
  let { status } = request.query;
  if (status !== undefined) {
    console.log(status);
    let query2 = `
    select 
    *
    from 
    todo 
    where 
    todo.status like "${status}" ;   
    `;
    let result2 = await DB.all(query2);

    response.send(result2);
  } else {
    response.send("error");
  }
});
