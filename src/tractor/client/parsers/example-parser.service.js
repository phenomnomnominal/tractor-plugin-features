// Module:
import { FeaturesModule } from '../features.module';

// Dependencies:
import '../models/example';

function ExampleParserService (
    ExampleModel
) {
    return { parse };

    function parse (scenario, tokens) {
        let example = new ExampleModel(scenario);

        scenario.exampleVariables.forEach((variable, index) => {
            example.values[variable] = tokens[index].replace(/^"/, '').replace(/"$/, '');
        });

        return example;
    }
};

FeaturesModule.service('exampleParserService', ExampleParserService);
