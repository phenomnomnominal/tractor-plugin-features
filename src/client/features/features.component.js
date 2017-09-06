// Module:
import { FeaturesModule } from '../features.module';

// Dependencies:
import '../feature-file-structure.service';
import '../step-input/step-input.directive';

// Template:
import template from './features.component.html';

// Styles:
import style from './features.component.css';

// Constants:
const STEP_TYPES = ['Given', 'When', 'Then', 'And', 'But'];
const STEPS_NAME_REGEX = new RegExp(`(${STEP_TYPES.join('|')}) `);

function FeaturesController (
    $http,
    $sce,
    $scope,
    $state,
    $window,
    confirmDialogService,
    featureFileStructureService,
    fileEditorControllerFactory,
    persistentStateService,
    notifierService,
    runnerService,
    FeatureModel
) {
    let { availableStepDefinitions, feature } = $scope.$parent.$resolve;
    let controller = new fileEditorControllerFactory(
        $scope,
        $window,
        $state,
        confirmDialogService,
        featureFileStructureService,
        persistentStateService,
        notifierService,
        FeatureModel,
        feature,
        'features',
        '.feature'
    );
    controller.style = $sce.trustAsHtml(style.toString());

    controller.availableStepDefinitions = availableStepDefinitions;
    controller.debug = false;
    controller.findStep = findStep.bind(controller);
    controller.runFeature = runFeature.bind(controller);
    controller.runnerService = runnerService;
    return controller;

    function findStep (stepDeclaration) {
        return this.availableStepDefinitions.find(stepDefinition => {
            return stepDefinition.meta.name.replace(STEPS_NAME_REGEX, '') === stepDeclaration.step;
        });
    }

    function runFeature (toRun) {
        if (toRun){
            this.runnerService.runProtractor({
                feature: toRun,
                debug: this.debug
            });
        }
    }
}

FeaturesModule.component('tractorFeatures', {
    controller: FeaturesController,
    template
});
