// Module:
import { FeaturesModule } from '../features.module';

// Dependencies:
import '../feature-file-structure.service';
import '../step-input/step-input.directive';

// Template:
import template from './features.component.html';

// Styles:
import style from './features.component.css';

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
        '.feature'
    );
    controller.style = $sce.trustAsHtml(style.toString());

    controller.fileStyle = function () {
        return {
            'file-tree__item--feature': true
        };
    };

    controller.availableStepDefinitions = availableStepDefinitions;
    controller.debug = false;
    controller.runFeature = runFeature.bind(controller);
    controller.runnerService = runnerService;
    return controller;

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
