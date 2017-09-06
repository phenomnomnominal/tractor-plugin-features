// Constants:
const DEFAULT_DIRECTORY = './tractor/features';

export function getConfig (config) {
    config.features = config.features || {};
    let { features } = config;
    features.directory = features.directory || DEFAULT_DIRECTORY;
    return features;
}
