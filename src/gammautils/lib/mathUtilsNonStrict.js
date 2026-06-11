/* jshint strict:false */

module.exports.__name = 'Math';

module.exports.solve = function(input, vars){
    //credits: https://gist.github.com/guille/1590954
    /* jshint evil:true, unused:false */

    try {
        return eval('with(Math){with(vars || {}){' + input + '}}');
    } catch (e) {
        console.log(e);
        return NaN;
    }
};