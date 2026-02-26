'use strict';

module.exports.__name = 'File System';

//var fs = require('fs'),
//    path = require('path');
//
//function readDirectoryRecursivelySync (directoryPath, callback, results){
//    if ( typeof results === 'undefined' ) {
//        results = [];
//    }
//
//    var contents = fs.readdirSync(directoryPath);
//
//    contents.forEach(function(content){
//        var contentPath = path.join(directoryPath, content);
//        results.push(contentPath);
//
//        if( fs.lstatSync(contentPath).isDirectory() ) {
//            readDirectoryRecursivelySync(contentPath, callback, results);
//        } else if( callback ) {
//            callback(contentPath);
//        }
//    });
//
//    return results;
//}

//module.exports.readDirectoryRecursivelySync = readDirectoryRecursivelySync;