db.movies.insertMany([
    {
        imdbId: 'tt1160419',
        title: 'Dune: Part One',
        year: 2021,
        duration: 155,
        director: {
            imdbId: 'nm0898288',
            name: 'Denis Villeneuve'
        },
        actors: [
            {
                imdbId: 'nm3154303',
                name: 'Timothée Chalamet',
                role: 'Paul Atreides'
            },
            {
                imdId: 'nm3918035',
                name: 'Zendaya',
                role: 'Chani'
            },
            {
                imdId: 'nm0272581',
                name: 'Rebecca Ferguson',
                role: 'Jessica'
            }
        ]
    },
    {
        imdbId: 'tt1160419',
        title: 'Dune: Part Two',
        year: 2024,
        duration: 166,
        director: {
            imdbId: 'nm0898288',
            name: 'Denis Villeneuve'
        },
        actors: [
            {
                imdbId: 'nm3154303',
                name: 'Timothée Chalamet',
                role: 'Paul Atreides'
            },
            {
                imdId: 'nm3918035',
                name: 'Zendaya',
                role: 'Chani'
            },
            {
                imdId: 'nm0272581',
                name: 'Rebecca Ferguson',
                role: 'Jessica'
            }
        ]
    },
    {
        imdbId: 'tt2381249',
        title: 'Mission: Impossible - Rogue Nation',
        year: 2024,
        duration: 166,
        director: {
            imdbId: 'nm0003160',
            name: 'Christopher McQuarrie'
        },
        actors: [
            {
                imdbId: 'nm0000129',
                name: 'Tom Cruise',
                role: 'Ethan Hunt'
            },
            {
                imdId: 'nm0272581',
                name: 'Rebecca Ferguson',
                role: 'Ilsa Faust'
            }
        ]
    },
])