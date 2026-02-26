'use strict';

var objectUtils = require('../lib/objectUtils');

module.exports = {
    '__name': { '': function(test) { test.done(); } },
    '__description': { '': function(test) { test.done(); } },
    'noop': {
      'Is a funcation and returns `undefined` no matter what is passed in': function (test) {
        var noop = objectUtils.noop

        test.equal(noop(1), undefined)
        test.equal(noop('whatever'), undefined)
        test.equal(noop(/qwe/g), undefined)
        test.equal(typeof noop, 'function')
        test.done()
      }
    },
    'unflatten': {
        'Works properly': function(test) {
            var flat = {
                'user.name': 'renato',
                'user.age': 27,
                'user.vehiacle.name': 'Fiat',
                'user.vehiacle.color': 'Red',
                'user.vehiacle.fines.0.description': 'Speed limit',
                'user.vehiacle.fines.0.price': 300,
                'user.vehiacle.fines.1.description': 'Traffic light',
                'user.vehiacle.fines.1.price': 180,
                'product.0.name': 'apple',
                'product.0.price': 1.34,
                'product.0.origin.country': 'Brazil',
                'product.0.origin.state': 'Minas Gerais',
                'product.0.importedWhen.0.date': '01/01/2014',
                'product.0.importedWhen.0.freight': 230,
                'product.0.importedWhen.1.date': '01/15/2014',
                'product.0.importedWhen.1.freight': 233.23,
                'product.1.name': 'orange',
                'product.1.price': 2.08,
                'product.1.origin.country': 'Argentina',
                'product.1.origin.state': 'Mendoza',
            };

            test.deepEqual(objectUtils.unflatten(flat), {
                user: {
                    name: 'renato',
                    age: 27,
                    vehiacle: {
                        name: 'Fiat',
                        color: 'Red',
                        fines: [{
                            description: 'Speed limit',
                            price: 300
                        }, {
                            description: 'Traffic light',
                            price: 180
                        }]
                    }
                },
                product: [{
                    name: 'apple',
                    price: 1.34,
                    origin: {
                        country: 'Brazil',
                        state: 'Minas Gerais'
                    },
                    importedWhen: [{
                        date: '01/01/2014',
                        freight: 230
                    }, {
                        date: '01/15/2014',
                        freight: 233.23
                    }]
                }, {
                    name: 'orange',
                    price: 2.08,
                    origin: {
                        country: 'Argentina',
                        state: 'Mendoza'
                    }
                }]
            });
            test.done();
        },

        'Can use different separator': function(test) {

            var flat = {
                'user-name': 'renato',
                'user-age': 27,
                'user-vehiacle-name': 'Fiat',
                'user-vehiacle-color': 'Red',
                'user-vehiacle-fines-0-description': 'Speed limit',
                'user-vehiacle-fines-0-price': 300,
                'user-vehiacle-fines-1-description': 'Traffic light',
                'user-vehiacle-fines-1-price': 180,
                'product-0-name': 'apple',
                'product-0-price': 1.34,
                'product-0-origin-country': 'Brazil',
                'product-0-origin-state': 'Minas Gerais',
                'product-0-importedWhen-0-date': '01/01/2014',
                'product-0-importedWhen-0-freight': 230,
                'product-0-importedWhen-1-date': '01/15/2014',
                'product-0-importedWhen-1-freight': 233.23,
                'product-1-name': 'orange',
                'product-1-price': 2.08,
                'product-1-origin-country': 'Argentina',
                'product-1-origin-state': 'Mendoza',
            };

            test.deepEqual(objectUtils.unflatten(flat, '-'), {
                user: {
                    name: 'renato',
                    age: 27,
                    vehiacle: {
                        name: 'Fiat',
                        color: 'Red',
                        fines: [{
                            description: 'Speed limit',
                            price: 300
                        }, {
                            description: 'Traffic light',
                            price: 180
                        }]
                    }
                },
                product: [{
                    name: 'apple',
                    price: 1.34,
                    origin: {
                        country: 'Brazil',
                        state: 'Minas Gerais'
                    },
                    importedWhen: [{
                        date: '01/01/2014',
                        freight: 230
                    }, {
                        date: '01/15/2014',
                        freight: 233.23
                    }]
                }, {
                    name: 'orange',
                    price: 2.08,
                    origin: {
                        country: 'Argentina',
                        state: 'Mendoza'
                    }
                }]
            });
            test.done();
        },
    },

    'deepMerge': {
        'Can deep merge': function(test) {
            var object = {
                name: 'Gammasoft',
                location: {
                    country: 'Brazil',
                    city: 'Brasilia'
                },
                people: [{
                    name: 'Renato',
                    age: 26,
                    role: 'Software Developer'
                }]
            };

            objectUtils.deepMerge(object, {
                location: {
                    country: 'Germany'
                },
                people: [{
                    age: 27,
                    role: 'Software Engineer'
                }]
            });

            test.deepEqual(object, {
                name: 'Gammasoft',
                location: {
                    country: 'Germany',
                    city: 'Brasilia'
                },
                people: [{
                    name: 'Renato',
                    age: 27,
                    role: 'Software Engineer'
                }]
            });
            test.done();
        },
    },

    'deepSet': {
        'Can set deep property properly': function(test) {
            var object = {
                name: 'Gammasoft',
                location: {
                    country: 'Brazil',
                    city: 'Brasilia'
                }
            };

            test.ok(objectUtils.deepSet(object, 'location.country', 'Germany'));
            test.equal(object.location.country, 'Germany');
            test.done();
        },

        'Can set properties inside arrays': function(test) {
            var object = {};

            test.ok(objectUtils.deepSet(object, 'colors.0', 'red'));
            test.ok(objectUtils.deepSet(object, 'colors.1', 'green'));
            test.ok(objectUtils.deepSet(object, 'colors.2', 'blue'));
            test.deepEqual(object, {
                colors: ['red', 'green', 'blue']
            });
            test.ok(Array.isArray(object.colors));
            test.done();
        },

        'Can set properties inside arrays 2': function(test) {
            var object = {};

            test.ok(objectUtils.deepSet(object, 'people.0.name', 'Foo'));
            test.ok(objectUtils.deepSet(object, 'people.1.name', 'Bar'));
            test.ok(objectUtils.deepSet(object, 'people.2.name', 'Alalao'));
            test.deepEqual(object, {
                people: [{
                    name: 'Foo'
                }, {
                    name: 'Bar'
                }, {
                    name: 'Alalao'
                }]
            });
            test.ok(Array.isArray(object.people));
            test.done();
        },
    },

    'flatten': {
        'Tests basic case': function(test) {
            test.deepEqual(objectUtils.flatten({}), {});
            test.deepEqual(objectUtils.flatten(null), null);
            test.deepEqual(objectUtils.flatten(undefined), undefined);
            test.deepEqual(objectUtils.flatten('not an object'), 'not an object');
            test.deepEqual(objectUtils.flatten(123), 123);
            test.done();
        },

        'Can flat nested objects': function(test) {

            var object = {
                name: 'Gammasoft',
                regexp: /Gammasoft/g,
                foundation: new Date(2014, 3, 20),
                location: {
                    country: 'Brazil',
                    city: 'Brasília'
                },
                employees: [{
                    name: 'Renato',
                    role: 'Developer',
                    favoriteColors: [
                        'red', 'blue', 'black'
                    ]
                }]
            };

            test.deepEqual(objectUtils.flatten(object), {
                'name': 'Gammasoft',
                'regexp': /Gammasoft/g,
                'foundation': new Date(2014, 3, 20),
                'location.country': 'Brazil',
                'location.city': 'Brasília',
                'employees.0.name': 'Renato',
                'employees.0.role': 'Developer',
                'employees.0.favoriteColors.0': 'red',
                'employees.0.favoriteColors.1': 'blue',
                'employees.0.favoriteColors.2': 'black',
            });

            test.done();
        },

        'Can pass custom join function': function(test) {
            var object = {
                name: 'Gammasoft',
                regexp: /Gammasoft/g,
                foundation: new Date(2014, 3, 20),
                location: {
                    country: 'Brazil',
                    city: 'Brasília'
                },
                employees: [{
                    name: 'Renato',
                    role: 'Developer',
                    favoriteColors: [
                        'red', 'blue', 'black'
                    ]
                }]
            };

            test.deepEqual(objectUtils.flatten(object, function(a, b) {
                if(!a) {
                    return b;
                }

                return a + b.substr(0, 1).toUpperCase() + b.substr(1);
            }), {
                'name': 'Gammasoft',
                'regexp': /Gammasoft/g,
                'foundation': new Date(2014, 3, 20),
                'locationCountry': 'Brazil',
                'locationCity': 'Brasília',
                'employees0Name': 'Renato',
                'employees0Role': 'Developer',
                'employees0FavoriteColors0': 'red',
                'employees0FavoriteColors1': 'blue',
                'employees0FavoriteColors2': 'black',
            });

            test.done();
        },

        'Can pass initial root': function(test) {
            var object = {
                name: 'Gammasoft',
                regexp: /Gammasoft/g,
                foundation: new Date(2014, 3, 20),
                location: {
                    country: 'Brazil',
                    city: 'Brasília'
                },
                employees: [{
                    name: 'Renato',
                    role: 'Developer',
                    favoriteColors: [
                        'red', 'blue', 'black'
                    ]
                }]
            };

            test.deepEqual(objectUtils.flatten(object, 'myObject'), {
                'myObject.name': 'Gammasoft',
                'myObject.regexp': /Gammasoft/g,
                'myObject.foundation': new Date(2014, 3, 20),
                'myObject.location.country': 'Brazil',
                'myObject.location.city': 'Brasília',
                'myObject.employees.0.name': 'Renato',
                'myObject.employees.0.role': 'Developer',
                'myObject.employees.0.favoriteColors.0': 'red',
                'myObject.employees.0.favoriteColors.1': 'blue',
                'myObject.employees.0.favoriteColors.2': 'black',
            });

            test.done();
        }
    },

    'deepDelete': {
        'Can delete deep properties': function(test) {
            var a = { b: { c: {} } },
                deleted = objectUtils.deepDelete(a, 'b.c');

            test.ok(deleted);
            test.deepEqual(a, { b: { } });
            test.done();
        },

        'Won\'t throw error if property is undefined': function(test) {
            var a = { b: { c: {} } },
                deleted = objectUtils.deepDelete(a, 'b.d.e.f.g');

            test.equal(deleted, false);
            test.deepEqual(a, { b: { c: {} } });
            test.done();
        },

        'Can delete properties 2': function(test) {
            var person = { name: null },
                deleted = objectUtils.deepDelete(person, ['name']);

            test.ok(deleted);
            test.deepEqual(person, {});
            test.done();
        },
    },

    'pick': {
        'if whitelist is undefined then returns an empty object': function(test){

            var object = {
                name: 'Foo',
                job: 'Developer',
                age: 40
            };

            test.deepEqual(objectUtils.pick(object), {});

            test.done();
        },

        'properly pick whitelisted properties': function(test) {
            var object = {
                name: 'Foo',
                job: 'Developer',
                age: 40
            };

            test.deepEqual(objectUtils.pick(object, ['name', 'job']), {name: 'Foo', job: 'Developer'});

            test.done();
        },

        'if whitelist is a empty array then returns the original object': function(test) {
            var object = {
                name: 'Foo',
                job: 'Developer',
                age: 40
            };

            test.deepEqual(objectUtils.pick(object, []), {});

            test.done();
        },

        'properly pick whitelisted properties from objects inside an array': function(test) {
            var array = [{
                name: 'Foo',
                job: 'Developer',
                age: 40
            },{
                name: 'Bar',
                job: 'Designer',
                age: 37
            }];

            test.deepEqual(objectUtils.pick(array, ['name']), [{name: 'Foo'}, {name: 'Bar'}]);

            test.done();
        }
    },
    'prune': {

        'if blacklist is undefined then returns the original object': function(test) {

            var object = {
                name: 'Gammasoft',
                age: 10
            };

            test.deepEqual(objectUtils.prune(object), object);

            test.done();
        },

        'if blacklist is empty array then returns the original object': function(test) {

            var object = {
                name: 'Gammasoft',
                age: 10
            };

            test.deepEqual(objectUtils.prune(object, []), object);

            test.done();
        },

        'properly removes blacklisted properties': function(test) {

            var object = {
                name: 'Gammasoft',
                age: 10
            };

            test.deepEqual(objectUtils.prune(object, ['age']), { name: 'Gammasoft' });

            test.done();
        },

        'properly removes blacklisted properties from objects inside an array': function(test) {

            var array = [{
                name: 'Renato',
                age: 27
            }, {
                name: 'Ilson',
                age: 22
            }];

            test.deepEqual(objectUtils.prune(array, ['age']), [{ name: 'Renato' }, { name: 'Ilson' }]);

            test.done();
        },

        'can receive blacklist as string': function(test) {

            var array = [{
                name: 'Renato',
                age: 27
            }, {
                name: 'Ilson',
                age: 22
            }];

            test.deepEqual(objectUtils.prune(array, 'age'), [{ name: 'Renato' }, { name: 'Ilson' }]);

            test.done();
        },

        'can receive blacklist as comma separated strings': function(test) {

            var array = [{
                name: 'Renato',
                age: 27,
                job: 'Engineer'
            }, {
                name: 'Ilson',
                age: 22
            }];

            test.deepEqual(objectUtils.prune(array, 'age, job'), [{ name: 'Renato' }, { name: 'Ilson' }]);

            test.done();
        }

    },

    'merge': {
        'can merge properly': function(test) {
            var dest = {
                a: 1,
                b: 'Test',
                c: 'Cant touch this!'
            };


            test.deepEqual(objectUtils.merge(dest, { a: 2, b: 3, d: 4 }), {
                a: 2,
                b: 3,
                c: 'Cant touch this!',
                d: 4
            });

            test.done();
        },

        'can merge with undefined object': function(test) {
            test.deepEqual(objectUtils.merge({a: 1}, undefined), { a: 1 });

            test.done();
        },

        'can handle undefineds': function(test) {
            test.deepEqual(objectUtils.merge(undefined, undefined), { });

            test.done();
        },

        'can have undefined destination': function(test) {
            test.deepEqual(objectUtils.merge(undefined, { a: 1 }), { a: 1 });

            test.done();
        },
    },

    'resolveProperty': {
        'can resolve shallow properties': function(test) {
            var object = {
                'company.name': 'Gammasoft'
            };

            test.equal(objectUtils.resolveProperty(object, 'company.name', false), 'Gammasoft');
            test.done();
        },

        'can resolve shallow properties even if set to deep': function(test) {
            var object = {
                'name': 'Gammasoft'
            };

            test.equal(objectUtils.resolveProperty(object, 'name', true), 'Gammasoft');
            test.done();
        },

        'can resolve shallow properties passing array': function(test) {
            var object = {
                'company.name': 'Gammasoft'
            };

            test.equal(objectUtils.resolveProperty(object, ['company.name', 'this', 'is', 'gonna', 'be', 'ignored'], false), 'Gammasoft');
            test.done();
        },

        'can resolve deep properties by default': function(test) {
            var object = {
                company: {
                    name: 'Gammasoft',
                    founder: {
                        name: 'Renato',
                        preferedNumber: 13
                    },
                    country: 'Brazil',
                    city: 'Brasilia',
                    technologies: [
                        'nodejs', 'mongodb', 'aws'
                    ]
                }
            };

            test.equal(objectUtils.resolveProperty(object, 'company.name'), 'Gammasoft');
            test.equal(objectUtils.resolveProperty(object, 'company.country'), 'Brazil');
            test.equal(objectUtils.resolveProperty(object, 'company.city'), 'Brasilia');
            test.equal(objectUtils.resolveProperty(object, 'company.technologies').length, 3);
            test.equal(objectUtils.resolveProperty(object, 'company.founder.name'), 'Renato');
            test.equal(objectUtils.resolveProperty(object, 'company.founder.preferedNumber'), 13);

            test.done();
        },

        'can resolve deep properties passing an array': function(test) {
            var object = {
                company: {
                    name: 'Gammasoft',
                    founder: {
                        name: 'Renato',
                        preferedNumber: {
                            odd: 13,
                            even: 8
                        }
                    },
                    country: 'Brazil',
                    city: 'Brasilia',
                    technologies: [
                        'nodejs', 'mongodb', 'aws'
                    ]
                }
            };

            test.equal(objectUtils.resolveProperty(object, ['company', 'name']), 'Gammasoft');
            test.equal(objectUtils.resolveProperty(object, ['company', 'country']), 'Brazil');
            test.equal(objectUtils.resolveProperty(object, ['company', 'city']), 'Brasilia');
            test.equal(objectUtils.resolveProperty(object, ['company', 'technologies']).length, 3);
            test.equal(objectUtils.resolveProperty(object, ['company', 'founder', 'name']), 'Renato');
            test.equal(objectUtils.resolveProperty(object, ['company', 'founder', 'preferedNumber', 'odd']), 13);
            test.equal(objectUtils.resolveProperty(object, ['company', 'founder', 'preferedNumber', 'even']), 8);

            test.done();
        },

        'wont throw an error if cant resolve the property': function(test) {
            var object = {
                company: {
                    founder: {
                        name: 'Renato',
                    }
                }
            };

            test.equal(objectUtils.resolveProperty(object, 'company.founder.name'), 'Renato');
            test.equal(objectUtils.resolveProperty(object, 'company.founder.address'), null);
            test.equal(objectUtils.resolveProperty(object, 'company.founder.address.street'), null);
            test.equal(objectUtils.resolveProperty(object, 'company.founder.address.street.foo'), null);

            test.done();
        },
    },

    'values': {
        'Checks that works properly': function(test){
            var values = objectUtils.values({a: '1', b: '2', c:'3'});
            test.deepEqual(values, ['1', '2', '3']);
            test.done();
        }
    },

    'keys': {
        'Detects every key in a given object': function(test){
            var keys = objectUtils.keys({a: '', b: '', c:''});
            test.deepEqual(keys, ['a', 'b', 'c']);
            test.done();
        },

        'keys: Throws if type is not object': function(test){
            test.throws(function(){
                objectUtils.keys('');
            });

            test.throws(function(){
                objectUtils.keys(true);
            });

            test.throws(function(){
                objectUtils.keys(123);
            });

            test.throws(function(){
                objectUtils.keys([]);
            });

            test.doesNotThrow(function(){
                objectUtils.keys(new Date());
            });

            test.doesNotThrow(function(){
                objectUtils.keys({});
            });

            test.done();
        }
    },

    'isObject': {
        'Check that it detects regular objects and arrays': function(test){
            test.ok(objectUtils.isObject({}));
            test.ok(objectUtils.isObject([]));

            test.done();
        }
    },

    'isUndefined': {
        'Check if isUndefined works as expected': function(test){
            test.ok(objectUtils.isUndefined(undefined));
            test.ok(objectUtils.isUndefined(void 0));
            test.equal(objectUtils.isUndefined(100), false);

            test.done();
        }
    },

    'isArray': {
        'Check that it detects arrays': function(test){
            test.ok(objectUtils.isArray([]));
            test.equal(objectUtils.isArray({}), false);
            test.equal(objectUtils.isArray('this is not an array'), false);

            test.done();
        }
    },

    'isBoolean': {
        'Check that detects booleans': function(test){
            test.ok(objectUtils.isBoolean(true));
            test.equal(objectUtils.isBoolean(1), false);
            test.equal(objectUtils.isBoolean(0), false);

            test.done();
        }
    },

    'isString': {
        'Check that detects strings': function(test){
            test.ok(objectUtils.isString('Gammasoft'));
            test.equal(objectUtils.isString(1), false);
            test.equal(objectUtils.isString(/as/g), false);

            test.done();
        }
    },

    'isEmpty': {
        'Check that detects empty objects': function(test){
            test.ok(objectUtils.isEmpty({}));

            test.done();
        },

        'Check that if detects non empty objects': function(test){
            test.equal(objectUtils.isEmpty({ a: 1, b: 2 }), false);

            test.done();
        }
    },

    'isNumber': {
        'Check that it detects regular numbers': function(test){
            test.ok(objectUtils.isNumber(1234.45));
            test.ok(objectUtils.isNumber(121343.34));
            test.ok(objectUtils.isNumber(Number.MAX_VALUE));
            test.ok(objectUtils.isNumber(Number.MIN_VALUE));

            test.done();
        },

        'Check that it detects numbers in strings': function(test){
            test.ok(objectUtils.isNumber('123'));
            test.ok(objectUtils.isNumber('123.234'));
            test.ok(objectUtils.isNumber('121343.34'));
            test.ok(objectUtils.isNumber('1.7976931348623157e+308'));
            test.ok(objectUtils.isNumber('5e-324'));

            test.done();
        },

        'Check that it rejects non numbers': function(test){
            test.equal(objectUtils.isNumber(''), false);
            test.equal(objectUtils.isNumber(1/0), false);
            test.equal(objectUtils.isNumber('1,89'), false);
            test.equal(objectUtils.isNumber('12345.2345.656'), false);

            test.done();
        }
    },

    'argsToArray': {
        'Parses arguments to array correctly': function(test){
            function fn(){
                test.deepEqual(['param1', 'param2', 3, true], objectUtils.argsToArray(arguments));
                test.done();
            }

            fn('param1', 'param2', 3, true);
        },

        'Parses arguments to array returning elements only from the given index': function(test){
            function fn(){
                test.deepEqual([3, true], objectUtils.argsToArray(arguments, 2));
                test.done();
            }

            fn('param1', 'param2', 3, true);
        }
    },

    'forEachOwnProperty': {
        'Wont throw errors if object is null': function(test) {
            test.doesNotThrow(function() {
                objectUtils.forEachOwnProperty(null);
                objectUtils.forEachOwnProperty(null, function() {
                    test.ok(false); //should not come here!
                });
            });

            test.done();
        },
        'Knows if there is more properties to iterate': function(test) {
            test.expect(2);

            objectUtils.forEachOwnProperty({a: 1, b: 'foo', c: /regexp/i}, function(property, value, hasNext){
                if(hasNext) {
                    test.ok(true);
                }
            });

            test.done();
        },

        'Iterates through every own property': function(test){
            test.expect(3);
            objectUtils.forEachOwnProperty({a: 1, b: 'foo', c: /regexp/i}, function(property){
                test.ok(property);
            });

            test.done();
        },

        'Can break the loop': function(test){
            test.expect(1);
            objectUtils.forEachOwnProperty({a: 1, b: 'foo', c: /regexp/i}, function(property){
                test.equal(property, 'a');
                return 'break';
            });

            test.done();
        }
    }
};