import express from "express";
import router from "./routes";
import { orderBookService } from "./handlers/service";

const app = express();
const port = 3000;

app.use(express.json());

app.use(router)

// start order matching with a 5-second interval
orderBookService.startMatching(5000);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
