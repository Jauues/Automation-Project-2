import IssueModal from "../pages/IssueModal.js";
import { faker } from "@faker-js/faker";

describe("Time estimation functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  const issueDetails = {
    type: "Bug",
    description: faker.lorem.words(7),
    title: faker.lorem.words(3),
    assignee: "Pickle Rick",
    estimatedTime: "10",
    newEstimatedTime: "20",
    removedEstimatedTime: "",
  };

  it("Should add, edit & remove time estimation successfully", () => {
    IssueModal.createIssue(issueDetails);
    IssueModal.addEstimation(issueDetails);
    IssueModal.validateEstimationSaved(
      issueDetails /*, issueDetails.estimatedTime*/
    );
    IssueModal.updateEstimation(issueDetails);
    IssueModal.validateEstimationSaved(
      issueDetails /*, issueDetails.newEstimatedTime*/
    );
    IssueModal.removeEstimation(issueDetails);
    IssueModal.validateEstimationSaved(
      issueDetails /*, issueDetails.removedEstimatedTime*/
    );
  });
});

/*


    it('Should log spent time & remove it successfully', () => {
        IssueModal.logTime();
        IssueModal.removeLoggedTime();
        
    });
*/
