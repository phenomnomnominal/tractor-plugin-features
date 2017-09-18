// Module:
import { FeaturesModule } from '../features.module';

// Dependencies
import '../models/step-declaration';

function StepDeclarationParserService (
    StepDeclarationModel
) {
    return { parse };

    function parse (tokens) {
        let stepDeclaration = new StepDeclarationModel();

        stepDeclaration.type = tokens.type;
        stepDeclaration.step = tokens.step;

        return stepDeclaration;
    }
}

FeaturesModule.service('stepDeclarationParserService', StepDeclarationParserService);
