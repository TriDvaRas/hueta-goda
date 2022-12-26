import { Nominee } from '@prisma/client';
export const globalConfig = {
    defaultNominationsPageSize: 60,
    dummyNominee: {
        comment: '',
        name: 'Sample Text',
        position: 1,
        extras:{},
    } as Nominee,
    nominationTags:[
        'Anime',
        'Content',
        'Classic',
        'Games',
        'Humanity',
        'Litterature',
        'Me, Myself and I',
        'RFBW',
        'Local',
        'Global',
        'Memes',
    ]
}