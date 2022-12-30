import { Nomination, User, Nominee, NominationLike } from '@prisma/client';

export interface NominationFull extends Nomination {
    author: User
    Nominee?: Nominee[]
    NominationLike: NominationLike[]
}

export interface NominationWithAuthor extends Nomination {
    author: User
    Nominee?: Nominee[]
    NominationLike: NominationLike[]
}
export interface NomineeWithAuthor extends Nominee {
    author: User
}