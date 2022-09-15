export default function Routes(app) {
  /** Toutes les routes affichent des informaitons */
  this.app.all("/*", function(req, res, next){
    const date = (new Date()).toISOString();
    console.log([date, req.method, req.url, req.headers["user-agent"], req.ip].join("\t"));
    next();
  });

  /** Route de base sert application React */
  if (process.env.ENV === "production") {
    const serverFolder = process.cwd();
    this.app.use(express.static(`${serverFolder}/../application/build`));
    this.app.get('/', function(req, res) {
        res.sendFile(`${serverFolder}/../application/build/index.html`);
    });
  }

  // Exemples de routes
  // app.get("/test/", (req, res) => res.json({ isok: true }));
  // app.post("/my-test/", (req, res) => MyTest(req, res));
}