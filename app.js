
const express = require("express");
const app = express();
const port = 3000;
const schoolRoutes = require("./routes/schoolRoutes");

app.use(express.json());
app.use("/api", schoolRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
