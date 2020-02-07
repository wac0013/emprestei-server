import {Servidor} from '../main'
import supertest = require('supertest');
import { Application } from 'express';

var app: Application;

beforeAll(_ => {
    process.env.PORT = '6000';
    return Servidor.init().then(a => {
        app = a
    });
});

test('controller buscar usuário por id', _ => {
    return supertest(app)
        .get('/api/usuario/1')
        .then(r => {
            expect(r).toBeTruthy()
        })
})

