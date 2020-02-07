import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn({ name: 'id' })
    private _id!: number;

    @Column({ name: 'nome' })
    private _nome!: string;

    get id(): number {
        return this._id;
    }

    set id(v: number) {
        this._id = v;
    }

    get nome(): string {
        return this._nome;
    }

    set nome(v: string) {
        this._nome = v;
    }
}