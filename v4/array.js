/**
 * Array Utilities
 */
Array.prototype.findByName = function(name) {
    for(var i = 0; i< this.length; ++i) {
        if( this[i].name == name)
        {
            return this[i];
        }
    }
};