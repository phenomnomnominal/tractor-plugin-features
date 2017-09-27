/* global Set:true */

// Utilities:
import flatten from 'lodash.flatten';

// Module:
import { FeaturesModule } from '../features.module';

// Dependencies:
import './example';
import './step-declaration';

function createScenarioModelConstructor (
    StepDeclarationModel,
    ExampleModel,
    FeatureIndent,
    FeatureNewLine,
    config
) {
    let ScenarioModel = function ScenarioModel () {
        var stepDeclarations = [];
        var examples = [];

        this.scenarioTags = config.tags

        Object.defineProperties(this, {
            stepDeclarations: {
                get () {
                    return stepDeclarations;
                }
            },
            examples: {
                get () {
                    return examples;
                }
            },
            exampleVariables: {
                get () {
                    return getExampleVariables.call(this, this.stepDeclarations);
                }
            },
            featureString: {
                get () {
                    return toFeatureString.call(this);
                }
            }
        });

        this.name = '';
        [this.scenarioTag] = this.scenarioTags;
    };

    ScenarioModel.prototype.addStepDeclaration = function () {
        this.stepDeclarations.push(new StepDeclarationModel());
    };

    ScenarioModel.prototype.removeStepDeclaration = function (toRemove) {
        this.stepDeclarations.splice(this.stepDeclarations.indexOf(toRemove), 1);
    };

    ScenarioModel.prototype.addExample = function () {
        this.examples.push(new ExampleModel(this));
    };

    ScenarioModel.prototype.removeExample = function (toRemove) {
        this.examples.splice(this.examples.indexOf(toRemove), 1);
    };

    return ScenarioModel;

    function getExampleVariables (stepDeclarations) {
        let exampleVariableNames = stepDeclarations
        .map(stepDeclaration => stepDeclaration.step)
        .map(StepDeclarationModel.getExampleVariableNames);

        return Array.from(new Set(flatten(exampleVariableNames)));
    }

    function toFeatureString () {
        let scenario = 'Scenario' + (this.examples.length ? ' Outline' : '') + ': ' + this.name;

        let stepDeclarations = this.stepDeclarations.map(stepDeclaration => {
            return FeatureIndent + FeatureIndent + stepDeclaration.feature;
        });

        let scenarioTag = this.scenarioTag || '';

        let lines = [scenarioTag, scenario, stepDeclarations];

        if (this.examples.length) {
            lines.push(FeatureIndent + FeatureIndent + 'Examples:');
            let variables = '| ' + this.exampleVariables.join(' | ') + ' |';
            lines.push(FeatureIndent + FeatureIndent + FeatureIndent + variables);
            this.examples.forEach(example => lines.push(example.feature));
        }

        lines = flatten(lines);
        return lines.join(FeatureNewLine);
    }
}

FeaturesModule.factory('ScenarioModel', createScenarioModelConstructor);
