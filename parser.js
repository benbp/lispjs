/* jshint node:true */

'use strict';

var _ = require('lodash');

function tokenize(str) {
    return _.compact(str.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').split(' '));
}

// Do this iteratively because I already know how to do it recursively.
function readExpressionsFromTokens(tokens) {
    if (tokens.shift() !== '(') {
        throw new Error('Program must begin with "("');
    }
    var scope = [];
    var curr = scope;
    var prev = [curr];
    var i = 0;
    _.forEach(tokens, function(token) {
        i += 1;
        if (token === '(') {
            prev.push(curr);
            curr.push([]);
            curr = _.last(curr);
        } else if (token === ')') {
            curr = prev.pop();
            if (!curr) {
                throw new Error('Syntax error: unbalanced closed parentheses');
            } else if (i === tokens.length-1 && prev.length > 1) {
                throw new Error('Syntax error: unbalanced open parentheses');
            }
        } else {
            curr.push(atom(token));
        }
    });
    return scope;
}

function atom(token) {
    if (isNaN(token)) return token;
    if (token % 1 === 0 ) return parseInt(token);
    return parseFloat(token);
}

function Symbol(token) {
    return token;
}

function parse(program) {
    return readExpressionsFromTokens(tokenize(program));
}

console.log(parse(process.argv[2]));
