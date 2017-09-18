// Dependencies:
import path from 'path';
import { createDir } from 'tractor-file-structure';
import { warn } from 'tractor-logger';

// Errors:
import { TractorError } from 'tractor-error-handler';

export function init (config) {
    let featuresDirectoryPath = path.resolve(process.cwd(), config.features.directory);

    return createDir(featuresDirectoryPath)
    .catch(TractorError.isTractorError, error => warn(`${error.message} Moving on...`));
}
init['@Inject'] = ['config'];
