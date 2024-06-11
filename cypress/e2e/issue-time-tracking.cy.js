import IssueModal from "../pages/IssueModal.js";
import { faker } from "@faker-js/faker";

describe("Time estimation & tracking functionalities", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url({ timeout: 120000 })
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url);
        IssueModal.getFirstListIssue();
      });
  });

  const issueDetails = {
    estimatedTime: "10",
    newEstimatedTime: "20",
    removedEstimatedTime: "",
    timeSpent: "2",
    timeRemaining: "5",
  };

  it("Should add, edit & remove time estimation successfully", () => {
    IssueModal.addEstimation(issueDetails);
    IssueModal.validateEstimationSaved(
      issueDetails,
      issueDetails.estimatedTime
    );
    IssueModal.updateEstimation(issueDetails);
    IssueModal.validateEstimationSaved(
      issueDetails,
      issueDetails.newEstimatedTime
    );
    IssueModal.removeEstimation(issueDetails);
    IssueModal.validateEstimationRemoved(issueDetails);
  });

  it("Should log & remove logged time successfully", () => {
    IssueModal.deleteLoggedTime();
    IssueModal.logTime(issueDetails);
  });
});
