// Utilities:
import { camel } from 'change-case';

// Module:
import { FeaturesModule } from '../features.module';

// Template:
import template from './step-input.html';

// Dependencies:
import './example-name.validator';
import './step-input.controller';

function StepInputDirective () {
    return {
        restrict: 'E',

        scope: {
            model: '=',
            label: '@',
            example: '@',
            availableStepDefinitions: '='
        },

        template,
        link,

        controller: 'StepInputController',
        controllerAs: 'stepInput',
        bindToController: true
    };

    function link ($scope, $element, $attrs) {
        if ($scope.stepInput.model == null) {
            throw new Error('The "tractor-step-input" directive requires a "model" attribute.');
        }

        if ($scope.stepInput.label == null) {
            throw new Error('The "tractor-step-input" directive requires a "label" attribute.');
        }

        if ($attrs.form == null) {
            throw new Error('The "tractor-step-input" directive requires a "form" attribute.');
        }

        $scope.stepInput.form = $scope.$parent[$attrs.form];
        $scope.stepInput.id = Math.floor(Math.random() * Date.now());
        $scope.stepInput.property = camel($scope.stepInput.label);

        $scope.handleKeyDown = event => {
            if (event.keyCode === 40) {
                event.preventDefault();
                if ($scope.selectedIndex !== $scope.stepInput.items.length - 1) {
                    $scope.selectedIndex += 1;
                }
            }
            else if (event.keyCode === 38) {
                event.preventDefault();
                if ($scope.selectedIndex !== 0) {
                    $scope.selectedIndex -= 1;
                }
            }
            else if (event.keyCode === 27) {
                $scope.stepInput.isOpen = false;
            }
        }
    }
};

FeaturesModule.directive('tractorStepInput', StepInputDirective);
