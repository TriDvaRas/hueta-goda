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
export interface UserWithStats extends User {
    nominationsFilled: number
    nomineesAdded: number
}
export interface UserWithNominationsFull extends User {
    nominations: NominationFull[] 
}

