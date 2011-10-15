exports.view = function($) {
var indent = '';
var __buffer = [];
var __bufferLengthStack = [];
var __indentStack = [];
var name = $.name;
var city = $.city;
__buffer.push('<!DOCTYPE html><html><head><title></title></head><body>\n\n');
__buffer.push('Hello World! I\'m ' + (name) + ' from ' + (city) + '!');
__buffer.push('\n\n</body></html>');
return __buffer.join('');
}