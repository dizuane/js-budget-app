var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calculatePercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
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
        },
        budget: 0,
        percentage: -1
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.items[type].forEach(function (curr) {
            sum += curr.value;
        });

        data.totals[type] = sum;
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
        },
        deleteItem: function (type, id) {
            var ids, index;

            ids = data.items[type].map(function (curr) {
                return curr.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.items[type].splice(index, 1);
            }
        },
        calculateBudget: function () {
            calculateTotal('exp');
            calculateTotal('inc');

            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.percentage = -1;
            }
        },
        calculatePercentages: function () {
            data.items.exp.forEach(function (curr) {
                curr.calculatePercentage(data.totals.inc);
            });
        },
        getPercentages: function () {
            var allPercentages = data.items.exp.map(function (curr) {
                return curr.getPercentage();
            });

            return allPercentages;
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        testing: function () {
            console.log(data);
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--date'

    }

    var formatNumber = function (type, num) {
        var numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        dec = numSplit[1];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //inc == +, exp == -
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        addListItem: function (obj, type) {
            var html, element;

            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%">';
                html += '<div class="item__description">%description%</div>';
                html += '<div class="right clearfix">';
                html += '<div class="item__value">%value%</div>';
                html += '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>';
                html += '</div>';
                html += '</div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%">';
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
            newHtml = newHtml.replace('%value%', formatNumber(type, obj.value));

            document.querySelector(element).insertAdjacentHTML('beforeEnd', newHtml);

        },
        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearFields: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },
        displayBudget: function (obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(type, obj.budget);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber('inc', obj.totalInc);
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber('exp', obj.totalExp);

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },
        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel);

            var nodeListForEach = function (nodeList, callback) {
                for (var i = 0; i < nodeList.length; i++) {
                    callback(nodeList[i], i);
                }
            };

            nodeListForEach(fields, function (curr, index) {
                if (percentages[index] > 0) {
                    curr.textContent = percentages[index] + '%';
                } else {
                    curr.textContent = '---';
                }
            });
        },
        displayDate: function () {
            var now, year, months, month;

            now = new Date();
            year = now.getFullYear();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();

            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;


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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function () {
        budgetCtrl.calculateBudget();
        var budget = budgetCtrl.getBudget();
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function () {
        budgetCtrl.calculatePercentages();

        var percentages = budgetCtrl.getPercentages();

        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function () {
        var input, newItem;
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();

            updateBudget();
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;

        // Needs to be refactored but, for now, since we've hard-coded the html that is generated per item,
        // we can hard-code the traversal without issue.
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            budgetCtrl.deleteItem(type, ID);
            UICtrl.deleteListItem(itemID);
            updateBudget();
            updatePercentages();
        }
    };

    return {
        init: function () {
            console.log('Application started');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            UICtrl.displayDate();
            setupEventListeners();
        }
    };
})(budgetController, UIController);

controller.init();