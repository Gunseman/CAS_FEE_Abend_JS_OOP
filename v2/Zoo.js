"use strict";

var animals = [];
var food = [];

food.push({name: "bambus", amount : 3, amountPerDelivery : 3 });
food.push({name: "grass", amount : 10, amountPerDelivery : 10 });
food.push({name: "straw", amount : 10, amountPerDelivery : 10 });
food.push({name: "beef", amount : 10, amountPerDelivery : 10, isMeet : true });
food.push({name: "chicken", amount : 10, amountPerDelivery : 10, isMeet : true });


Array.prototype.findByName = function(name) {
    for(var i = 0; i< this.length; ++i) {
        if( this[i].name == name)
        {
            return this[i];
        }
    }
};


function Animal() {
    this.isDead = false;
    this.name = "";
    this.compatibleFood = [ ];
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
Animal.prototype.isFoodRequired = function() {
    return !this.isDead && (this.nextFeedAt == null || this.nextFeedAt < +new Date());
};
Animal.prototype.feedAnimal = function(){
    for(var i = 0 ; i<this.compatibleFood.length; ++i) {
        var foodForAnimal = this.compatibleFood[i];
        var foodFound = food.findByName(foodForAnimal.name);

        if (foodFound && foodFound.amount >= foodForAnimal.amount) {
            this.nextFeedAt = addTime(foodForAnimal.timeToNextFood);
            foodFound.amount -= foodForAnimal.amount;
            return true;
        }
    }
    return false;
};


function Panda(name) {
    this.name = name;
    this.compatibleFood = [{name:"bambus", amount: 1, timeToNextFood : 1}];
}
Panda.prototype = new Animal();
Panda.prototype.constructor = Panda;

function Lion(name) {
    this.name = name;
    this.compatibleFood = [{name:"beef", amount: 5, timeToNextFood : 5}, {name:"chicken", amount: 10, timeToNextFood : 1}];
}
Lion.prototype = new Animal();
Lion.prototype.constructor = Lion;

Lion.prototype.feed =function () {
    if (!Animal.prototype.feedAnimal.apply(this)) {
        var panda = animals.filter(function (x) { return (x instanceof Panda && !x.isDead); });
        if (panda[0]) {
            this.nextFeedAt = addTime(24);
            panda[0].eaten();
            return true;
        }
        return false;
    }
    return true;
};


function createLion(name) {
    return new Lion(name);
}

function createPanda(name) {
    return new Panda(name);
}



function addTime(hours) {
    return +new Date() + hours * 10000; // new Date().setTime(new Date().getTime() + (hours*60*60*1000));
}


$(function() {
    "use strict";

    setInterval(function(){
        showData();
    }, 10);



    function createAnimalEntry(animal,id ) { // Note: Why can't this function be inline defined?

        var oldValue = $("#animal" + id);

        if (oldValue.length> 0 ) {
            $("span", oldValue[0]).text(animal.toString());
            if(animal.foodRequired()) {
                $("input", oldValue).show();
            }
            else
            {
                $("input", oldValue).hide();
            }
            return;
        }

        var div = $("<div>", {id : "animal" + id});
        var span = $("<span>").text(animal.toString());
        div.append(span);
        var input = $("<input>", {value: "Feed", type: "button"});
        input.click(function () {
            if (animal.feed()) {
                showFood();
                showData();
            }
            else
            {
                input.val("No foood!");
            }
        });
        div.append(input);
        if(animal.foodRequired()) {
            input.show();
        }
        else
        {
            input.hide();
        }

        $("#containerAnimals").append(div);

    }

    function showData(){
        for(var i = 0; i< animals.length; ++i) {
            createAnimalEntry(animals[i],i);
        }
    }

    function createFoodEntry(food,id ) { //Note: Why can't this function be inline defined?
        var oldValue = $("#food" + id);
        if(oldValue.length> 0 )
        {
            $("span", oldValue[0]).text(food.name + "[amount: " + food.amount+" ]");
            return;
        }
        var div = $("<div>", { id: "food" + id} );
        var span = $("<span>").text(food.name + "[amount: " + food.amount+" ]").attr("data-id", id);
        var reorder = $("<input>", {value: "Order", type: "button"});
        reorder.click(function() {
            reorder.prop("disabled", true);
            setTimeout(
                function () {
                    food.amount += food.amountPerDelivery;
                    span.text(food.name + "[amount: " + food.amount + " ]");
                    reorder.prop("disabled", false);
                }, 2000)
        });
        div.append(span);
        div.append(reorder);
        $("#containerFood").append(div);

    }

    function showFood(){
        for(var i = 0; i< food.length; ++i) {
            createFoodEntry(food[i],i);
        }
    }

    $("#createPanda").click(
        function() {  // creates Panda Object
            animals.push(createPanda($("#name").val()));
            showData();
        });

    $("#createLion").click(
        function() { // creates Lion Object
            animals.push(createLion($("#name").val()));
            showData();
        });

    showFood();
    showData();
});