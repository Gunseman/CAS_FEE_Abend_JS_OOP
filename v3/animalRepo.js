/**
 * Created by sgehrig on 03.06.2015.
 */

var animalRepo = (function() {

    var animals = [];


    function Animal() {
        this.isDead = false;
        this.name = "";
        this.compatibleFood = [];
    }
    Animal.prototype.foodRequired = function () {
        return !this.isDead && this.isFoodRequired(this);
    };
    Animal.prototype.toString = function () {
        return (this.isDead ? "RIP " : '') + this.name + "[" + this.constructor.name + "]" + (this.foodRequired() ? " -hungrig" : "");
    };
    Animal.prototype.eaten = function () {
        this.isDead = true;
    };
    Animal.prototype.feed = function () {
        return this.feedAnimal();
    };
    Animal.prototype.isFoodRequired = function () {
        return !this.isDead && (this.nextFeedAt == null || this.nextFeedAt < +new Date());
    };
    Animal.prototype.feedAnimal = function () {
        for (var i = 0; i < this.compatibleFood.length; ++i) {
            var foodForAnimal = this.compatibleFood[i];
            var foodFound = foodStorage.findByName(foodForAnimal.name);

            if (foodFound && foodFound.amount >= foodForAnimal.amount) {
                this.nextFeedAt = this.addTime(foodForAnimal.timeToNextFood);
                foodFound.amount -= foodForAnimal.amount;
                return true;
            }
        }
        return false;
    };
    Animal.prototype.addTime = function (hours) {
        return +new Date() + hours * 10000; // new Date().setTime(new Date().getTime() + (hours*60*60*1000));
    }


    function Panda(name) {
        this.name = name;
        this.compatibleFood = [{name: "bambus", amount: 1, timeToNextFood: 1}];
    }
    Panda.prototype = new Animal();
    Panda.prototype.constructor = Panda;


    function Lion(name) {
        this.name = name;
        this.compatibleFood = [{name: "beef", amount: 5, timeToNextFood: 5}, {
            name: "chicken",
            amount: 10,
            timeToNextFood: 1
        }];
    }
    Lion.prototype = new Animal();
    Lion.prototype.constructor = Lion;

    Lion.prototype.feed = function () {
        if (!Animal.prototype.feedAnimal.apply(this)) {
            var panda = animals.filter(function (x) {
                return (x instanceof Panda && !x.isDead);
            });
            if (panda[0]) {
                this.nextFeedAt = this.addTime(24);
                panda[0].eaten();
                return true;
            }
            return false;
        }
        return true;
    };


    function publicAddLion(name) {
        var lion = new Lion(name);
        animals.push(lion);
        return lion;
    }

    function publicAddPanda(name) {
        var panda = new Panda(name);
        animals.push(panda);
        return panda;
    }

    function publicGetAll() {
        return animals;
    }

    return {
        addLion : publicAddLion,
        addPanda : publicAddPanda,
        getAll : publicGetAll
    };
})();