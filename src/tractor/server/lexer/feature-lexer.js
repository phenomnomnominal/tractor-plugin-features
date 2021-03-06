// Constants:
const IN_ORDER_TO = /^In order to /;
const AS_A = /^As a /;
const I_WANT = /^I want /;

export class FeatureLexer {
    constructor () {
        this.features = [];
        this.tags = [];

        /* eslint-disable camelcase */
        /* istanbul ignore next */
        this.comment = this.doc_string = this.examples = this.eof = () => {};
        /* eslint-enable camelcase */
    }

    get lastFeature () {
        return this.features[this.features.length - 1];
    }
    get lastElement () {
        let lastFeature = this.lastFeature;
        return lastFeature && lastFeature.elements && lastFeature.elements[lastFeature.elements.length - 1];
    }

    feature (type, name, description) {
        let [inOrderTo, asA, iWant] = description.split(/\n/);
        inOrderTo = inOrderTo.replace(IN_ORDER_TO, '').replace(/\r/g, '');
        asA = asA.replace(AS_A, '').replace(/\r/g, '');
        iWant = iWant.replace(I_WANT, '');

        let feature = { type, name, inOrderTo, asA, iWant, elements: [], tags: this.tags };
        this.tags = [];
        this.features.push(feature);
    }

    background (type, name, description) {
        let background = { type, name, description, examples: [], stepDeclarations: [], tags: this.tags };
        this.tags = [];
        this.lastFeature.elements.push(background);
    }

    scenario (type, name, description) {
        let scenario = { type, name, description, examples: [], stepDeclarations: [], tags: this.tags };
        this.tags = [];
        this.lastFeature.elements.push(scenario);
    }

    /* eslint-disable camelcase */
    scenario_outline (type, name, description) {
        let scenario_outline = { type, name, description, examples: [], stepDeclarations: [], tags: this.tags };
        this.tags = [];
        this.lastFeature.elements.push(scenario_outline);
    }
    /* eslint-enable camelcase */

    row (row) {
        if (this.lastElement.variables) {
            this.lastElement.examples.push(row);
        } else {
            this.lastElement.variables = row;
        }
    }

    step (type, step) {
        type = type.replace(/ $/, '');
        let stepDeclaration = { type, step };
        this.lastElement.stepDeclarations.push(stepDeclaration);
    }

    tag (value) {
        if (!this.tags.includes(value)) {
            this.tags.push(value);
        }
    }

    done () {
        return this.features;
    }
}
