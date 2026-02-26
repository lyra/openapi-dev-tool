'use strict';

var fs = require('fs'),
    semver = require('semver'),
    pkg = require('./package.json');

pkg.version = semver.inc(pkg.version, 'patch');

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 4));