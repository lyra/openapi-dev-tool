'use strict';

var _ = require('underscore'),
    fs = require('fs'),
    utils = require('./index'),
    glob = require('glob'),
    marked = require('marked'),
    hl = require('highlight.js'),
    beautify = require('js-beautify'),
    pack = require('./package.json');

/* jshint ignore:start */
beautify = beautify.js_beautify
/* jshint ignore:end */

module.exports = function(grunt) {

    grunt.initConfig({
        htmlmin: {
            html: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'docs/index.html': 'docs/index.html'
                }
            }
        },

        nodeunit : {
            all : ['tests/*.js']
        },

        jshint: {
            all: [
                'Gruntfile.js',
                'index.js',
                //'tests/**/*.js',
                'lib/**/*.js'
            ],
            options: {
                node: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                bitwise: true,
                forin: true,
                immed: true,
                indent: 4,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                nonew: true,
                plusplus: false,
                quotmark: 'single',
                undef: true,
                unused: true,
                strict: true,
                trailing: true,
                maxparams: 4,
                maxdepth: 3
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    grunt.registerTask('test', [
        'jshint',
        'nodeunit'
    ]);

    grunt.registerTask('generateDocs', function() {
        var allTogetherTemplate = _.template(fs.readFileSync('./docs/allTogetherTemplate.html').toString()),
            moduleTemplate = _.template(fs.readFileSync('./docs/moduleTemplate.html').toString()),
            //sidebarTemplate = _.template(fs.readFileSync('./docs/sidebarTemplate.html').toString()),
            index = [],
            body = '';

        glob.sync(__dirname + '/lib/*Utils.js').forEach(function(modulePath) {
            var module = require(modulePath),
                tests = require(modulePath.replace('/lib/', '/tests/').replace('.js', 'Test.js'));

            delete tests.__name;
            delete tests.__description;

            var lengthOfFunctions = Object.keys(tests).length;
                //functionPluralization = lengthOfFunctions === 1 ? 'function' : 'functions';

            if(lengthOfFunctions === 0) {
                return;
            }

            index.push([
                '<div class="menuItem">',
                '<a href="#',
                module.__name,
                '" title="',
                module.__description || '',
                '">',
                module.__name,
                ' (',
                lengthOfFunctions,
                // '<span class="hidden-xs">&nbsp;',
                // functionPluralization,
                // '</span>',
                ')',
                '</a>',
                '<div class="submenu" style="display: none;">',
                Object.keys(tests).reduce(function(submenu, current) {
                    return submenu + '<small>&nbsp;&nbsp;<a href="#' + module.__name + current + '">' + current + '</a></small><br />';
                }, ''),
                '</div>',
                '</div>'
            ].join(''));

            body += moduleTemplate({
                name: module.__name,
                description: module.__description || '',
                hl: hl.highlight,
                beautify: beautify,
                tests: tests
            });
        });

        pack.contributors = pack.contributors.map(function(contributor) {
            contributor.avatar = [
                'http://gravatar.com/avatar/',
                utils.crypto.md5(contributor.email || contributor.url),
                '?s=40&d=identicon'
            ].join('');

            var match = contributor.url && contributor.url.match(/^https:\/\/github.com\/(.*)$/);

            if(match) {
                contributor.username = match[1];
            }

            return contributor;
        }).sort(function(a, b) {
            return a.contributions < b.contributions;
        });

        pack.author = utils.string.parseFormattedEmailAddress(pack.author);

        pack.author.avatar = [
            'http://gravatar.com/avatar/',
            utils.crypto.md5(pack.author.email),
            '?s=15&d=identicon'
        ].join('');

        fs.writeFileSync('./docs/index.html', allTogetherTemplate({
            pack: pack,
            index: index,
            body: body,
            license: marked(fs.readFileSync('./LICENSE.md').toString())
        }));
    });

    grunt.registerTask('docs', [
        'generateDocs',
        'htmlmin'
    ]);
};