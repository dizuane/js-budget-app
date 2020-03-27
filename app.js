var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        items: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

})();

var UIController = (function () {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'

    }
    return {
        getInput: function () {
            var type = document.querySelector(DOMStrings.inputType).value; //inc == +, exp == -
            var description = document.querySelector(DOMStrings.inputDescription).value;
            var value = document.querySelector(DOMStrings.inputValue).value;

            return {
                'type': type,
                'description': description,
                'value': value
            };
        },
        getDOMStrings: function () {
            return DOMStrings;
        }
    };
})();

var controller = (function (budgetCtrl, UICtrl) {
    var setupEventListeners = function () {
        var DOM = UIController.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (e) {
            // 13 = Return key
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
    };
    var ctrlAddItem = function () {
        var input = UICtrl.getInput();

        // TODO: Add item to the budget controller

        // TODO: Add new item to UI

        // TODO: Calculate budget

        // TODO: Display budget
    };

    return {
        init: function () {
            console.log('Application started');
            setupEventListeners();
        }
    };
})(budgetController, UIController);

controller.init();