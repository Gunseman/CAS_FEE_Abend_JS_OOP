"use strict";

var animals = [];
var food = [];

food.push({name: "bambus", amount : 3, amountPerDelivery : 3 });
food.push({name: "grass", amount : 10, amountPerDelivery : 10 });
food.push({name: "straw", amount : 10, amountPerDelivery : 10 });
food.push({name: "beef", amount : 10, amountPerDelivery : 10, isMeet : true });
food.push({name: "chicken", amount : 10, amountPerDelivery : 10, isMeet : true });


function printAnimal(animal) {
    return animal.name + "[" + animal.type + "]" + (animal.foodRequired() ? " -hungrig" : "");
}

function isFoodRequired(animal) {
    return animal.nextFeedAt == null || animal.nextFeedAt < +new Date();
}

function findFood(name){
    for(var i = 0; i< food.length; ++i) {
        if( food[i].name == name)
        {
            return food[i];
        }
    }
}

function addTime(hours) {
    return +new Date() + hours * 10000; // new Date().setTime(new Date().getTime() + (hours*60*60*1000));
}

function feedAnimal( animal ){
    for(var i = 0 ; i<animal.compatibleFood.length; ++i) {
        var food = animal.compatibleFood[i];
        var foodFound = findFood(food.name);

        if (foodFound && foodFound.amount >= food.amount) {
            animal.nextFeedAt = addTime(food.timeToNextFood);
            foodFound.amount -= food.amount;
            return true;
        }
    }
    return false;
}

function createLion(name) {
    return {
        type: "lion",
        name: name,
        compatibleFood : [{name:"beef", amount: 5, timeToNextFood : 5}, {name:"chicken", amount: 10, timeToNextFood : 1}],
        foodRequired: function () {
            return isFoodRequired(this);
        },
        toString: function () {
            return printAnimal(this);
        },
        feed: function () {
            if(!feedAnimal(this)) {
                var panda = animals.filter(function (x) { return x.type === "panda" && !x.isDead });
                if (panda[0]) {
                    this.nextFeedAt = addTime(24);
                    panda[0].eaten();
                    return true;
                }
            }
            return true;
        }
    };
}

function createPanda(name) {
    return {
        type: "panda",
        name: name,
        compatibleFood : [{name:"bambus", amount: 1, timeToNextFood : 1}],
        foodRequired: function () {
            return !this.isDead && isFoodRequired(this);
        },
        toString: function () {
            return (this.isDead ? "RIP " : '') + printAnimal(this);
        },
        eaten: function () {
            this.isDead = true;
        },
        feed: function () {
            return feedAnimal(this);
        }
    };
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