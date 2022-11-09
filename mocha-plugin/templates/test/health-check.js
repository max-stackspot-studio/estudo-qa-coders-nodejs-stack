const chai = require("chai");
const chaiHttp = require("chai-http");

// inicializar o chai
chai.should();

chai.use(chaiHttp);

const server = require("../config/server");

//configurar as rotas
require("../config/routes")(server);

describe("Health Check", () => {
  describe("GET /status", () => {
    it(`health-check deve estar OK qdo a aplicação estiver executando`, (done) => {
      chai
        .request(server)
        .get("/status")
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.eql("BACKEND is runner.");
          done(err);
        });
    });
  });
});
