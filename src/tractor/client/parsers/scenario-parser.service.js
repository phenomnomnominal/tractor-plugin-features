// Utilities:
import assert from 'assert';

// Module:
import { FeaturesModule } from '../features.module';

// Dependencies:
import '../models/scenario';
import './example-parser.service';
import './step-declaration-parser.service';

function ScenarioParserService (
    stepDeclarationParserService,
    exampleParserService,
    ScenarioModel
) {
    return { parse };

    function parse (feature, tokens) {
        var scenario = new ScenarioModel();

        scenario.name = tokens.name;
        if (tokens.tags.length) {
            [scenario.scenarioTag] = tokens.tags;
        }

        tokens.stepDeclarations.forEach((stepDeclaration, index) => {
            let notStep = false;

            try {
                let parsedStepDeclaration = stepDeclarationParserService.parse(stepDeclaration);
                assert(parsedStepDeclaration);
                scenario.stepDeclarations.push(parsedStepDeclaration);
            } catch (e) {
                notStep = true;
            }

            if (notStep) {
                // eslint-disable-next-line no-console
                console.log(stepDeclaration, index);
            }
        });

        tokens.examples.forEach((example, index) => {
            let notExample = false;

            try {
                let parsedExample = exampleParserService.parse(scenario, example);
                assert(parsedExample);
                scenario.examples.push(parsedExample);

            } catch (e) {
                notExample = true;
            }

            if (notExample) {
                // eslint-disable-next-line no-console
                console.log(example, index);
            }
        });

        return scenario;
    }
}

FeaturesModule.service('scenarioParserService', ScenarioParserService);
