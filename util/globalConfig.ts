import { AspectRatio, Nomination, Nominee } from '@prisma/client';
export const globalConfig = {
    defaultNominationsPageSize: 60,
    dummyNominee: {
        comment: '',
        name: 'Sample Text',
        position: 1,
        extras:{},
    } as Nominee,
    dummyNomination: {
        aspectRatio:AspectRatio.TALL,
        description:'',
        extras:[],
        name:'Sample Text',
        popularity:0,
        priority:0,
        tags:[],
    } as unknown as Nomination,
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
        'Art',
        'Photo',
        'Love Live',
        'osu!',
    ],
    nominationExtraTypes:[
        'Raw Link',
        'Spotify',
        'YouTube',
    ]
}