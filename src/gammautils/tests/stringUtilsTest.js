//'use strict';

var stringUtils = require('../lib/stringUtils');

with(stringUtils) {
    module.exports = {
        '__name': { '': function(test) { test.done(); } },
        '__description': { '': function(test) { test.done(); } },

        'removeNewLines': {
            'Remove new lines properly': function(test) {
                var text = 'text\nfull\nof\nnew\nlines!';
                test.equal(stringUtils.removeNewLines(text), 'text full of new lines!');
                test.done();
            },

            'Can replace new lines with another string other than whitespace': function(test) {
                var text = 'text\nfull\nof\nnew\nlines!';
                test.equal(stringUtils.removeNewLines(text, ' - '), 'text - full - of - new - lines!');
                test.done();
            },
        },

        'removeExtraSpaces': {
            'Remove extra spaces properly': function(test) {
                var text = ' this    is      a   test!   ';
                test.equal(stringUtils.removeExtraSpaces(text), 'this is a test!');
                test.done();
            },

            'Can remove new lines and tabs too': function(test) {
                var text = ' this    is   \t   a   test!   \n        another    line    here  ';
                test.equal(stringUtils.removeExtraSpaces(text), 'this is a test! another line here');
                test.done();
            }
        },

        'insert': {
            'Use this function to insert a string at a given index of another string': function(test) {
                var original = 'GMMSFT';

                original = insert(original, 1, 'A');
                original = insert(original, 4, 'A');
                original = insert(original, 6, 'O');

                test.equal(original, 'GAMMASOFT');
                test.done();
            }
        },

        'reduceWhiteSpaces': {
            'Replaces two or more consecutive whitespaces with a single one and trims the result': function(test) {
                test.equal(reduceWhiteSpaces('    this    is   \t a    test\t      '), 'this is a test');

                test.done();
            }
        },

        'camelCaseJoin': {
            'Joins two strings making sure the first starts with lower case and the second with upper case': function(test) {
                test.equal(camelCaseJoin('Camel', 'case'), 'camelCase');

                test.done();
            }
        },

        'count': {
            'Return right count': function(test) {
                test.equal(count('Gamma foo Gamma bar Gamma alalao', /Gamma/g), 3);
                test.done();
            },

            'Can receive string': function(test) {
                test.equal(count('Gamma foo Gamma bar Gamma alalao foo', 'foo'), 2);
                test.done();
            },
        },
        'decapitalize': {
            'Test that it works': function(test) {
                test.equal(decapitalize('RENATO'), 'rENATO');
                test.equal(decapitalize('GAMMASOFT'), 'gAMMASOFT');
                test.done();
            },

            'Wont throw any error if not string and value will pass': function(test) {
                test.equal(decapitalize(null), null);
                test.equal(decapitalize(undefined), undefined);
                test.equal(decapitalize(123), 123);
                test.done();
            }
        },
        'capitalize': {
            'Test that it works': function(test) {
                test.equal(capitalize('renato'), 'Renato');
                test.equal(capitalize('gammasoft'), 'Gammasoft');
                test.done();
            },

            'Wont throw any error if not string and value will pass': function(test) {
                test.equal(capitalize(null), null);
                test.equal(capitalize(undefined), undefined);
                test.equal(capitalize(123), 123);
                test.done();
            }
        },
        'Line': {
            '"add" property exposes defaults parsers': function(test) {
                var line = new Line();

                test.equal(typeof line.add.value, 'function');

                test.done();
            },

            'Can pass custom parsers': function(test) {
                var line = new Line({
                    numericValue: function(){}
                });

                test.equal(typeof line.add.numericValue, 'function');

                test.done();
            },

            'Can add values and retrieve': function(test) {
                var line = new Line();

                line.add.value('this');
                line.add.value('is');
                line.add.value('a');
                line.add.value('test');

                test.equal(line.toString(), 'thisisatest');
                test.done();
            },

            'Can add values and retrieve with separator': function(test) {
                var line = new Line();

                line.add.value('this');
                line.add.value('is');
                line.add.value('a');
                line.add.value('test');

                test.equal(line.toString(' '), 'this is a test');
                test.done();
            },

            'Can pass size limiter for a line': function(test) {
                var line = new Line(5);

                test.throws(function() {
                    line.add.value('Gammasoft');
                });

                test.done();
            },

            'Verify that custom parsers works': function(test) {
                var line = new Line({
                    number: function(value) {
                        return 'NUMBER: ' + value;
                    },
                    string: function(value) {
                        return 'STRING: ' + value;
                    }
                });

                line.add.number(42);
                line.add.string('OK');

                test.equal(line.toString(' - '), 'NUMBER: 42 - STRING: OK');
                test.done();
            },

            'Verify that size limit is applied after value goes though the custom parsers': function(test) {
                var line = new Line(3, {
                    number: function(value) {
                        return 'NUMBER: ' + value;
                    }
                });

                test.throws(function() {
                    line.add.number(42);
                });

                test.done();
            },

            'Verify that can add a label to a value and can export it': function(test) {
                var line = new Line();

                line.add.value('Gammasoft').labeled('Company Name');
                line.add.value(1).labeled('Number Of Employees');

                test.equal(line.toString(';', true), 'Company Name;Number Of Employees\nGammasoft;1');
                test.done();
            },

            'Verify that "parsers" object is not modified in a way they feed the same "records" array': function(test) {
                var parsers = {
                        lowerCaseString: function(value) {
                            return value.toLowerCase();
                        }
                    },
                    line1 = new Line(5, parsers),
                    line2 = new Line(5, parsers);

                line1.add.lowerCaseString('Gamma');

                test.doesNotThrow(function() {
                    line2.add.lowerCaseString('soft');
                });

                test.done();
            },

            'Throws an error if toString is called in strictSize mode when size is different of the one specified': function(test) {
                var line = new Line(500);

                line.add.value('Will throw an error because size is not 500');

                test.throws(function() {
                    line.toString('', false, {
                        strictSize: true
                    });
                });

                test.done();
            },

            'Does not throw an error when toString is called in strictSize mode and has the right value': function(test) {
                var line = new Line(9);

                line.add.value('Gammasoft');

                test.doesNotThrow(function() {
                    line.toString('', false, {
                        strictSize: true
                    });
                });

                test.done();
            },

            'Can specifiy cursor position': function(test) {
                var line = new Line(10);


                test.doesNotThrow(function() {
                    line.add.value('ASD').at(0);
                    line.add.value('FGH').at(3);
                });

                test.done();
            },

            'Will throw exception if explicit index mismatch': function(test) {
                var line = new Line(10);

                test.throws(function() {
                    line.add.value(42).at(0);
                    line.add.value('FGH').at(4);
                });

                test.done();
            },

            'Can use explicit index with custom parser': function(test) {
                var line = new Line(10, {
                    number: function(value) {
                        return 'NUMBER: ' + value;
                    }
                });

                test.doesNotThrow(function() {
                    line.add.number(42).at(0);
                });

                test.done();
            },

            'Will throw exception when using explicit index and custom parsers': function(test) {
                var line = new Line(10, {
                    number: function(value) {
                        return 'NUMBER: ' + value;
                    }
                });

                test.throws(function() {
                    line.add.number(42).at(1);
                });

                test.done();
            }
        },

        'truncate': {
            'Verifiy that words are keep intact if length is ok': function(test) {
                test.equal(truncate('Gammasoft', 100), 'Gammasoft');
                test.equal(truncate('123', 5), '123');

                test.done();
            },

            'Verifiy that words are properly truncated': function(test) {
                test.equal(truncate('Gammasoft', 5), 'Gamma');
                test.equal(truncate('12345', 1), '1');

                test.done();
            },

            'Verifiy that length can be passed as a string': function(test) {
                test.equal(truncate('Gammasoft', '5'), 'Gamma');

                test.done();
            },

            'Verifiy that string can be passaed as a number': function(test) {
                test.equal(truncate(12345, '2'), '12');

                test.done();
            }
        },

        'slugify': {
            //Taken from underscore.string, all credits to them
            'Testing basic functionality': function(test) {
                test.equal(slugify('Jack & Jill like numbers 1,2,3 and 4 and silly characters ?%.$!/'), 'jack-jill-like-numbers-123-and-4-and-silly-characters');
                test.equal(slugify('Un éléphant à l\'orée du bois'), 'un-elephant-a-loree-du-bois');
                test.equal(slugify('I know latin characters: á í ó ú ç ã õ ñ ü ă ș ț'), 'i-know-latin-characters-a-i-o-u-c-a-o-n-u-a-s-t');
                test.equal(slugify('I am a word too, even though I am but a single letter: i!'), 'i-am-a-word-too-even-though-i-am-but-a-single-letter-i');
                test.equal(slugify(''), '');
                test.equal(slugify(null), '');
                test.equal(slugify(undefined), '');
                test.done();
            }
        },

        'dasherize': {
            //Taken from underscore.string, all credits to them
            'Testing basic functionality': function(test) {
                test.equal(dasherize('the_dasherize_string_method'), 'the-dasherize-string-method');
                test.equal(dasherize('TheDasherizeStringMethod'), '-the-dasherize-string-method');
                test.equal(dasherize('thisIsATest'), 'this-is-a-test');
                test.equal(dasherize('this Is A Test'), 'this-is-a-test');
                test.equal(dasherize('thisIsATest123'), 'this-is-a-test123');
                test.equal(dasherize('123thisIsATest'), '123this-is-a-test');
                test.equal(dasherize('the dasherize string method'), 'the-dasherize-string-method');
                test.equal(dasherize('the  dasherize string method  '), 'the-dasherize-string-method');
                test.equal(dasherize('téléphone'), 'téléphone');
                test.equal(dasherize('foo$bar'), 'foo$bar');
                test.equal(dasherize(''), '');
                test.equal(dasherize(null), '');
                test.equal(dasherize(undefined), '');
                test.equal(dasherize(123), '123');
                test.done();
            }
        },

        'parseFormattedEmailAddress': {
            'Check that parses correctly': function(test) {
                var email = 'Renato Gama <renatogama@example.com>',
                    data = parseFormattedEmailAddress(email);

                test.equal(data.name, 'Renato Gama');
                test.equal(data.email, 'renatogama@example.com');
                test.done();
            },

            'Return same thing if no formatted email detected': function(test) {
                test.equal(parseFormattedEmailAddress(42), 42);
                test.equal(parseFormattedEmailAddress(undefined), undefined);
                test.equal(parseFormattedEmailAddress('Not a formatted email address'), 'Not a formatted email address');

                test.done();
            }
        },
        'getSearchString': {
            'Check that search string is generated properly': function(test) {
                test.equal(getSearchString('São Paulo'), 'saopaulo');
                test.equal(getSearchString(' São-Paulo. Rio-de-Janeiro.'), 'saopauloriodejaneiro');

                test.done();
            }
        },

        'generateGuid': {
            //too random to test
        },

        'pad': {
            'Check that pads left/right/both positions': function(test){
                test.equal(pad('1', 5, '0'), '00001');
                test.equal(pad('1', 5, '0', 'left'), '00001');
                test.equal(pad('1', 5, '0', 'right'), '10000');
                test.equal(pad('1', 5, '0', 'both'), '00100');

                test.done();
            }
        },

        'removeDiacritics': {
            'Can remove most commom diacritics': function(test){
                test.equal(removeDiacritics('áâàãÁÂÀÃéêèÉÊÈíîìÍÎÌóôòõÓÔÒÕúûùÚÛÙ'), 'aaaaAAAAeeeEEEiiiIIIooooOOOOuuuUUU');
                test.done();
            }
        },

        'reverseString': {
            'Can reverse a string': function(test){
                test.equal(reverseString('Gammasoft Desenvolvimento de Software Ltda'), 'adtL erawtfoS ed otnemivlovneseD tfosammaG');
                test.done();
            }
        },

        'findSuffix': {
            'Returns expected results': function(test){
                var data;

                data = [
                        'Metallica - Ride The Lightning - Uploaded by John Doe',
                        'Metallica - Master Of Puppets - Uploaded by John Doe',
                        'Metallica - ...And Justice For All - Uploaded by John Doe',
                    ];

                test.equal(findSuffix(data), ' - Uploaded by John Doe');

                data = [
                        '12346',
                        '123546',
                        '1246',
                    ];

                test.equal(findSuffix(data), '46');

                test.done();
            }
        },

        'findPrefix': {
            'Returns expected results': function(test){
                var data;

                data = [
                        'Metallica - Ride The Lightning',
                        'Metallica - Master Of Puppets',
                        'Metallica - ...And Justice For All',
                    ];

                test.equal(findPrefix(data), 'Metallica - ');

                data = [
                        '1234',
                        '1235',
                        '12',
                    ];

                test.equal(findPrefix(data), '12');

                test.done();
            }
        },

        'removePrefix': {
            'Returns expected results': function(test){
                var data;

                data = [
                        'Metallica - Ride The Lightning',
                        'Metallica - Master Of Puppets',
                        'Metallica - ...And Justice For All'
                    ];

                test.deepEqual(removePrefix(data), [
                    'Ride The Lightning',
                    'Master Of Puppets',
                    '...And Justice For All'
                ]);

                data = [
                        '1234',
                        '1235',
                        '12',
                    ];

                test.deepEqual(removePrefix(data), ['34', '35', '']);

                test.done();
            }
        },

        'startsWith': {
            'Returns expected results': function(test){
                test.ok(startsWith('startsWith', 'starts'));
                test.done();
            }
        },


        'endsWith': {
            'Returns expected results': function(test){
                test.ok(endsWith('endsWith', 'With'));
                test.done();
            }
        },

        'isIp': {
            'Check some correct IPs': function(test){
                test.ok(isIp('192.168.0.1'));
                test.ok(isIp('192.168.1.100'));
                test.ok(isIp('187.104.237.90'));

                test.done();
            },

            'Not IPs': function(test){
                test.ok(!isIp('foobar'));
                test.ok(!isIp('192.1681.100'));
                test.ok(!isIp('187.a.237.90'));

                test.done();
            },
        },

        'getUrlSubpaths': {
            'Returns expected results': function(test){
                test.deepEqual(getUrlSubpaths('/this/is/a/good/test/'), [
                    'this',
                    'this/is',
                    'this/is/a',
                    'this/is/a/good',
                    'this/is/a/good/test',
                ]);

                test.done();
            }
        },

        'joinUrls': { //move to urlUtils
            'Returns expected results': function(test){
                test.equal(joinUrls('', '/is/good'), '/is/good');
                test.equal(joinUrls('/testing', ''), '/testing');
                test.equal(joinUrls('/testing', '/is/good'), '/testing/is/good');
                test.equal(joinUrls('/testing/', '/is/good'), '/testing/is/good');
                test.equal(joinUrls('/testing/', 'is/good'), '/testing/is/good');
                test.equal(joinUrls('/testing', 'is/good'), '/testing/is/good');
                test.done();
            }
        },

        'nextSizeType': {
            'Returns expected results': function(test){
                test.equal(nextSizeType('b'), 'Kb');
                test.equal(nextSizeType('Kb'), 'Mb');
                test.equal(nextSizeType('Mb'), 'Gb');
                test.equal(nextSizeType('Gb'), 'Tb');
                test.equal(nextSizeType('Tb'), 'Pb');
                test.equal(nextSizeType('Pb'), 'Pb');

                test.done();
            },

            'Returns null if not expected value is passed': function(test){
                test.equal(nextSizeType('thisIsNotValid'), null);
                test.equal(nextSizeType('fooBar'), null);
                test.equal(nextSizeType('123'), null);
                test.equal(nextSizeType('asdfg'), null);

                test.done();
            }
        },

        'formatFileSize': {
            'Formats as expected': function(test){
                test.equal(formatFileSize(0, 'b'), '0.00b');
                test.equal(formatFileSize(500, 'b'), '500.00b');
                test.equal(formatFileSize(500, 'b', 0), '500b');
                test.equal(formatFileSize(1024, 'b', 2), '1.00Kb');
                test.equal(formatFileSize(1024, 'b'), '1.00Kb');
                test.equal(formatFileSize(2048, 'b', 3), '2.000Kb');
                test.equal(formatFileSize(2013, 'Mb', 4), '1.9658Gb');
                test.equal(formatFileSize(2912, 'Gb', 5), '2.84375Tb');
                test.equal(formatFileSize(1025, 'Tb', 1), '1.0Pb');
                test.equal(formatFileSize(2048, 'Pb', 0), '2048Pb');
                test.done();
            },

            'Can pass numeric strings instead of number': function(test) {
                test.equal(formatFileSize('173'), '173.00b');
                test.equal(formatFileSize('1024'), '1.00Kb');
                test.done();
            },

            'You can provide your custom decimal separator': function(test) {
                test.equal(formatFileSize(1024, 'b', 2, ','), '1,00Kb');
                test.equal(formatFileSize(2912, 'Gb', 5, ','), '2,84375Tb');
                test.done();
            }
        },

        'parseSequence': {
            'Correctly parses a sequence (segment length can be number string)': function(test){
                var sd = {
                        'Valor Fixo': 3,
                        'Codigo da Uf': 2,
                        'AAMM da Emissao': '4',
                        'CNPJ do Emitente': 14,
                        'Modelo': 2,
                        'Serie': '3',
                        'Numero da NFe': 9,
                        'Codigo Numerico': '9',
                        'DV': 1
                    };

                parseSequence('NFe52110200132781000178550010000005480000005481', sd);

                test.equal(sd['Valor Fixo'], 'NFe');
                test.equal(sd['Codigo da Uf'], '52');
                test.equal(sd['AAMM da Emissao'], '1102');
                test.equal(sd['CNPJ do Emitente'], '00132781000178');
                test.equal(sd.Modelo, '55');
                test.equal(sd.Serie, '001');
                test.equal(sd['Numero da NFe'], '000000548');
                test.equal(sd['Codigo Numerico'], '000000548');
                test.equal(sd.DV, '1');
                test.done();
            },

            'Can pass strictSize option to prevent parsing of strings with dofferent length': function(test) {
                var sd = {
                    'Valor Fixo': 3,
                    'Codigo da Uf': 2,
                    'AAMM da Emissao': '4',
                    'CNPJ do Emitente': 14,
                    'Modelo': 2,
                    'Serie': '3',
                    'Numero da NFe': 9,
                    'Codigo Numerico': '9',
                    'DV': 1
                };

                test.throws(function() {
                    parseSequence('I must have 47 characters, otherwise I fail!', sd, {
                        strictSize: 47
                    });
                });

                test.done();
            },

            'Can pass definition object instead of only offset number': function(test) {
                var sd = {
                    'someNumber': 3,
                    'someString': {
                        offset: '2'
                    },
                };

                parseSequence('123AB', sd, {
                    strictSize: 5
                });

                test.equal(sd['someNumber'], '123');
                test.equal(sd['someString'], 'AB');
                test.done();
            },

            'Can ignore a property': function(test) {
                var sd = {
                    'someNumber': 3,
                    'someString': {
                        offset: '2',
                        ignore: true
                    },
                    'value': 2,
                };

                var results = parseSequence('123AB45', sd, {
                    strictSize: 7
                });

                test.equal(results['someNumber'], '123');
                test.equal(typeof results['someString'], 'undefined');
                test.equal(results['value'], '45');
                test.done();
            },

            'Can perform convertions': function(test) {
                var sd = {
                    'someNumber': {
                        offset: 3,
                        convertTo: 'number'
                    },
                    'someString': {
                        offset: '2',
                        convertTo: 'string'
                    },
                    'someDate': {
                        offset: '24',
                        convertTo: 'date'
                    },
                    'custom': {
                        offset: 12,
                        convertTo: function(value) {
                            return 'custom conversion works'
                        }
                    }
                };

                parseSequence('123AB2015-07-02T16:30:39.552Zdoesntmatter', sd, {
                    strictSize: 41
                });

                test.strictEqual(sd['someNumber'], 123);
                test.strictEqual(sd['someString'], 'AB');
                test.strictEqual(sd['someDate'].valueOf(), 1435854639552);
                test.strictEqual(sd['custom'], 'custom conversion works');
                test.done();
            }
        },

        'onlyLettersAndNumbers': {
            'Check that only contains letters and numbers': function(test){
                test.ok(onlyLettersAndNumbers('AaBbCc1872817873aodsiufh'));
                test.ok(onlyLettersAndNumbers('AOIUHAoiuhi3429876492iuyegfwuadiu'));

                test.equal(onlyLettersAndNumbers('abcdefgh_32234'), false);
                test.equal(onlyLettersAndNumbers('!@#$%ˆ&*()'), false);
                test.equal(onlyLettersAndNumbers('{}|{}|\':A\': çdc'), false);

                test.done();
            },

            'Check that only contains letters and numbers of a given size': function(test){
                test.ok(onlyLettersAndNumbers('abc123', '6'));
                test.ok(onlyLettersAndNumbers('abc123', 6));
                test.ok(onlyLettersAndNumbers('abcedfghi', '9'));
                test.ok(onlyLettersAndNumbers('abcedfghi', 9));
                test.ok(onlyLettersAndNumbers('', '*'));
                test.ok(onlyLettersAndNumbers('1', '+'));
                test.ok(onlyLettersAndNumbers('a', '+'));
                test.ok(onlyLettersAndNumbers('1324wef234efwga', '+'));

                test.equal(onlyLettersAndNumbers('', '+'), false);
                test.equal(onlyLettersAndNumbers('123asd', '1'), false);
                test.equal(onlyLettersAndNumbers('{}|{}|\':A\': çdc', '5'), false);

                test.done();
            }
        },

        'getRandomString': {
            'Check length of string': function(test){
                test.ok(getRandomString(10).length === 10);
                test.ok(getRandomString(5).length === 5);
                test.done();
            },

            'Check that string contains only numbers': function(test){
                test.ok(/^\d+$/.test(getRandomString(5, '1234567890')));
                test.ok(/^\d+$/.test(getRandomString(5, '1234567890')));
                test.ok(/^\d+$/.test(getRandomString(5, '1234567890')));
                test.ok(/^\d+$/.test(getRandomString(5, '1234567890')));
                test.ok(/^\d+$/.test(getRandomString(5, '1234567890')));
                test.ok(/^\d+$/.test(getRandomString(5, '1234567890')));
                test.ok(/^\d+$/.test(getRandomString(5, '1234567890')));
                test.ok(/^\d+$/.test(getRandomString(5, '1234567890')));
                test.ok(/^\d+$/.test(getRandomString(5, '1234567890')));
                test.ok(/^\d+$/.test(getRandomString(5, '1234567890')));

                test.done();
            }
        },

        'shortenName': {
            'Check that names are properly shortened with level 0': function(test){
                test.equal('Elizabeth C. Finnegan', shortenName('Elizabeth Claire Finnegan'));
                test.equal('Hannah J. Whittaker', shortenName('Hannah Jocelyn Whittaker'));
                test.equal('Madeline Eve Cooper', shortenName('Madeline Eve Cooper'));
                test.equal('Alyssa Marie', shortenName('Alyssa Marie'));
                test.equal('Catherine F. M. C. Galon', shortenName('Catherine Françoise Marie Christine Galon'));
                test.equal('Armand-Jean Du Plessis', shortenName('Armand-Jean Du Plessis'));

                test.done();
            },

            'shortenName: Check that names are properly shortened with level 1': function(test){
                test.equal('Elizabeth Finnegan', shortenName('Elizabeth Claire Finnegan', 1));
                test.equal('Hannah Whittaker', shortenName('Hannah Jocelyn Whittaker', 1));
                test.equal('Madeline Cooper', shortenName('Madeline Eve Cooper', 1));
                test.equal('Alyssa Marie', shortenName('Alyssa Marie', 1));
                test.equal('Catherine Galon', shortenName('Catherine Françoise Marie Christine Galon', 1));
                test.equal('Armand-Jean Plessis', shortenName('Armand-Jean Du Plessis', 1));

                test.done();
            }
        },

        'splitWords': {
            'Check no whitespace characters are included': function(test){
                test.deepEqual(['This', 'is', 'the', 'expected', 'result'], splitWords(' This   is the    expected        result    '));

                test.done();
            }
        },

        'getLink': {
            'Generates a proper link': function(test){
                test.equal('<a href="/test.html">test</a>', getLink('test', {href: '/test.html'}));

                test.equal('<a title="The Title" href="/test.html">test</a>', getLink('test', {
                    href: '/test.html',
                    title: 'The Title'
                }));

                test.equal('<a target="_blank" href="/test.html">test</a>', getLink('test', {
                    href: '/test.html',
                    target: '_blank'
                }));

                test.equal('<a title="The Title" target="_blank" href="/test.html">test</a>', getLink('test', {
                    href: '/test.html',
                    title: 'The Title',
                    target: '_blank'
                }));

                test.done();
            }
        }
    };
}
