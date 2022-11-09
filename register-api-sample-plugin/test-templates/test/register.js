const chai = require("chai");
const chaiHttp = require("chai-http");
// to initialize
const should = chai.should();

chai.use(chaiHttp);

// load the application
//require("../loader");

const server = require("../config/server");

const Register = require("../api/register/register");

const dbHandler = require('./db-handler');


require('../config/routes')(server);


describe("Register", () => {

  before((done)=>{
    dbHandler.connect();
    done();
  })

  after((done)=>{
    dbHandler.closeDatabase();
    done();
  })
  /**
   * Cleaning the database to prepare it for the tests
   */
  beforeEach((done) => {
    Register.deleteMany({}, (err) => {
      done(err);
    });
  });

  /**
   * Testing the /GET route
   */
  describe("GET /api/register", () => {
    it("it should GET all the registers", (done) => {
      chai
        .request(server)
        .get("/api/register")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  /**
   * Testing the /POST route
   */
  describe("POST /api/register", () => {
    it("it should add a new register", (done) => {
      const payload = {
        fullName: "Maximillian Arruda",
        mail: "dearrudam@gmail.com",
        phone: "1199228833",
        address: "Rua tralalá",
        number: 332,
        complement: "Apto 33",
      };

      chai
        .request(server)
        .post("/api/register")
        .send(payload)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("_id");
          for (const property in payload) {
            res.body.should.have.property(property).eql(payload[property]);
          }
          done(err);
        });
    });
  });

  /**
   * Testing the /GET/:id route
   */
  describe("GET /api/register/:id", () => {
    it("if should GET a register by the given id", (done) => {
      let newRegister = {
        fullName: "Maximillian Arruda",
        mail: "dearrudam@gmail.com",
        phone: "1199228833",
        address: "Rua tralalá",
        number: 332,
        complement: "Apto 33",
      };
      new Register(newRegister).save((err, register) => {
        chai
          .request(server)
          .get("/api/register/" + register._id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("_id").eql(register._id.toString());
            for (const property in newRegister) {
              res.body.should.have
                .property(property)
                .eql(newRegister[property]);
            }
            done(err);
          });
      });
    });
  });

  /**
   * Testing the /PUT route
   */
  describe("PUT /api/register/:id", () => {
    it("it should UPDATE a register given the id", (done) => {
      const maxRegister = {
        fullName: "Max",
        mail: "dearrudam@gmail.com",
        phone: "+55119933884499",
        address: "Rua Tralalá",
        number: 222,
        complement: "none",
      };
      new Register(maxRegister).save((err, persistedMaxRegister) => {
        chai
          .request(server)
          .put("/api/register/" + persistedMaxRegister._id)
          .send({
            ...maxRegister,
            fullName: "Maximillian Arruda",
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have
              .property("_id")
              .eql(persistedMaxRegister._id.toString());
            res.body.should.have.property("fullName").eql("Maximillian Arruda");
            done(err);
          });
      });
    });
  });

  /**
   * Testing the /DELETE route
   */
  describe("DELETE /api/register/:id", () => {
    it("it should DELETE the register by given the id", (done) => {
      // Given
      new Register({
        fullName: "Maximillian Arruda",
        mail: "dearrudam@gmail.com",
        address: "Rua tralalá",
        number: 222,
        complement: "N/C",
      }).save((err, register) => {
        // When
        chai
          .request(server)
          .delete("/api/register/" + register._id)
          .end((err, res) => {
            // Then
            Register.find({}, (err, data) => {
              chai.expect(data).be.a("array");
              chai.expect(data).to.have.lengthOf(0);
              done(err);
            });
          });
      });
    });
  });
});
