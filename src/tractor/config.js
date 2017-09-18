// Constants:
const DEFAULT_DIRECTORY = './tractor/features';

export function config (tractorConfig) {
    tractorConfig.features = tractorConfig.features || {};
    let { features } = tractorConfig;
    features.directory = features.directory || DEFAULT_DIRECTORY;
    return features;
}
