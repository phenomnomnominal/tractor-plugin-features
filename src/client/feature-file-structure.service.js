// Module:
import { FeaturesModule } from './features.module';

FeaturesModule.factory('featureFileStructureService', fileStructureServiceFactory => {
    return fileStructureServiceFactory('features');
});
