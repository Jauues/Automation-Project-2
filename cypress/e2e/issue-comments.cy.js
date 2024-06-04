import { faker } from "@faker-js/faker";
import IssueModal from "../pages/IssueModal.js";



describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            IssueModal.getFirstListIssue();
        });
    });

    const comment = faker.lorem.words(5);
    const editedComment = faker.lorem.words(3)

    it('Should create, edit & delete a new comment', () => {
   
        IssueModal.addComment(comment);
        IssueModal.editComment(comment, editedComment);
        IssueModal.deleteComment(editedComment);
    });

});

   