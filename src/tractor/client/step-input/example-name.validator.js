// Module:
import { FeaturesModule } from '../features.module';

// Dependencies:
import '../models/step-declaration';

function ExampleNameValidator (
    StepDeclarationModel,
    validationService
) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: link
    };

    function link ($scope, $element, $attrs, ngModelController) {
        ngModelController.$validators.exampleName = value => {
            let variableNames = StepDeclarationModel.getExampleVariableNames(value);
            return variableNames.filter(variableName => {
                return validationService.validateVariableName(variableName);
            }).length === variableNames.length;
        };
    }
}

FeaturesModule.directive('exampleName', ExampleNameValidator);
