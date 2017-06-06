// animals list
const animals = [];
const food = [];

food.push({name: "bambus", amount : 3, amountPerDelivery : 3 });
food.push({name: "grass", amount : 10, amountPerDelivery : 10 });
food.push({name: "straw", amount : 10, amountPerDelivery : 10 });
food.push({name: "beef", amount : 10, amountPerDelivery : 10, isMeet : true });
food.push({name: "chicken", amount : 10, amountPerDelivery : 10, isMeet : true });

function addTime(hours) {
    return +new Date() + hours * 10000; // new Date().setTime(new Date().getTime() + (hours*60*60*1000));
}

function findFood(name){
    for (let i = 0; i< food.length; ++i) {
        if (food[i].name === name)
        {
            return food[i];
        }
    }
}

$(function() {


    setInterval(function(){
        showData();
    }, 10);

    function createAnimalEntry(animal,id ) { // Note: Why can't this function be inline defined?

        let oldValue = $("#animal" + id);

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

        let div = $("<div>", {id : "animal" + id});
        let span = $("<span>").text(animal.toString());
        div.append(span);
        let input = $("<input>", {value: "Feed", type: "button"});
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
        for(let i = 0; i< animals.length; ++i) {
            createAnimalEntry(animals[i],i);
        }
    }

    function createFoodEntry(food,id ) {
        let oldValue = $("#food" + id);
        if(oldValue.length> 0 )
        {
            $("span", oldValue[0]).text(food.name + "[amount: " + food.amount+" ]");
            return;
        }
        let div = $("<div>", { id: "food" + id} );
        let span = $("<span>").text(food.name + "[amount: " + food.amount+" ]").attr("data-id", id);
        let reorder = $("<input>", {value: "Order", type: "button"});
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
        for(let i = 0; i< food.length; ++i) {
            createFoodEntry(food[i],i);
        }
    }

    $("#createPanda").click(
        function() {  // creates Panda Object
            animals.push({
                type: "panda",
                name: $("#name").val(),
                foodRequired: function () {
                    return !this.isDead && (this.nextFeedAt == null || this.nextFeedAt < +new Date());
                },
                toString: function () {
                    return (this.isDead ? "RIP " : '') + this.name + "[" + this.type + "]" + (this.foodRequired() ? " -hungrig" : "");
                },
                eaten: function () {
                    this.isDead = true;
                },
                feed: function () {
                    let bambus = findFood("bambus");

                    if (bambus && bambus.amount > 0) {
                        this.nextFeedAt = addTime(1);
                        bambus.amount -= 1;
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            });
            showData();
        });

    $("#createLion").click(
        function() {
            animals.push({ // creates Lion Object
                type: "lion",
                name: $("#name").val(),
                foodRequired: function () {
                    return this.nextFeedAt == null || this.nextFeedAt < +new Date();
                },
                toString: function () {
                    return this.name + "[" + this.type + "]" + (this.foodRequired() ? " -hungrig" : "");
                },
                feed: function () {
                    let beef = findFood("beef");

                    if (beef.amount >= 5) {
                        this.nextFeedAt = addTime(4);
                        beef.amount -= 5;
                        return true;
                    }

                    let chicken = findFood("chicken");
                    if (chicken.amount >= 10) {
                        this.nextFeedAt = addTime(4);
                        chicken.amount -= 10;
                        return true;
                    }
                    let panda = animals.filter(function (x) {
                        return x.type === "panda" && !x.isDead
                    });
                    if (panda[0]) {
                        this.nextFeedAt = addTime(24);
                        panda[0].eaten();
                        return true;
                    }
                    return false;
                }
            });
            showData();
        });

    showFood();
    showData();
});