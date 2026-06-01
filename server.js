const app = require("./src/App");
const connectToDb = require("./src/config/database");

const startServer = async () => {
  await connectToDb(); 

  app.listen(3000, () => {
    console.log("http://localhost:3000");
  });
};

startServer();