// Utilities:
import flatten from 'lodash.flatten';

// Module:
import { FeaturesModule } from '../features.module';

// Dependencies:
import './scenario';

function createFeatureModelConstructor (
    ScenarioModel,
    FeatureIndent,
    FeatureNewLine,
    config
) {
    let FeatureModel = function FeatureModel (options) {
        let scenarios = [];

        this.featureTags = config.tags;

        Object.defineProperties(this, {
            isSaved: {
                get () {
                    return !!(options && options.isSaved);
                }
            },
            file: {
                get () {
                    return options && options.file;
                }
            },
            scenarios: {
                get () {
                    return scenarios;
                }
            },
            featureString: {
                get () {
                    return toFeatureString.call(this);
                }
            },
            data: {
                get () {
                    return this.featureString;
                }
            }
        });

        this.name = '';
        this.inOrderTo = '';
        this.asA = '';
        this.iWant = '';
        [this.featureTag] = this.featureTags;
    };

    FeatureModel.prototype.addScenario = function () {
        this.scenarios.push(new ScenarioModel());
    };

    FeatureModel.prototype.removeScenario = function (toRemove) {
        this.scenarios.splice(this.scenarios.indexOf(toRemove), 1);
    };

    return FeatureModel;

    function toFeatureString () {
        let featureTag = this.featureTag || '';
        let feature = 'Feature: ' + this.name;

        let inOrderTo = FeatureIndent + 'In order to ' + this.inOrderTo;
        let asA = FeatureIndent + 'As a ' + this.asA;
        let iWant = FeatureIndent + 'I want ' + this.iWant;

        let scenarios = this.scenarios.map(scenario => FeatureIndent + scenario.featureString);

        let lines = flatten([featureTag, feature, inOrderTo, asA, iWant, scenarios]);
        return lines.join(FeatureNewLine);
    }
}

FeaturesModule.factory('FeatureModel', createFeatureModelConstructor);
