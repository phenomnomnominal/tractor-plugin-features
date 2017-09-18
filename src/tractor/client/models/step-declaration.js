// Utilities:
import memoize from 'lodash.memoize';

// Module:
import { FeaturesModule } from '../features.module';

function createStepDeclarationModelConstructor () {
    let StepDeclarationModel = function StepDeclarationModel () {
        Object.defineProperties(this, {
            feature: {
                get () {
                    return toFeature.call(this);
                }
            }
        });

        [this.type] = this.types;
        this.step = '';
    };

    StepDeclarationModel.prototype.types = ['Given', 'When', 'Then', 'And', 'But'];

    StepDeclarationModel.getExampleVariableNames = memoize(step => {
        let variables = step.match(new RegExp('<.+?>', 'g')) || [];
        return variables.map(result => result.replace(/^</, '').replace(/>$/, ''));
    });

    return StepDeclarationModel;

    function toFeature () {
        return this.type + ' ' + this.step;
    }
}

FeaturesModule.factory('StepDeclarationModel', createStepDeclarationModelConstructor);
