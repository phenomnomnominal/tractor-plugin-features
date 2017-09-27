// Module:
import { FeaturesModule } from '../features.module';

// Constants:
const STEP_TYPES = ['Given', 'When', 'Then', 'And', 'But'];
const STEPS_NAME_REGEX = new RegExp(`(${STEP_TYPES.join('|')}) `);

function StepInputController (
    $scope
) {
    $scope.$watch(() => this.availableStepDefinitions, () => {
        if (this.availableStepDefinitions) {
            this.stepNames = this.availableStepDefinitions.map(function (stepDefinition) {
                return stepDefinition.meta.name.replace(STEPS_NAME_REGEX, '');
            });
            this.stepNamesLowerCase = this.stepNames.map(function (stepName) {
                return stepName.toLowerCase();
            });
        }
    });

    this.isOpen = false;
}

StepInputController.prototype.handleSearch = function (searchKey) {
    if (searchKey) {
        this.searchKey = searchKey;
        this.items = getSuggestions.call(this);
    }
    this.isOpen = !!searchKey;
    this.hasMore = this.items.length > 10;
 };

StepInputController.prototype.itemSelected = function (index) {
    this.model.step = this.items[index];
    this.isOpen = false;
};

function getSuggestions () {
    var items = [];
    var searchKey = this.searchKey.toLowerCase();
    var steps = this.stepNamesLowerCase.length;
    for (var i = 0; i < steps; i += 1) {
        if (this.stepNamesLowerCase[i].indexOf(searchKey) >= 0) {
            items.push(this.stepNames[i]);
        }
        if (items.length === 11) {
            break;
        }
    }
    return items;
}

FeaturesModule.controller('StepInputController', StepInputController);
