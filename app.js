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

    return {
        addItem: function (type, description, value) {
            var newItem, id;

            if (data.items[type].length > 0) {
                id = data.items[type][data.items[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            if (type === 'exp') {
                newItem = new Expense(id, description, value)
            } else if (type === 'inc') {
                newItem = new Income(id, description, value)
            }

            data.items[type].push(newItem);
            return newItem;
        }
    };
})();

var UIController = (function () {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'

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
        addListItem: function (obj, type) {
            var html, element;

            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%">';
                html += '<div class="item__description">%description%</div>';
                html += '<div class="right clearfix">';
                html += '<div class="item__value">%value%</div>';
                html += '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>';
                html += '</div>';
                html += '</div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%">';
                html += '<div class="item__description">%description%</div>';
                html += '<div class="right clearfix">';
                html += '<div class="item__value">%value%</div>';
                html += '<div class="item__percentage">21%</div>';
                html += '<div class="item__delete">';
                html += '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeEnd', newHtml);

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
        var input, newItem;
        input = UICtrl.getInput();

        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        UICtrl.addListItem(newItem, input.type);

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