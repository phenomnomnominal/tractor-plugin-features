/* global describe:true, it:true */

// Test setup:
import { expect } from '@tractor/unit-test';
import dedent from 'dedent';

// Under test:
import { FeatureLexer } from './feature-lexer';

describe('tractor-plugin-features - feature-lexer:', () => {
    describe('FeatureLexer constructor:', () => {
        it('should return a FeatureLexer', () => {
            let lexer = new FeatureLexer();

            expect(lexer).to.be.an.instanceof(FeatureLexer);
            expect(lexer.features).to.deep.equal([]);
        });
    });

    describe('FeatureLexer.lastFeature:', () => {
        it('should return the last feature', () => {
            let lexer = new FeatureLexer();

            let feature1 = {};
            let feature2 = {};
            let feature3 = {};
            lexer.features = [feature1, feature2, feature3];

            expect(lexer.lastFeature).to.equal(feature3);
        });
    });

    describe('FeatureLexer.lastElement:', () => {
        it('should return the last element', () => {
            let lexer = new FeatureLexer();

            let element1 = {};
            let element2 = {};
            let element3 = {};
            let feature1 = {};
            let feature2 = {};
            let feature3 = {
                elements: [element1, element2, element3]
            };
            lexer.features = [feature1, feature2, feature3];

            expect(lexer.lastElement).to.equal(element3);
        });
    });

    describe('FeatureLexer.feature:', () => {
        it('should add a new feature', () => {
            let type = 'type';
            let name = 'name';
            let description = dedent(`
                In order to get something done
                As a user
                I want to do something
            `);

            let lexer = new FeatureLexer();
            lexer.feature(type, name, description);

            expect(lexer.lastFeature).to.deep.equal({
                type: 'type',
                name: 'name',
                inOrderTo: 'get something done',
                asA: 'user',
                iWant: 'to do something',
                elements: [],
                tags: []
            });
        });

        it('should include any tags', () => {
            let lexer = new FeatureLexer();

            lexer.tag('@tag');

            let type = 'type';
            let name = 'name';
            let description = dedent(`
                In order to get something done
                As a user
                I want to do something
            `);
            lexer.feature(type, name, description);

            expect(lexer.lastFeature.tags).to.deep.equal(['@tag']);
        });
    });

    describe('FeatureLexer.background:', () => {
        it('should add a new background', () => {
            let type = 'type';
            let name = 'name';
            let description = 'background';
            let feature = { elements: [] };

            let lexer = new FeatureLexer();
            lexer.features.push(feature);
            lexer.background(type, name, description);

            expect(lexer.lastElement).to.deep.equal({
                type: 'type',
                name: 'name',
                description: 'background',
                examples: [],
                stepDeclarations: [],
                tags: []
            });
        });

        it('should include any tags', () => {
            let lexer = new FeatureLexer();
            let type = 'type';
            let name = 'name';
            let description = dedent(`
                In order to get something done
                As a user
                I want to do something
            `);
            lexer.feature(type, name, description);

            lexer.tag('@tag');
            lexer.background('type', 'name', 'description');

            expect(lexer.lastElement.tags).to.deep.equal(['@tag']);
        });
    });

    describe('FeatureLexer.scenario:', () => {
        it('should add a new scenario', () => {
            let type = 'type';
            let name = 'name';
            let description = 'scenario';
            let feature = { elements: [] };

            let lexer = new FeatureLexer();
            lexer.features.push(feature);
            lexer.scenario(type, name, description);

            expect(lexer.lastElement).to.deep.equal({
                type: 'type',
                name: 'name',
                description: 'scenario',
                examples: [],
                stepDeclarations: [],
                tags: []
            });
        });

        it('should include any tags', () => {
            let lexer = new FeatureLexer();
            let type = 'type';
            let name = 'name';
            let description = dedent(`
                In order to get something done
                As a user
                I want to do something
            `);
            lexer.feature(type, name, description);

            lexer.tag('@tag');

            lexer.scenario('type', 'name', 'description');

            expect(lexer.lastElement.tags).to.deep.equal(['@tag']);
        });
    });

    describe('FeatureLexer.scenario_outline:', () => {
        it('should add a new scenario_outline', () => {
            let type = 'type';
            let name = 'name';
            let description = 'scenario_outline';
            let feature = { elements: [] };

            let lexer = new FeatureLexer();
            lexer.features.push(feature);
            lexer.scenario_outline(type, name, description);

            expect(lexer.lastElement).to.deep.equal({
                type: 'type',
                name: 'name',
                description: 'scenario_outline',
                examples: [],
                stepDeclarations: [],
                tags: []
            });
        });

        it('should include any tags', () => {
            let lexer = new FeatureLexer();
            let type = 'type';
            let name = 'name';
            let description = dedent(`
                In order to get something done
                As a user
                I want to do something
            `);
            lexer.feature(type, name, description);

            lexer.tag('@tag');

            lexer.scenario_outline('type', 'name', 'description');

            expect(lexer.lastElement.tags).to.deep.equal(['@tag']);
        });
    });

    describe('FeatureLexer.row:', () => {
        it('should add a set of variables to an element', () => {
            let element = {};
            let feature = { elements: [element] };

            let lexer = new FeatureLexer();
            lexer.features.push(feature);
            lexer.row(['variable1', 'variable2']);

            expect(element.variables).to.deep.equal(['variable1', 'variable2']);
        });

        it('should add an example if an element already has variables', () => {
            let element = { examples: [] };
            let feature = { elements: [element] };

            let lexer = new FeatureLexer();
            lexer.features.push(feature);
            lexer.row(['variable1', 'variable2']);
            lexer.row(['value1', 'value2']);

            let [example] = element.examples;
            expect(example).to.deep.equal(['value1', 'value2']);
        });
    });

    describe('FeatureLexer.step:', () => {
        it('should add a new step', () => {
            let type = 'type ';
            let step = 'step';
            let element = { stepDeclarations: [] };
            let feature = { elements: [element] };

            let lexer = new FeatureLexer();
            lexer.features.push(feature);
            lexer.step(type, step);

            let [stepDeclaration] = element.stepDeclarations;
            expect(stepDeclaration).to.deep.equal({
                type: 'type',
                step: 'step'
            });
        });
    });

    describe('FeatureLexer.tag:', () => {
        it('should add a tag to the current tags', () => {
            let lexer = new FeatureLexer();

            lexer.tag('@tag');

            let [tag] = lexer.tags;
            expect(tag).to.equal('@tag');
        });

        it('should only add each tag once', () => {
          let lexer = new FeatureLexer();

          lexer.tag('@tag');
          lexer.tag('@tag');

          expect(lexer.tags.length).to.equal(1);
        });
    });

    describe('FeatureLexer.done', () => {
        it('should return the features', () => {
            let feature = {};

            let lexer = new FeatureLexer();
            lexer.features.push(feature);

            expect(lexer.done()).to.deep.equal([feature]);
        });
    });

    describe('FeatureLexer noops:', () => {
        let lexer = new FeatureLexer();

        expect(lexer.comment).to.equal(lexer.doc_string);
        expect(lexer.doc_string).to.equal(lexer.examples);
        expect(lexer.examples).to.equal(lexer.eof);
        expect(lexer.eof).to.equal(lexer.comment);
    });
});
