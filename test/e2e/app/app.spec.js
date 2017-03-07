'use strict';

/**
 * @author ankostyuk
 */

describe('app', function() {

    beforeAll(function() {
        browser.get('/');
    });

    describe('DOM', function() {
        describe('title', function() {
            const title = 'Logiceditor';

            it('browser title', function() {
                expect(browser.getTitle()).toBe(title);
            });

            it('page header', function() {
                expect(element.all(by.css('h1')).first().getText()).toBe(title);
            });
        });
    });
});
