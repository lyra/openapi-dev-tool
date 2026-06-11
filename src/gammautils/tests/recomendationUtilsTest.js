'use strict';

var recomendationUtils = require('../lib/recomendationUtils'),
    critics = {
        'Lisa Rose': {
            'Lady In The Water': 2.5,
            'Snakes On A Plane': 3.5,
            'Just My Luck': 3,
            'Superman Returns': 3.5,
            'You, Me and Dupree': 2.5,
            'The Night Listener': 3
        },

        'Gene Seymor': {
            'Lady In The Water': 3,
            'Snakes On A Plane': 3.5,
            'Just My Luck': 1.5,
            'Superman Returns': 5,
            'You, Me and Dupree': 3.5,
            'The Night Listener': 3
        },

        'Michael Phillps': {
            'Lady In The Water': 2.5,
            'Snakes On A Plane': 3.0,
            'Superman Returns': 3.5,
            'The Night Listener': 4
        },

        'Claudia Puig': {
            'Snakes On A Plane': 3.5,
            'Just My Luck': 3,
            'Superman Returns': 4,
            'You, Me and Dupree': 2.5,
            'The Night Listener': 4.5
        },

        'Mick LaSalle': {
            'Lady In The Water': 3,
            'Snakes On A Plane': 4,
            'Just My Luck': 2,
            'Superman Returns': 3,
            'You, Me and Dupree': 2,
            'The Night Listener': 3
        },

        'Jack Matthews': {
            'Lady In The Water': 3,
            'Snakes On A Plane': 4,
            'Just My Luck': 2,
            'Superman Returns': 5,
            'You, Me and Dupree': 3.5,
            'The Night Listener': 3
        },

        'Toby': {
            'Snakes On A Plane': 4.5,
            'Superman Returns': 4,
            'You, Me and Dupree': 1
        }
    };

module.exports = {
    '__name': { '': function(test) { test.done(); } },
    '__description': { '': function(test) { test.done(); } },
    'similarityByPearsonCoefficient': {
        'Return expected results: ': function(test){
            test.equal(recomendationUtils.similarityByPearsonCoefficient(critics['Lisa Rose'], critics['Gene Seymor']), 0.39605901719066977);
            test.equal(recomendationUtils.similarityByPearsonCoefficient(critics['Lisa Rose'], critics['Lisa Rose']), 1);

            test.done();
        }
    },

    'similarityByEuclideanDistance': {
        'Checks that similarity is properly calculated using euclideanDistance': function(test){
            var similarity = recomendationUtils.similarityByEuclideanDistance(critics['Lisa Rose'], critics['Gene Seymor']);
            test.equal(similarity, 0.29429805508554946);

            test.done();
        },

        'similarityByEuclideanDistance: Checks that returns 1 for exatcly same ratings': function(test){
            var similarity = recomendationUtils.similarityByEuclideanDistance(critics['Lisa Rose'], critics['Lisa Rose']);
            test.equal(similarity, 1);

            test.done();
        }
    }
};