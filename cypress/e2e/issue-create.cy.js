import { faker } from "@faker-js/faker";

const createIssueModal = '[data-testid="modal:issue-create"]';
const titleInput = 'input[name="title"]';
const descriptionInput = ".ql-editor";
const issueType = '[data-testid="select:type"]';
const priority = '[data-testid="select:priority"]';
const reporter = '[data-testid="select:reporterId"]';
const assignee = '[data-testid="form-field:userIds"]';
const submitButton = 'button[type="submit"]';
const issueTypeBug = '[data-testid="select-option:Bug"]';
const issueIconBug = '[data-testid="icon:bug"]';
const reporterNamePickleRick = '[data-testid="select-option:Pickle Rick"]';
const assigneeNameLordGaben = '[data-testid="select-option:Lord Gaben"]';
const priorityHighest = '[data-testid="select-option:Highest"]';
const backlog = '[data-testid="board-list:backlog"]';
const listIssue = '[data-testid="list-issue"]';
const divBacklogAssigneeAvatar = ".sc-kIPQKe";
const avatarLordGaben = '[data-testid="avatar:Lord Gaben"]';
const issueIconTask = '[data-testid="icon:task"]';
const priorityLow = '[data-testid="select-option:Low"]';
const reporterNameBabyYoda = '[data-testid="select-option:Baby Yoda"]';
const priorityIconHighest = '[data-testid="icon:arrow-up"]';
const priorityColorHighest = "rgb(205, 19, 23)";
const priorityIconLow = '[data-testid="icon:arrow-down"]';
const priorityColorLow = "rgb(45, 135, 56)";

describe("Creating issues", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it("Should create an issue & assert that issue is visible on the board", () => {
    let description = "My bug description";
    let title = "Bug";
    createNewIssue(
      description,
      title,
      issueTypeBug,
      issueIconBug,
      priorityHighest,
      reporterNamePickleRick,
      assigneeNameLordGaben
    );
    verifyNewIssueOnBacklog(
      title,
      issueIconBug,
      avatarLordGaben,
      priorityIconHighest,
      priorityColorHighest
    );
  });

  it("Should create an issue with random data & assert that issue is visible on the board", () => {
    let description = faker.lorem.words(5);
    let title = faker.lorem.words(1);
    createTaskNoAssignee(description, title, priorityLow, reporterNameBabyYoda);
    verifyNewIssueOnBacklogNoAssignee(
      title,
      issueIconTask,
      priorityIconLow,
      priorityColorLow
    );
  });
});

function createNewIssue(
  myDescription,
  myTitle,
  myIssueType,
  myIssueIcon,
  myPriority,
  myReporter,
  myAssignee
) {
  cy.get(createIssueModal).within(() => {
    cy.get(descriptionInput)
      .type(myDescription)
      .should("have.text", myDescription);
    cy.get(titleInput).type(myTitle).should("have.value", myTitle);
    cy.get(issueType).click();
    cy.get(myIssueType).wait(1000).trigger("mouseover").trigger("click");
    cy.get(myIssueIcon).should("be.visible");
    cy.get(priority).click();
    cy.get(myPriority).wait(1000).trigger("mouseover").trigger("click");
    cy.get(reporter).click();
    cy.get(myReporter).click();
    cy.get(assignee).click();
    cy.get(myAssignee).click();
    cy.get(submitButton).click();
  });
}

function createTaskNoAssignee(
  myDescription,
  myTitle,
  myPriorityLevel,
  myReporterName
) {
  cy.get(createIssueModal).within(() => {
    cy.get(descriptionInput).type(myDescription);
    cy.get(titleInput).type(myTitle);
    cy.get(issueType).first().find("i").siblings().contains("Task");
    cy.get(issueIconTask).scrollIntoView().should("be.visible");
    cy.get(priority).click();
    cy.get(myPriorityLevel).wait(1000).trigger("mouseover").trigger("click");
    cy.get(reporter).click();
    cy.get(myReporterName).click();
    cy.get(submitButton).click();
  });
}

function verifyNewIssueOnBacklog(
  prevIssueTitle,
  prevIssueTypeIcon,
  prevAssigneeAvatar,
  prevPriorityIcon,
  priorityLevelColor
) {
  cy.get(createIssueModal).should("not.exist");
  cy.contains("Issue has been successfully created.").should("be.visible");
  cy.reload();
  cy.contains("Issue has been successfully created.").should("not.exist");
  cy.get(backlog)
    .should("be.visible")
    .and("have.length", "1")
    .within(() => {
      cy.get(listIssue)
        .should("have.length", "5")
        .first()
        .find("p")
        .contains(prevIssueTitle)
        .siblings()
        .within(() => {
          cy.get(prevIssueTypeIcon).should("be.visible");
          cy.get(prevAssigneeAvatar).should("be.visible");
          cy.get(prevPriorityIcon)
            .should("be.visible")
            .and("have.css", "color", priorityLevelColor);
        });
    });
}

function verifyNewIssueOnBacklogNoAssignee(
  prevIssueTitle,
  prevIssueTypeIcon,
  prevPriorityIcon,
  priorityLevelColor
) {
  cy.get(createIssueModal).should("not.exist");
  cy.contains("Issue has been successfully created.").should("be.visible");
  cy.reload();
  cy.contains("Issue has been successfully created.").should("not.exist");
  cy.get(backlog)
    .should("be.visible")
    .and("have.length", "1")
    .within(() => {
      cy.get(listIssue)
        .should("have.length", "5")
        .first()
        .find("p")
        .contains(prevIssueTitle)
        .siblings()
        .within(() => {
          cy.get(prevIssueTypeIcon).should("be.visible");
          cy.get(divBacklogAssigneeAvatar).should("not.be.visible");
          cy.get(prevPriorityIcon)
            .should("be.visible")
            .and("have.css", "color", priorityLevelColor);
        });
    });
}
