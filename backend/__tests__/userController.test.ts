import request from 'supertest';
import app from '../src/server';
import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';

//@todo ajouter un test pour la modification des données utilisateur
describe("User modification", () => {
    it("should modify a user username", async () => {
        const user = {
            username: "testUser1",
            email: "email@test.com",
            password: "password"
        }
    });
});

//@todo ajouter un test pour la suppression d'un utilisateur
describe("User deletetion", () => {
    it("should delete a user", async () => {
        const user = {
            username: "testUser1",
            email: "email@test.com",
            password: "password"
        }
    });
});