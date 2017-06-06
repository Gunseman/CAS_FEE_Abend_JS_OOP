/**
 * Food Storage
 */
const food = [];

food.push({name: "bambus", amount : 3, amountPerDelivery : 3 });
food.push({name: "grass", amount : 10, amountPerDelivery : 10 });
food.push({name: "straw", amount : 10, amountPerDelivery : 10 });
food.push({name: "beef", amount : 10, amountPerDelivery : 10, isMeet : true });
food.push({name: "chicken", amount : 10, amountPerDelivery : 10, isMeet : true });

function findByName(name) {
    return food.findByName(name);
}

function getAll() {
    return food;
}

function orderFood(food, callback) {
    setTimeout(
        function () {
            food.amount += food.amountPerDelivery;
            if (typeof(callback) === 'function') {
                callback();
            }
        }, 2000)
}

/**
 * Exposed API facilities.
 */
export default { findByName, getAll, orderFood };