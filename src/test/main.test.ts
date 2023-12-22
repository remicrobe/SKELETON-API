import { Index } from '../index';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha'

chai.use(chaiHttp);
chai.should();

before( done => {
      Index.app.on( "ready", ()=> {
        done()
      })
});

describe('Test du serveur', function() {
    it('doit retourner 200 pour la route /', function(done) {
      chai.request(Index.app)
        .get('/')
        .end((err, res)=>{
          res.should.have.status(200);
          done();
        });
    });
  });
  
  let competitionsCreated;

  describe('Test de création d\'une compétition', function() {
    it('Doit retourner la compéition créé/', function(done) {
      chai.request(Index.app)
        .post('/competitions/create/chai-test')
        .end(function(err, res){
          res.should.have.status(200);
          res.body.should.be.an('object')
          res.body.should.have.an.property('name')
          res.body.should.have.an.property('id')

          competitionsCreated = res.body
          done();
        });
    });
  });

  describe('Test de la récupération des compétitions', function() {
    it('Doit retourner les compétitions dont celle créé', function(done) {
      chai.request(Index.app)
        .get('/competitions/')
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.an('array');
            let test = (res.body.find((compet)=> compet.id === competitionsCreated.id))
            test.should.be.an('object');
            done();
        });
    });
  });

  describe('Test de la création des groupes', function() {
    it('Doit créér les groupes de la compétition créé', function(done) {
      chai.request(Index.app)
        .post('/groups/create-groups/' + competitionsCreated.id)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.an('array');
            // Vérification que les 6 groupes sont bien créé (A,B,C,D,E,F)
            res.body.should.have.lengthOf(6)
            done();
        });
    });
  });

const levels = [99, 16, 4, 2, 1];
const expectedLengths = [16, 8, 4, 2, 1];

// La route generate retourne les équipes gagnantes.
describe('Test de la simulation de la compétition', function() {
  levels.forEach((level, index) => {
    it(`Doit simuler le niveau ${level} et retourner un tableau de longueur ${expectedLengths[index]}`, function(done) {
      chai.request(Index.app)
        .post(`/simulate/generate/${competitionsCreated.id}/${level}`)
        .end(function(err, res){
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.should.have.lengthOf(expectedLengths[index]);
          if(level === 1) {
            console.log('Le gagnant est : ', res.body[0].info.name, ' lors du match ', res.body[0].match.homeTeam.name, '-',res.body[0].match.awayTeam.name)
          }
          done();
        });
    });
  });
});

describe('Test de la suppression de la compétition', function() {
    it('Doit supprimer la compétition créée', function(done) {
      chai.request(Index.app)
        .delete(`/competitions/${competitionsCreated.id}`)
        .end(function(err, res){
          res.should.have.status(200);
          done();
        });
    });
  });
  
