import { Nomination, User, Nominee } from '@prisma/client';

export interface NominationFull extends Nomination {
    author: User
    Nominee?: Nominee[]
}