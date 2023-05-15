import makeApp from "./app";
import config from "./config";

// new express instance
const app = makeApp();

// start the server
app.listen(config.PORT, () => {
  console.log(`The server is running on port ${config.PORT}`);
});
