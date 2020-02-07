import { Request, Response, NextFunction } from 'express'
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core'
import { pesquisarUsuarioPorId } from '../services/usuario.service';

@Controller('api/usuario')
export class UsuarioController {

    @Get(':id')
    getUsuarioPorID(req: Request, res: Response): any {
        pesquisarUsuarioPorId(Number(req.params['id']))
        .then(u => res.status(200).json(u))
        .catch(e => res.status(500).json(e));
    }
}