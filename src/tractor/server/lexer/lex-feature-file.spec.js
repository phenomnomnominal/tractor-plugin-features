/* global describe:true, it:true */

// Test setup:
import { expect, sinon } from '../../../../test-setup';

// Dependencies:
import gherkin from 'gherkin';

// Under test:
import { lex } from './lex-feature-file';

describe('tractor-plugin-features - lex-feature-file:', () => {
    it('should lex a feature file', () => {
        let enLexer = gherkin.Lexer('en');
        sinon.stub(enLexer.prototype, 'scan');

        let feature = `
            @Smoke
            Feature: Test
            In order to test
            As a test
            I want to test

            @Important
            Scenario: Test
              Given something
              And something else
              When something happens
              Then something else happens
              But something else does not happen
        `;

        lex(feature);

        expect(enLexer.prototype.scan).to.have.been.calledWith(feature);
    });
});
