exports.view = function($) {
var indent = '';
var __buffer = [];
var __bufferLengthStack = [];
var __indentStack = [];
var name = $.name;
var city = $.city;
var age = $.age;
__buffer.push('<!DOCTYPE html><html><head><title></title></head><body>\n\n');
__buffer.push('<div>');
__buffer.push('\n  Hi! I\'m ' + (name.toUpperCase()) + ' from ' + (city.toUpperCase()) + '!\n  ');
__buffer.push('<a href="http://' + (age) + '.fr">');
__buffer.push('my site');
__buffer.push('</a>');
__buffer.push('\n');
__buffer.push('</div>');
__buffer.push('\n\n');
__indentStack.push(indent);
__bufferLengthStack.push(__buffer.length);
for (var i = 0; i < 5; i++) {
__bufferLengthStack.push(__buffer.length);
__buffer.push(indent);
__buffer.push('<div>');
__buffer.push('\n' + indent + '  ');
__buffer.push('<span>');
__buffer.push((name + ' ' + age * i));
__buffer.push('</span>');
__buffer.push('\n' + indent + '  ');
__buffer.push('<a href="http://' + (i) + '.fr">');
__buffer.push('my site');
__buffer.push('</a>');
__buffer.push('\n' + indent);
__buffer.push('</div>');
if (__buffer.length > __bufferLengthStack.pop())
__buffer.push('\n');
}
indent = __indentStack.pop();
if (__buffer.length > __bufferLengthStack.pop())
__buffer.pop();
__buffer.push('\n\n</body></html>');
return __buffer.join('');
}