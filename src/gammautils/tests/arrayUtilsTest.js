'use strict';

var util = require('util'),
    arrayUtils = require('../lib/arrayUtils');

module.exports = {
    '__name': { '': function(test) { test.done(); } },
    '__description': { '': function(test) { test.done(); } },

    'every': {
        'Returns true if every elemnt in the given array is truthy': function(test) {
            var array = [
                true,
                'gammasoft',
                new Date(),
                1
            ];

            test.equal(arrayUtils.every(array), true);
            test.done();
        },

        'Returns false if at least one element is not truthy 1': function(test) {
            var array = [
                true,
                'gammasoft',
                new Date(),
                0
            ];

            test.equal(arrayUtils.every(array), false);
            test.done();
        },

        'Returns false if at least one element is not truthy 2': function(test) {
            var array = [
                true,
                'gammasoft',
                new Date(),
                false
            ];

            test.equal(arrayUtils.every(array), false);
            test.done();
        },

        'Returns false if at least one element is not truthy 3': function(test) {
            var array = [
                true,
                'gammasoft',
                new Date(),
                ''
            ];

            test.equal(arrayUtils.every(array), false);
            test.done();
        }
    },

    'sort': {
        'default sorting is ascending': function(test) {
            var array = [2, 3, 5, 1, 6];

            test.deepEqual(arrayUtils.sort(array), [1, 2, 3, 5, 6]);
            test.done();
        },

        'can sort numbers ascending': function(test) {
            var array = [2, 3, 5, 1, 6];

            test.deepEqual(arrayUtils.sort(array, { order: 'asc' }), [1, 2, 3, 5, 6]);
            test.done();
        },

        'can sort numbers descending': function(test) {
            var array = [2, 3, 5, 1, 6];

            test.deepEqual(arrayUtils.sort(array, { order: 'desc' }), [6, 5, 3, 2, 1]);
            test.done();
        },

        'can sort strings ascending': function(test) {
            var array = ['a', 'd', 'b', 'e', 'c'];

            test.deepEqual(arrayUtils.sort(array, { order: 'asc' }), ['a', 'b', 'c', 'd', 'e']);
            test.done();
        },

        'can sort strings descending': function(test) {
            var array = ['a', 'd', 'b', 'e', 'c'];

            test.deepEqual(arrayUtils.sort(array, { order: 'desc' }), ['e', 'd', 'c', 'b', 'a']);
            test.done();
        },

        'can sort date ascending': function(test) {
            var unordered = [new Date(2014, 0, 15), new Date(2014, 0, 10), new Date(2014, 0, 3), new Date(2014, 0, 5)],
                ordered = [new Date(2014, 0, 3), new Date(2014, 0, 5), new Date(2014, 0, 10), new Date(2014, 0, 15)];

            test.expect(4);
            arrayUtils.sort(unordered, { order: 'asc' }).forEach(function(item, index) {
                test.equal(item.valueOf(), ordered[index].valueOf());
            });

            test.done();
        },

        'can sort date descending': function(test) {
            var unordered = [new Date(2014, 0, 15), new Date(2014, 0, 10), new Date(2014, 0, 3), new Date(2014, 0, 5)],
                ordered = [new Date(2014, 0, 15), new Date(2014, 0, 10), new Date(2014, 0, 5), new Date(2014, 0, 3)];

            test.expect(4);
            arrayUtils.sort(unordered, { order: 'desc' }).forEach(function(item, index) {
                test.equal(item.valueOf(), ordered[index].valueOf());
            });

            test.done();
        },

        'can sort ascending from a property': function(test) {
            var unordered = [{
                    value: 4
                }, {
                    value: 2
                },{
                    value: 1
                }, {
                    value: 5
                }],
                ordered = [{
                    value: 1
                }, {
                    value: 2
                },{
                    value: 4
                }, {
                    value: 5
                }];

            test.deepEqual(arrayUtils.sort(unordered, { order: 'asc', property: 'value' }), ordered);

            test.done();
        },

        'can sort desceding from a property': function(test) {
            var unordered = [{
                    value: 'a'
                }, {
                    value: 'b'
                },{
                    value: 'd'
                }, {
                    value: 'c'
                }],
                ordered = [{
                    value: 'd'
                }, {
                    value: 'c'
                },{
                    value: 'b'
                }, {
                    value: 'a'
                }];

            test.deepEqual(arrayUtils.sort(unordered, { order: 'desc', property: 'value' }), ordered);

            test.done();
        },

        'can sort based on nested objects': function(test) {
            var unordered = [{
                    person: {
                        name: 'a'
                    }
                }, {
                    person: {
                        name: 'b'
                    }
                },{
                    person: {
                        name: 'd'
                    }
                }, {
                    person: {
                        name: 'e'
                    }
                }],
                ordered = [{
                    person: {
                        name: 'e'
                    }
                }, {
                    person: {
                        name: 'd'
                    }
                },{
                    person: {
                        name: 'b'
                    }
                }, {
                    person: {
                        name: 'a'
                    }
                }];

            test.deepEqual(arrayUtils.sort(unordered, { order: 'desc', property: 'person.name' }), ordered);

            test.done();
        },

        'can sort from a shallow property': function(test) {
            var unordered = [{
                    'person.name': 'a'
                }, {
                    'person.name': 'b'
                },{
                    'person.name': 'd'
                }, {
                    'person.name': 'e'
                }],
                ordered = [{
                    'person.name': 'e'
                }, {
                    'person.name': 'd'
                },{
                    'person.name': 'b'
                }, {
                    'person.name': 'a'
                }];

            test.deepEqual(arrayUtils.sort(unordered, { order: 'desc', property: 'person.name', deep: false }), ordered);

            test.done();
        },

        'can pass transformation function (string example)': function(test) {
            var unsorted = ['a', 'B', 'C', 'b', 'c', 'A'],
            sorted = ['a', 'A', 'B', 'b', 'C', 'c'],
            transform = function(value) {
                return value.toLowerCase();
            };

            test.deepEqual(arrayUtils.sort(unsorted, { transform: transform }), sorted);

            test.done();
        },

        'can pass transformation function (array example)': function(test) {
            var unsorted = [[1, 2], [1], [1, 2, 3]],
                sorted = [[1, 2, 3], [1, 2], [1]],
                transform = function(value) {
                    return value.length;
                };

            test.deepEqual(arrayUtils.sort(unsorted, { order: 'desc', transform: transform }), sorted);

            test.done();
        },
    },

    'smaller': {
        'return expected results': function(test) {
            var array = [3, 4, 2, 9, 1];

            test.equal(arrayUtils.smaller(array), 1);
            test.done();
        },

        'can convert form string': function(test) {
            var array = ['3', '4', '2', '9', '1'];

            test.equal(arrayUtils.smaller(array), 1);
            test.done();
        },

        'can get value from property': function(test) {
            var array = [{
                value: 4
            }, {
                value: 1
            }, {
                value: 10
            }];

            test.equal(arrayUtils.smaller(array, 'value'), 1); //TODO: return the whole object, not only its value
            test.done();
        },

        'can get value from property when property is a date': function(test) {
            var smaller = new Date(2014, 1, 1);

            var array = [{
                time: smaller
            }, {
                time: new Date(2014, 1, 2)
            }, {
                time: new Date(2014, 1, 3)
            }];

            test.equal(arrayUtils.smaller(array, 'time'), smaller.valueOf()); //TODO: return the whole object, not only its value
            test.done();
        }
    },
    'bigger': {
        'return expected results': function(test) {
            var array = [3, 4, 2, 9, 1];

            test.equal(arrayUtils.bigger(array), 9);
            test.done();
        },

        'can convert form string': function(test) {
            var array = ['3', '4', '2', '9', '1'];

            test.equal(arrayUtils.bigger(array), 9);
            test.done();
        },

        'can get value from property': function(test) {
            var array = [{
                value: 4
            }, {
                value: 1
            }, {
                value: 10
            }];

            test.equal(arrayUtils.bigger(array, 'value'), 10); //TODO: return the whole object, not only its value
            test.done();
        },

        'can get value from property when property is a date': function(test) {
            var bigger = new Date(2014, 1, 3);

            var array = [{
                time: new Date(2014, 1, 1)
            }, {
                time: new Date(2014, 1, 2)
            }, {
                time: bigger
            }];

            test.equal(arrayUtils.bigger(array, 'time'), bigger.valueOf()); //TODO: return the whole object, not only its value
            test.done();
        }
    },
    'pushIfNotAlready': {
        'Tests main functionality': function(test) {
            var array = [1, 2, 3];

            arrayUtils.pushIfNotAlready(array, 4);
            test.equal(array.indexOf(4), 3);

            arrayUtils.pushIfNotAlready(array, 4);
            test.equal(array.length, 4);
            test.equal(array.indexOf(4), 3);

            test.done();
        },
        'Returns the array': function(test) {
            test.ok(Array.isArray(arrayUtils.pushIfNotAlready([], 1)));

            test.done();
        }
    },
    'average': {
        'Tests main functinality': function(test) {
            test.equal(arrayUtils.average([1, 1, 1]), 1);
            test.equal(arrayUtils.average([1, 2, 3]), 2);
            test.equal(arrayUtils.average([10, 20, 30]), 20);
            test.equal(arrayUtils.average([1]), 1);
            test.equal(arrayUtils.average([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), 5.5);

            test.done();
        }
    },
    'Group': {
        'Adding elements increases group length properly': function(test) {
            var group = new arrayUtils.Group();

            group.add(1, 'Gammasoft');
            group.add(2, 'Desenvolvimento');
            group.add(2, 'de');
            group.add(2, 'Software');
            group.add(3, 'Ltda');

            test.equal(group.length, 3);

            test.done();
        },

        'Removing elements decrements length properly': function(test) {
            var group = new arrayUtils.Group();

            group.add(1, 'Gammasoft');
            group.add(2, 'Desenvolvimento');
            group.add(2, 'de');
            group.add(2, 'Software');
            group.add(3, 'Ltda');

            group.remove(2);

            test.equal(group.length, 2);

            test.done();
        },

        'Creates array when in "array" mode. Default mode is array mode.': function(test) {
            var group = new arrayUtils.Group();

            group.add('group1', 'Test');
            test.ok(util.isArray(group.get('group1')));
            test.done();
        },

        'Properly push items to group when in array mode': function(test) {
            var group = new arrayUtils.Group();

            group.add('group1', 'Test');
            test.equal(group.get('group1').length, 1);
            group.add('group1', 'is');
            test.equal(group.get('group1').length, 2);
            group.add('group1', 'gonna');
            test.equal(group.get('group1').length, 3);
            group.add('group1', 'pass');
            test.equal(group.get('group1').length, 4);

            test.done();
        },

        'Attach variable when in single mode.': function(test) {
            var group = new arrayUtils.Group('single');

            group.add('group1', 'Test');
            group.add('group2', 1);

            test.ok(!util.isArray(group.get('group1')));

            test.equal(group.get('group1').value, 'Test');
            test.equal(group.get('group2').value, 1);

            test.done();
        },

        'Can retrieve raw data object in single mode': function(test) {
            var group = new arrayUtils.Group('single');

            group.add('group1', 'Test', 'Meta');
            group.add('group2', 1, 'Some more meta');

            test.deepEqual(group.raw(), {
                'group1': {
                    value: 'Test',
                    meta: 'Meta'
                },
                'group2': {
                    value: 1,
                    meta: 'Some more meta'
                }
            });

            test.done();
        },

        'Can retrieve raw data object in array mode': function(test) {
            var group = new arrayUtils.Group();

            group.add('group1', 'Test', 'Meta');
            group.add('group1', 'Test2', 'Meta2');

            group.add('group2', 1, 'Some more meta');
            group.add('group2', 2, 'SOME MORE META 2');

            test.deepEqual(group.raw(), {
                'group1': [{
                    value: 'Test',
                    meta: 'Meta'
                }, {
                    value: 'Test2',
                    meta: 'Meta2'
                }],

                'group2': [{
                    value: 1,
                    meta: 'Some more meta'
                }, {
                    value: 2,
                    meta: 'SOME MORE META 2'
                }]
            });

            test.done();
        },

        'Get method return the right key': function(test) {
            var group = new arrayUtils.Group();

            group.add('group1', 'Test', 'Meta');
            group.add('group1', 'Test2', 'Meta2');

            group.add('group2', 1, 'Some more meta');
            group.add('group2', 2, 'SOME MORE META 2');

            test.deepEqual(group.get('group1'), [{
                    value: 'Test',
                    meta: 'Meta'
                }, {
                    value: 'Test2',
                    meta: 'Meta2'
                }]);

            test.done();
        },

        'ForEach iterates properly through the keys': function(test) {
            var group = new arrayUtils.Group();

            group.add(1, 'This', 'Meta');
            group.add(1, 'is', 'Meta');
            group.add(1, 'a', 'Meta');
            group.add(1, 'test', 'Meta');

            group.add(2, 'Another', 'Meta');
            group.add(2, 'group', 'Meta');
            group.add(2, 'was', 'Meta');
            group.add(2, 'added', 'Meta');

            test.expect(14);

            group.forEach(function(group, item) {
                test.ok(['1', '2'].indexOf(group) !== -1);
                test.ok(Array.isArray(item));
                test.ok(item.length === 4);
            });

            group.get(1).forEach(function(item) {
                test.ok(typeof item !== 'undefined');
            });

            group.get(2).forEach(function(item) {
                test.ok(typeof item !== 'undefined');
            });

            test.done();
        },

        'AddIfNone works as expected': function(test) {
            var group = new arrayUtils.Group('single');

            group.addIfNone(1, 'Test');
            test.equal(group.get(1).value, 'Test');

            group.addIfNone(1, 'Another');
            test.equal(group.get(1).value, 'Test');
            test.equal(group.length, 1);

            var group2 = new arrayUtils.Group();

            group2.addIfNone(1, 'Test');
            test.equal(group2.get(1).length, 1);

            group2.addIfNone(1, 'Another');
            test.equal(group2.get(1).length, 1);
            test.equal(group2.length, 1);

            test.done();
        }

    },

    'shuffle': {
        'Shuffling an array changes the order of its items': function(test) {
            var initial = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

            test.notDeepEqual(arrayUtils.shuffle(initial));
            test.done();
        }
    },
    'groupBySync': {
        'Check that items are properly grouped': function(test) {
            var items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

            function groupingFunction(item) {
                return item % 2 ? 'odd' : 'even';
            }

            test.deepEqual(arrayUtils.groupBySync(items, groupingFunction), {
                odd: [1, 3, 5, 7, 9],
                even: [0, 2, 4, 6, 8, 10]
            });

            test.done();
        },

        'Check that items are properly placed within an array and grouped as expected': function(test) {
            var items = ['Gammasoft', 'Renato', 'Gama', 'Node'];

            function groupingFunction(item) {
                var group;

                if(item.length > 8) {
                    group = 'length more than 8 characters';
                } else if(item.length >= 5 && item.length <= 8) {
                    group = 'length between 5 and 8 characters';
                } else if(item.length > 0 && item.length <= 4){
                    group = 'length between 1 and 4 characters';
                } else {
                    group = 'length equals 0';
                }

                return group;
            }

            function toArray(group, items) {
                return {
                    group: group,
                    items: items,
                    length: items.length
                };
            }

            var groupedItems = arrayUtils.groupBySync(items, groupingFunction, toArray),
                expected = [{
                    group: 'length more than 8 characters',
                    items: ['Gammasoft'],
                    length: 1
                }, {
                    group: 'length between 5 and 8 characters',
                    items: ['Renato'],
                    length: 1
                }, {
                    group: 'length between 1 and 4 characters',
                    items: ['Gama', 'Node'],
                    length: 2
                }];

            test.ok(Array.isArray(groupedItems));
            test.deepEqual(groupedItems, expected);
            test.done();
        }
    },
    'groupBy': {
        'Check that items are properly grouped': function(test) {
            var items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

            function groupingFunction(item, cb) {
                return cb(null, item % 2 ? 'odd' : 'even');
            }

            arrayUtils.groupBy(items, groupingFunction, function(err, groupedItems) {
                test.ifError(err);
                test.deepEqual(groupedItems, {
                    odd: [1, 3, 5, 7, 9],
                    even: [0, 2, 4, 6, 8, 10]
                });
                test.done();
            });
        },

        'Check that items are properly placed within an array and grouped as expected': function(test) {
            var items = ['Gammasoft', 'Renato', 'Gama', 'Node'];

            function groupingFunction(item, cb) {
                var group;

                if(item.length > 8) {
                    group = 'length more than 8 characters';
                } else if(item.length >= 5 && item.length <= 8) {
                    group = 'length between 5 and 8 characters';
                } else if(item.length > 0 && item.length <= 4){
                    group = 'length between 1 and 4 characters';
                } else {
                    group = 'length equals 0';
                }

                return cb(null, group);
            }

            function toArray(group, items) {
                return {
                    group: group,
                    items: items,
                    length: items.length
                };
            }

            arrayUtils.groupBy(items, groupingFunction, toArray, function(err, groupedItems) {
                test.ifError(err);
                test.ok(Array.isArray(groupedItems));

                var expected = [{
                    group: 'length more than 8 characters',
                    items: ['Gammasoft'],
                    length: 1
                }, {
                    group: 'length between 5 and 8 characters',
                    items: ['Renato'],
                    length: 1
                }, {
                    group: 'length between 1 and 4 characters',
                    items: ['Gama', 'Node'],
                    length: 2
                }];

                test.deepEqual(groupedItems, expected);
                test.done();
            });
        }
    },

    'toUpperCase': {
        'Verify all items are in upper case': function(test) {
            var data = ['this', 'is', 42, 'a', 'test'];

            data = arrayUtils.toUpperCase(data);

            test.deepEqual(data, ['THIS', 'IS', 42, 'A', 'TEST']);
            test.done();
        }
    },

    'toLowerCase': {
        'Verify all items are in lower case': function(test) {
            var data = ['THIS', 'IS', 42, 'A', 'TEST'];

            data = arrayUtils.toLowerCase(data);

            test.deepEqual(data, ['this', 'is', 42, 'a', 'test']);
            test.done();
        }
    },

    'getRandomItem': {
        'Item returned is within the original array': function(test){
            var array = [1, 2, 3, 4];
            test.ok(array.indexOf(arrayUtils.getRandomItem(array)) !== -1);
            test.ok(array.indexOf(arrayUtils.getRandomItem(array)) !== -1);
            test.ok(array.indexOf(arrayUtils.getRandomItem(array)) !== -1);
            test.ok(array.indexOf(arrayUtils.getRandomItem(array)) !== -1);

            var array2 = ['Fulano', 'Ciclano', 'Beltrano'];
            test.ok(array2.indexOf(arrayUtils.getRandomItem(array2)) !== -1);
            test.ok(array2.indexOf(arrayUtils.getRandomItem(array2)) !== -1);
            test.ok(array2.indexOf(arrayUtils.getRandomItem(array2)) !== -1);

            test.done();
        }
    },

    'movingAverage': {
        'Testing with length 1 should return same array': function(test){
            var array = [1, 2, 3, 4];

            test.deepEqual([1, 2, 3, 4], arrayUtils.movingAverage(array, 1));
            test.done();
        },

        'Testing with length 2': function(test){
            var array = [1, 2, 3, 4];

            test.deepEqual([1.5, 2.5, 3.5], arrayUtils.movingAverage(array, 2));
            test.done();
        },

        'Testing with length 3': function(test){
            var array = [1, 2, 3, 4];

            test.deepEqual([2, 3], arrayUtils.movingAverage(array, 3));
            test.done();
        },

        'Testing with length 4': function(test){
            var array = [1, 2, 3, 4];

            test.deepEqual([2.5], arrayUtils.movingAverage(array, 4));
            test.done();
        },

        'Testing with bigger length than array\'s length will return empty array': function(test){
            var array = [1, 2, 3, 4];

            test.deepEqual([], arrayUtils.movingAverage(array, 5));
            test.done();
        },

        'Will work with numeric string arrays': function(test){
            var array = ['1', '2', '3', '4'];

            test.deepEqual([2, 3], arrayUtils.movingAverage(array, 3));
            test.deepEqual([2.5], arrayUtils.movingAverage(array, 4));
            test.done();
        },
    },


    'multiply': {
        'Multiply correct when elements are numbers': function(test){
            var array = [1, 2, 3];
            test.equal(6, arrayUtils.multiply(array));
            test.done();
        },

        'Multiply correctly when elements are string numbers': function(test){
            var array = ['1', '2', '3'];
            test.equal(6, arrayUtils.multiply(array));
            test.done();
        },

        'Multiply correctly when elements are objects': function(test){
            var array = [{ price: 2 }, { price: 3 }, { price: 4}];
            test.equal(arrayUtils.multiply(array, 'price'), 24);
            test.done();
        }
    },

    'sum': {
        'Sums correctly when elements are objects': function(test){
            var array = [{ price: 12.50 }, { price: 0.50 }, { price: 7}];
            test.equal(20, arrayUtils.sum(array, 'price'));
            test.done();
        },

        'Sums correctly when there is only one objects': function(test){
            var array = [{ price: 7}];
            test.equal(arrayUtils.sum(array, 'price'), 7);
            test.done();
        },

        'Sums correctly when elements are number strings into objects': function(test){
            var array = [{ price: '12.50' }, { price: '0.50' }, { price: '7' }];
            test.equal(20, arrayUtils.sum(array, 'price'));
            test.done();
        },

        'Sums correctly when elements are numbers': function(test){
            var array = [1, 2, 3, 4];
            test.equal(10, arrayUtils.sum(array));
            test.done();
        },

        'Sums correctly when elements are string numbers': function(test){
            var array = ['1', '2', '3', '4'];
            test.equal(10, arrayUtils.sum(array));
            test.done();
        },

        'Join strings if content of at least one element is a not a number string': function(test){
            var array;

            array = ['G', 'a', 'm', 'm', 'a', 's', 'o', 'f', 't'];
            test.equal('Gammasoft', arrayUtils.sum(array));

            array = [1, '2', 'Gammasoft', 3, 4, '5'];
            test.equal('3Gammasoft345', arrayUtils.sum(array));

            test.done();
        },

        'Throws exception if property parameter is not present in at least on array element': function(test){
            var array = [{price: 1}, {}];
            test.throws(function(){
                arrayUtils.sum(array);
            });

            test.done();
        }
    },

    'removeAt': {
        'Correctly removes value from array at given index': function(test){
            var array = ['foo', 'bar'];
            arrayUtils.removeAt(array, 1);

            test.deepEqual(array, ['foo']);
            test.done();
        },

        'Correctly removes value from array at given index 2': function(test){
            var array = ['foo', 'bar'];
            arrayUtils.removeAt(array, 0);

            test.deepEqual(array, ['bar']);
            test.done();
        },

        'Does not throw if index is out of bounds': function(test){
            var array = ['foo', 'bar'];

            test.doesNotThrow(function(){
                arrayUtils.removeAt(array, 5);
                test.deepEqual(array, ['foo', 'bar']);
            });

            test.done();
        }
    },

    'removeLast': {
        'Does not throw if array is empty': function(test){
            test.doesNotThrow(function(){
                arrayUtils.removeLast([]);
            });

            test.done();
        },

        'Correctly remove at the last index': function(test){
            var array = ['foo', 'bar'];
            arrayUtils.removeLast(array);

            test.deepEqual(array, ['foo']);

            test.done();
        }
    },

    'insertAt': {
        'Correctly inserts value at desired position': function(test){
            var array = ['foo', 'bar'];
            arrayUtils.insertAt(array, 1, 'bang');

            test.deepEqual(array, ['foo', 'bang', 'bar']);
            test.done();
        }
    },

    'series': {
        'Check that array is created in correct ascending order': function(test){
            test.deepEqual(arrayUtils.series(0, 10), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            test.deepEqual(arrayUtils.series(-2, 2), [-2, -1, 0, 1, 2]);
            test.deepEqual(arrayUtils.series(-10, -5), [-10, -9, -8, -7, -6, -5]);

            test.done();
        },

        'Check that array is created in correct descending order': function(test){
            test.deepEqual(arrayUtils.series(10, 0), [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
            test.deepEqual(arrayUtils.series(2, -2), [2, 1, 0, -1, -2]);
            test.deepEqual(arrayUtils.series(-5, -10), [-5, -6, -7, -8, -9, -10]);

            test.done();
        }
    },

    'pretty': {
        'Check that it produces the right result with default value': function(test){
            test.equal('Foo, Bar e FooBar', arrayUtils.pretty(['Foo', 'Bar', 'FooBar']));

            test.done();
        },

        'Check that it produces the right result with not default value': function(test){
            test.equal('Foo, Bar and FooBar', arrayUtils.pretty(['Foo', 'Bar', 'FooBar'], 'and'));

            test.done();
        }
    },

    'clean': {
        'Check that right values are removed from array': function(test){
            test.deepEqual(['foo', 'bar'], arrayUtils.clean(['foo', undefined, undefined, 'bar', undefined], undefined));
            test.deepEqual(['this', 2, 'is', 'it'], arrayUtils.clean([false, 'this', 2, 'is', false, 'it'], false));

            test.done();
        }
    },

    'intersection': {
        'This function allows you to filter content that are in both arrays at the same time': function(test){
            var a = [1, 2, 3, 4];
            var b = [2, 3, 4, 5];

            test.deepEqual(arrayUtils.intersection(b, a), [2, 3, 4]);
            test.done();
        },

        'Results are the same no matter the order of the parameters': function(test){
            var a = [1, 2, 3, 4];
            var b = [2, 3, 4, 5];

            test.deepEqual(arrayUtils.intersection(a, b), arrayUtils.intersection(b, a));
            test.done();
        },

        'You can pass a custom filtering function': function(test) {
            var allowedRoles = [{
                name: 'admin'
            }, {
                name: 'visitor'
            }];

            var userRoles = [{
                role: 'admin'
            }]

            function customFilter(allowedRole, userRole) {
                return allowedRole.name === userRole.role;
            }

            test.deepEqual(arrayUtils.intersection(allowedRoles, userRoles, customFilter), [{
                name: 'admin'
            }]);

            test.done();
        },

        'When you pass a custom comparator then the order matters. It will return the the element from the first array.': function(test) {
            var allowedRoles = [{
                name: 'admin'
            }, {
                name: 'visitor'
            }];

            var userRoles = [{
                role: 'admin'
            }]

            function customFilter(userRole, allowedRole) {
                return userRole.role === allowedRole.name;
            }

            //Compare to the example above
            test.deepEqual(arrayUtils.intersection(userRoles, allowedRoles, customFilter), [{
                role: 'admin'
            }]);

            test.done();
        },
    },

    'toDictionary': {
        'Check that it works': function(test){
            var array = [{id: 1, name: 'foo'}, {id: 2, name: 'bar'}];
            test.deepEqual(arrayUtils.toDictionary(array, 'id'), {'1': {id: 1, name: 'foo'}, '2': {id: 2, name: 'bar'}});

            test.done();
        },

        'Check that object gets overwritten if there is another array element with same value for the given key': function(test){
            var array = [{id: 1, name: 'foo'}, {id: 2, name: 'bar'}, {id: 2, name: 'fuark'}];
            test.deepEqual(arrayUtils.toDictionary(array, 'id'), {'1': {id: 1, name: 'foo'}, '2': {id: 2, name: 'fuark'}});

            test.done();
        },
    },

    'chop': {
        'Check that result includes elements when `array.length % quantity !== 0`': function(test){
            var array = [1, 2, 3, 4, 5];
            test.deepEqual([[1, 2, 3, 4], [5]], arrayUtils.chop(array, 4));
            test.deepEqual([[1, 2, 3], [4, 5]], arrayUtils.chop(array, 3));
            test.deepEqual([[1, 2], [3, 4], [5]], arrayUtils.chop(array, 2));
            test.deepEqual([[1], [2], [3], [4], [5]], arrayUtils.chop(array, 1));
            test.done();
        }
    }
};
