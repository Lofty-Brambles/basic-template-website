const https = require("https");
const fs = require("fs/promises");

try {
  const everyFile = fs.readdir("./", {
    encoding: "utf-8",
    withFileTypes: true,
  });

  const files = everyFile
    .filter((e) => /\.html$/gi.test(e.name))
    .map((e) =>
      e.name === "index.html" ? "" : e.name.slice(0, e.name.length - 5)
    );

  https
    .createServer(async (req, res) => {
      res.statusCode = 200;
      const url = req.url.slice(1);
      res.setHeader("Content-Type", "text/html");

      if (files.includes(url)) {
        const name = url === "" ? "index" : url;
        const file = fs.readFile(`./${name}.html`, "utf-8");
        res.end(file);
      } else {
        const file = fs.readFile(`./404.html`, "utf-8");
        res.end(file);
      }
    })
    .listen(3000, () => {
      console.log("Connected.");
    });
} catch (e) {
  console.log("The details of the pages weren't found!");
}
