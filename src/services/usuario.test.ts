import {pesquisarUsuarioPorId} from './usuario.service'
import { Usuario } from '../models/usuario.model'
import { initBD } from '../config/bd';

jest.setTimeout(100000)

beforeAll(done => {
    return initBD();
});

test('buscar usuário por id', () => {
    return pesquisarUsuarioPorId(1)
    .then( u => {
        expect(u).toBeInstanceOf(Usuario);
    })
})
