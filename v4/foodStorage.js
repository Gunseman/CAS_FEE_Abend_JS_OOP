/**
 * Food Storage
 */
var foodStorage = (function() {
    "use strict";

    var food = [];

    food.push({name: "bambus", amount : 3, amountPerDelivery : 3 });
    food.push({name: "grass", amount : 10, amountPerDelivery : 10 });
    food.push({name: "straw", amount : 10, amountPerDelivery : 10 });
    food.push({name: "beef", amount : 10, amountPerDelivery : 10, isMeet : true });
    food.push({name: "chicken", amount : 10, amountPerDelivery : 10, isMeet : true });

    function publicFindByName(name) {
        return food.findByName(name);
    }

    function publicGetAll() {
        return food;
    }

    function publicOrderFood(food, callback) {
        setTimeout(
            function () {
                food.amount += food.amountPerDelivery;
                if (typeof(callback) === 'function') {
                    callback();
                }
            }, 2000)
    }

    return {
        findByName : publicFindByName,
        getAll : publicGetAll,
        orderFood : publicOrderFood
    };
}());