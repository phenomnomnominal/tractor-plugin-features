// Dependencies:
import gherkin from 'gherkin';
import { FeatureLexer } from './feature-lexer';

export function lex (content) {
    let formatter = new FeatureLexer();
    let EnLexer = gherkin.Lexer('en');
    let enLexer = new EnLexer(formatter);
    enLexer.scan(content);
    return formatter.done();
}
