;(function($, window, document, undefined) {

    "use strict";

    $(function () {

        setInterval(function () {
            showData();
        }, 10);


        function createAnimalEntry(animal, id) { // Note: Why can't this function be inline defined?

            var oldValue = $("#animal" + id);

            if (oldValue.length > 0) {
                $("span", oldValue[0]).text(animal.toString());
                if (animal.foodRequired()) {
                    $("input", oldValue).show();
                }
                else {
                    $("input", oldValue).hide();
                }
                return;
            }

            var div = $("<div>", {id: "animal" + id});
            var span = $("<span>").text(animal.toString());
            div.append(span);
            var input = $("<input>", {value: "Feed", type: "button"});
            input.click(function () {
                if (animal.feed()) {
                    showFood();
                    showData();
                }
                else {
                    input.val("No foood!");
                }
            });
            div.append(input);
            if (animal.foodRequired()) {
                input.show();
            }
            else {
                input.hide();
            }

            $("#containerAnimals").append(div);

        }

        function showData() {
            for (var i = 0; i < animalRepo.getAll().length; ++i) {
                createAnimalEntry(animalRepo.getAll()[i], i);
            }
        }

        function createFoodEntry(food, id) { //Note: Why can't this function be inline defined?
            var oldValue = $("#food" + id);
            if (oldValue.length > 0) {
                $("span", oldValue[0]).text(food.name + "[amount: " + food.amount + " ]");
                return;
            }
            var div = $("<div>", {id: "food" + id});
            var span = $("<span>").text(food.name + "[amount: " + food.amount + " ]").attr("data-id", id);
            var reorder = $("<input>", {value: "Order", type: "button"});

            reorder.click(function () {
                reorder.prop("disabled", true);
                foodStorage.orderFood(food, function () {
                    span.text(food.name + "[amount: " + food.amount + " ]");
                    reorder.prop("disabled", false);
                });
            });
            div.append(span);
            div.append(reorder);
            $("#containerFood").append(div);

        }

        function showFood() {
            var food = foodStorage.getAll();
            for (var i = 0; i < food.length; ++i) {
                createFoodEntry(food[i], i);
            }
        }

        $("#createPanda").click(
            function () {  // creates Panda Object
                animalRepo.addPanda($("#name").val());
                showData();
            });

        $("#createLion").click(
            function () { // creates Lion Object
                animalRepo.addLion($("#name").val());
                showData();
            });

        showFood();
        showData();
    });

})(jQuery, window, document);