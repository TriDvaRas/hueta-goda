import { AspectRatio, Nomination, Nominee } from '@prisma/client';
import _ from 'lodash';
export const globalConfig = {
    defaultNominationsPageSize: 120,
    dummyNominee: {
        comment: '',
        name: '',
        position: 1,
        extras: {},
    } as Nominee,
    dummyNomination: {
        aspectRatio: AspectRatio.TALL,
        description: 'Sample Text',
        extras: [],
        name: '',
        popularity: 0,
        priority: 0,
        tags: [],
    } as unknown as Nomination,
    nominationTags: _.sortBy([
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
        'Rice Friends',
        'Music',
        'Cinema',
        'Best',
        'Worst',
        'Starlight',
    ]),
    nominationExtraTypes: [
        'Raw Link',
        'Spotify',
        'YouTube',
    ]
}