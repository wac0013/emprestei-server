import { Usuario } from "../models/usuario.model";
import { getRepository } from "typeorm";

export function criarUsuario(): Promise<Usuario> {
    return new Promise((sucesso, falha) => {
        let usuario = new Usuario();
        usuario.nome = "wellington"

        getRepository(Usuario)
        .save(usuario)
        .then(u => sucesso(u))
        .catch(e => falha(e));
    });
}

export function pesquisarUsuarioPorId(id: number): Promise<Usuario> {
    return new Promise((sucesso, falha) => {
        getRepository(Usuario)
        .findOne(id)
        .then(u => sucesso(u))
        .catch(e => falha(e));
    });
}