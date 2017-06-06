/**
 * Array Utilities
 */
Array.prototype.findByName = function(name) {
    name = String(name);
    for (let i = 0; i< this.length; ++i) {
        if (this[i].name === name)
        {
            return this[i];
        }
    }
};