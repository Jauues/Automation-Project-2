describe("Issue details editing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.", {
          timeout: 120000,
        }).click();
      });
  });

  it("Should update type, status, assignees, reporter, priority successfully", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click("bottomRight");
      cy.get('[data-testid="select-option:Story"]')
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="select:type"]').should("contain", "Story");

      cy.get('[data-testid="select:status"]').click("bottomRight");
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should("have.text", "Done");

      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should("contain", "Baby Yoda");
      cy.get('[data-testid="select:assignees"]').should(
        "contain",
        "Lord Gaben"
      );

      cy.get('[data-testid="select:reporter"]').click("bottomRight");
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should(
        "have.text",
        "Pickle Rick"
      );

      cy.get('[data-testid="select:priority"]').click("bottomRight");
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should("have.text", "Medium");
    });
  });

  it("Should update title, description successfully", () => {
    const title = "TEST_TITLE";
    const description = "TEST_DESCRIPTION";

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get(".ql-snow").click().should("not.exist");

      cy.get(".ql-editor").clear().type(description);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('textarea[placeholder="Short summary"]').should(
        "have.text",
        title
      );
      cy.get(".ql-snow").should("have.text", description);
    });
  });

  it('Should verify content of dropdown "Priority"', () => {
    const expectedLength = 5;
    const priorityArray = [];

    const priorityList = "[data-select-option-value]";
    const priorityOption = '[data-testid="icon:arrow-up"]';
    const priorityDropdown = '[data-testid="select:priority"]';

    getIssueDetailsModal().within(() => {
      // Verifying active element
      cy.get(priorityOption)
        .next()
        .invoke("text")
        .then((priorityText) => {
          priorityArray.push(priorityText);
          expect(priorityArray).to.contain(priorityText);
        });

      // Clicking on dropdown
      cy.get(priorityDropdown).click();

      // Verifying contents of dropdown
      cy.get(priorityList).each(($priority) => {
        cy.wrap($priority)
          .invoke("text")
          .then((priorityText) => {
            priorityArray.push(priorityText);
            expect(priorityArray).to.contain(priorityText);
            cy.log(priorityArray.length);
          });
      });

      // Verifying length of array
      cy.wrap(priorityArray).its("length").should("equal", expectedLength);
    });
  });

  it("Should verify name of reporter has only charecters", () => {
    const reporter = '[data-testid="select:reporter"]';

    getIssueDetailsModal().within(() => {
      cy.get(reporter)
        .invoke("text")
        .then((reporterName) => {
          Array.from(reporterName).forEach((character) => {
            cy.wrap(character).should("match", /^[A-Za-z\s]$/);
          });
        });
    });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
});
