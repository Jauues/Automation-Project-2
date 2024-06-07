const issueTitle = "This is an issue of type: Task.";
const deleteButton = '[data-testid="icon:trash"]';
const deleteButtonText = "Delete issue";
const cancelButtonText = "Cancel";
const backlog = '[data-testid="board-list:backlog"]';
const listIssue = '[data-testid="list-issue"]';
const closeButtonForDetailsModal = '[data-testid="icon:close"]';
const issueDetailsModal = '[data-testid="modal:issue-details"]';
const confirmationModal = '[data-testid="modal:confirm"]';

describe("Issue deletion", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        getFirstListIssue();
      });
  });

  it("Should delete an issue & verify it's not visible on backlog after", () => {
    deletesIssue();
    deletedIssueNotVisible();
  });
});

describe("Issue deletion cancellation", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        getFirstListIssue();
      });
  });

  it("Should cancel the deletion of an issue & verify the issue is still visible", () => {
    cancelsIssueDeletion();
    cancelledIssueStillVisible();
  });
});

const getIssueDetailsModal = () =>
  cy.get(issueDetailsModal);
const getConfirmationModal = () => cy.get(confirmationModal);
const getFirstListIssue = () =>
  cy.get(backlog).children(0).contains(issueTitle).should("be.visible").click();

function deletesIssue() {
  getIssueDetailsModal().within(() => {
    cy.get(deleteButton).click();
  });
  getConfirmationModal().within(() => {
    cy.get("button")
      .eq(0)
      .children()
      .should("have.text", deleteButtonText)
      .click();
  });
}

function deletedIssueNotVisible() {
  getIssueDetailsModal().should("not.exist");
  getConfirmationModal().should("not.exist");
  cy.get(backlog)
    .should("be.visible")
    .and("not.contain", issueTitle)
    .within(() => {
      cy.get(listIssue).should("have.length", "3");
    });
}

function cancelsIssueDeletion() {
  getIssueDetailsModal().within(() => {
    cy.get(deleteButton).click();
  });
  getConfirmationModal().within(() => {
    cy.get("button")
      .eq(1)
      .children()
      .should("have.text", cancelButtonText)
      .click();
  });
}

function cancelledIssueStillVisible() {
  getIssueDetailsModal().should("be.visible").contains(issueTitle);
  getConfirmationModal().should("not.exist");
  cy.get(closeButtonForDetailsModal).eq(0).click();
  cy.get(backlog)
    .should("be.visible")
    .and("contain", issueTitle)
    .within(() => {
      cy.get(listIssue).should("have.length", "4");
    });
}
