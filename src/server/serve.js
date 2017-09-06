// Utilities:
import path from 'path';
import { getConfig } from './utilities';

// Dependencies:
import { FileStructure, serveFileStructure } from 'tractor-file-structure';
import { FeatureFile } from './files/feature-file';

export default function serve (config, di) {
    config = getConfig(config);

    let { directory } = config;

    let features = path.resolve(process.cwd(), directory);
    let featuresFileStructure = new FileStructure(features);
    di.constant({ featuresFileStructure });
    featuresFileStructure.addFileType(FeatureFile);

    di.call(serveFileStructure)(featuresFileStructure, 'features');
}
serve['@Inject'] = ['config', 'di'];
