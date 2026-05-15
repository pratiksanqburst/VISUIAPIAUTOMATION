Feature: Visualization Non-Functional Page

  @high_ai1 @visualization
  Scenario: Verify visualization non-functional testing page
    Given I am on the visualization login page
    When I sign in as a visualization user
    And I open the Visualization platform and view Non-Functional Testing
    Then I should see Accessibility, Client Side Performance, Link Validation, Search Engine Optimization and Visual Regression listed
