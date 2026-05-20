describe('Accessibility — cypress-axe', { tags: '@regression' }, () => {
  it('DummyJSON home page has no critical or serious WCAG 2.1 AA violations', () => {
    cy.visit('/');
    cy.injectAxe();
    cy.checkA11y(
      undefined,
      {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
        includedImpacts: ['critical', 'serious'],
      },
      (violations) => {
        violations.forEach((v) => {
          cy.task('log', `[${v.impact ?? 'unknown'}] ${v.id}: ${v.description}`);
        });
      }
    );
  });
});
