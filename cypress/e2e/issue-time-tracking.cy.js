import IssueModal from "../pages/IssueModal.js";
import { faker } from "@faker-js/faker";

describe("Time estimation functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url({ timeout: 120000 })
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url);
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
});
