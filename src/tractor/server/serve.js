// Dependencies:
import path from 'path';
import { FileStructure, serveFileStructure } from 'tractor-file-structure';
import { FeatureFile } from './files/feature-file';

export function serve (config, di) {
    let featuresDirectoryPath = path.resolve(process.cwd(), config.features.directory);

    let featuresFileStructure = new FileStructure(featuresDirectoryPath);
    featuresFileStructure.addFileType(FeatureFile);

    di.constant({ featuresFileStructure });
    di.call(serveFileStructure)(featuresFileStructure, 'features');
}
serve['@Inject'] = ['config', 'di'];
