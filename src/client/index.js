/* global angular:true */

// Module:
import { FeaturesModule } from './features.module';

// Dependencies:
import './features/features.component';
import './parsers/feature-parser.service';
import './feature-file-structure.service';

var tractor = angular.module('tractor');
tractor.requires.push(FeaturesModule.name);

tractor.config((
    $stateProvider
) => {
    $stateProvider
    .state('tractor.features', {
        url: 'features{file:TractorFile}',
        component: 'tractorFeatures',
        resolve: {
            availableStepDefinitions (stepDefinitionFileStructureService) {
                return stepDefinitionFileStructureService.getFileStructure()
                .then(() => stepDefinitionFileStructureService.fileStructure.allFiles.filter(file => {
                    return file.extension === 'step.js';
                }));
            },
            feature ($stateParams, featureFileStructureService, featureParserService) {
                var featureUrl = $stateParams.file && $stateParams.file.url;
                if (!featureUrl) {
                    return null;
                }
                return featureFileStructureService.openItem(featureUrl)
                .then(file => featureParserService.parse(file));
            }
        }
    })
});
