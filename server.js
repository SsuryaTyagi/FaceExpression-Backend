const app = require("./src/App");
const connectToDb = require("./src/config/database");

const startServer = async () => {
  await connectToDb();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

startServer();
