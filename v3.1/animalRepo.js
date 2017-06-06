/**
 * Created by sgehrig on 03.06.2015.
 */

let animalRepo = (function() {
    "use strict";

    let animals = [];


    class Animal {
        constructor(name) {
            this.isDead = false;
            this.name = name;
            this.compatibleFood = [];
        }

        foodRequired() {
            return !this.isDead && this.isFoodRequired(this);
        }
        toString() {
            return (this.isDead ? "RIP " : '') + this.name + "[" + this.constructor.name + "]" + (this.foodRequired() ? " -hungrig" : "");
        }
        eaten() {
            this.isDead = true;
        }
        feed() {
            return this.feedAnimal();
        }
        isFoodRequired() {
            return !this.isDead && (this.nextFeedAt == null || this.nextFeedAt < +new Date());
        }
        feedAnimal(){
            for (let i = 0 ; i<this.compatibleFood.length; ++i) {
                let foodForAnimal = this.compatibleFood[i];
                let foodFound = foodStorage.findByName(foodForAnimal.name);

                if (foodFound && foodFound.amount >= foodForAnimal.amount) {
                    this.nextFeedAt = Animal.addTime(foodForAnimal.timeToNextFood);
                    foodFound.amount -= foodForAnimal.amount;
                    return true;
                }
            }
            return false;
        }
        static addTime(hours) {
            return +new Date() + hours * 10000; // new Date().setTime(new Date().getTime() + (hours*60*60*1000));
        }
    }


    class Panda extends Animal {
        constructor(name) {
            super(name);
            this.compatibleFood = [{name: "bambus", amount: 1, timeToNextFood: 1}];
        }
    }

    class Lion extends Animal{
        constructor(name) {
            super(name);
            this.compatibleFood = [{name: "beef", amount: 5, timeToNextFood: 5}, {name: "chicken",amount: 10,timeToNextFood: 1}];
        }

        feed() {
            if (!super.feedAnimal()) {
                var panda = animals.filter(function (x) {
                    return (x instanceof Panda && !x.isDead);
                });
                if (panda[0]) {
                    this.nextFeedAt = Animal.addTime(24);
                    panda[0].eaten();
                    return true;
                }
                return false;
            }
            return true;
        };
    }


    function addLion(name) {
        let lion = new Lion(name);
        animals.push(lion);
        return lion;
    }

    function addPanda(name) {
        let panda = new Panda(name);
        animals.push(panda);
        return panda;
    }

    function getAll() {
        return animals;
    }

    return {
        addLion : addLion,
        addPanda : addPanda,
        getAll : getAll
    };
})();