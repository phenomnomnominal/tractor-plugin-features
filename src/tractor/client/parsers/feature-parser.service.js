// Utilities:
import assert from 'assert';

// Module:
import { FeaturesModule } from '../features.module';

// Dependencies:
import '../models/feature';
import './scenario-parser.service';

function FeatureParserService (
    FeatureModel,
    scenarioParserService
) {
    return { parse };

    function parse (featureFile) {
        try {
            let feature = new FeatureModel({
                isSaved: true,
                url: featureFile.url
            });

            let [featureTokens] = featureFile.tokens;
            feature.name = featureTokens.name;
            feature.inOrderTo = featureTokens.inOrderTo;
            feature.asA = featureTokens.asA;
            feature.iWant = featureTokens.iWant;
            if (featureTokens.tags.length) {
                [feature.featureTag] = featureTokens.tags;
            }

            featureTokens.elements.forEach((element, index) => {
                try {
                    let parsedScenario = scenarioParserService.parse(feature, element);
                    assert(parsedScenario);
                    feature.scenarios.push(parsedScenario);
                    return;
                // eslint-disable-next-line no-empty
                } catch (e) { }

                // eslint-disable-next-line no-console
                console.warn('Invalid Feature:', element, index);
            });

            return feature;
        } catch (e) {
            return new FeatureModel();
        }
    }
}

FeaturesModule.service('featureParserService', FeatureParserService);
