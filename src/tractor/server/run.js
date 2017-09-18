// Dependencies:
import { setStepDefinitionsFileStructure } from './generator/generate-step-definition-files';

export function run (
    featuresFileStructure,
    stepDefinitionsFileStructure
) {
    setStepDefinitionsFileStructure(stepDefinitionsFileStructure);

    return featuresFileStructure.read();
}
run['@Inject'] = ['featuresFileStructure', 'stepDefinitionsFileStructure'];
