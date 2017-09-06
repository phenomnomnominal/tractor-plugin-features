// Module:
import { FeaturesModule } from '../features.module';

function createExampleModelConstructor (
    stringToLiteralService,
    FeatureIndent
) {
    let ExampleModel = function ExampleModel (scenario) {
        let values = {};

        Object.defineProperties(this, {
            scenario: {
                get () {
                    return scenario;
                }
            },
            values: {
                get () {
                    this.scenario.exampleVariables.forEach(exampleVariable => {
                        values[exampleVariable] = values[exampleVariable] || {
                            value: ''
                        };
                    });
                    return values;
                }
            },
            feature: {
                get () {
                    return toFeature.call(this);
                }
            }
        });
    };

    return ExampleModel;

    function toFeature () {
        var values = '| ' + this.scenario.exampleVariables.map(variable => {
           var value = this.values[variable].value;
           var literal = stringToLiteralService.toLiteral(value);
           return literal !== undefined ? literal : '"' + value + '"';
        }, this).join(' | ') + ' |';
        return FeatureIndent + FeatureIndent + FeatureIndent + values;
    }
}

FeaturesModule.factory('ExampleModel', createExampleModelConstructor);
