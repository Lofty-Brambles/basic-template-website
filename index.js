const http = require("http");
const fs = require("fs/promises");

const script = async () => {
  const everyFile = await fs.readdir("./", {
    encoding: "utf-8",
    withFileTypes: true,
  });

  const files = everyFile
    .filter((e) => /\.html$/.test(e.name))
    .map((e) =>
      e.name === "index.html" ? "" : e.name.slice(0, e.name.length - 5)
    );

  http
    .createServer(async (req, res) => {
      res.statusCode = 200;
      const url = req.url.slice(1, req.url.length - 5);
      if (url !== "style") {
        res.setHeader("Content-Type", "text/html");

        if (files.includes(url)) {
          const name = url === "" ? "index" : url;
          const file = await fs.readFile(`./${name}.html`, "utf-8");
          res.end(file);
        } else {
          const file = await fs.readFile(`./404.html`, "utf-8");
          res.end(file);
        }
      } else {
        res.setHeader("Content-Type", "text/css");
        const file = await fs.readFile("./style.css");
        res.end(file);
      }
    })
    .listen(3000, () => {
      console.log("Connected.");
    });
};

try {
  script();
} catch (e) {
  console.log("The details of the pages weren't found!");
}
