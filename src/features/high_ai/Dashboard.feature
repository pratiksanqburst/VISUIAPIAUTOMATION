@high_ai1 @dashboard
Feature: High AI Visualization Dashboard

  Background:
    Given I am on the visualization login page
    When I sign in as a visualization user
    And I open the Visualization platform dashboard

  @T-048
  Scenario: Verify AI Summary button is visible and clickable
    Then the AI Summary button should be clearly visible on the dashboard
    When I click the AI Summary button
    Then the AI Summary panel should open

  @T-049
  Scenario: Verify Project Health Overview KPI data matches AI Summary
    When I observe the Project Health Overview KPI values
    And I click the AI Summary button
    Then the AI Quality Summary values should match the Project Health Overview KPI values

  @T-050
  Scenario: Verify Functional Testing KPIs are visible
    When I navigate to the Functional Testing dashboard
    Then I should see the following functional KPIs:
      | KPI                   |
      | Total Planned Tests   |
      | Total Executed Tests  |
      | Automation Pass Count |
      | Automation Pass Rate  |
      | Defect Density        |
      | Total Test Coverage   |
      | Requirement Coverage  |
      | Automation Coverage   |

  @T-051
  Scenario: Verify Admin Panel is accessible and displays correct fields
    When I navigate to the Admin Panel via Settings
    Then I should see the heading "Role Based Actions"
    And the Admin Panel table should have the following columns:
      | Column            |
      | Name              |
      | Email ID          |
      | Role Based Access |
    And the Refresh button should be visible

  @T-052
  Scenario: Verify Threshold Settings page displays correct fields
    When I navigate to Threshold Settings via Settings
    Then I should see the heading "Threshold Settings"
    And the Threshold Settings page should contain the following sections:
      | Section        |
      | Functional     |
      | Non-Functional |
    And the Threshold Settings table should contain the following columns:
      | Column       |
      | PROJECT NAME |
      | ACTIONS      |

  @T-053
  Scenario: Verify RRI Analysis page displays correct fields
    When I navigate to RRI Analysis via Settings
    Then I should see the heading "RRI Analysis"
    And the RRI Analysis page should contain the following sections:
      | Section                |
      | FUNCTIONAL TESTING     |
      | NON-FUNCTIONAL TESTING |
    And the search field "Search functional..." should be visible
    And the search field "Search non-functional..." should be visible
