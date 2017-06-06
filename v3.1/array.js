/**
 * Array Utilities
 */
Array.prototype.findByName = function(name) {
    name = String(name);
    return this.find(i => i.name === name);
};