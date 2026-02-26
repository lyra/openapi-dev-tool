'use strict';

module.exports.__name = 'Console';

module.exports.clearScreen = function(){ process.stdout.write('\u001B[2J\u001B[0;0f'); };