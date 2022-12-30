import { Nomination, User, Nominee } from '@prisma/client';

export interface NominationFull extends Nomination {
    author: User
    Nominee?: Nominee[]
}

export interface NominationWithAuthor extends Nomination {
    author: User
    Nominee?: Nominee[]
}
export interface NomineeWithAuthor extends Nominee {
    author: User
}