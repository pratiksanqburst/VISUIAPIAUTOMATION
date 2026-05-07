@high_ai1
Feature: High AI Visualization Login

  Scenario: Navigate to High AI Login Page
    When I navigate to the High AI portal
    Then I should be redirected to the dashboard

  Scenario: Verify Visualisation Dashboard Redirection
    When I navigate to the High AI portal
    And I select the "Visualisation" platform
    Then I should see the "Functional Testing" dashboard
    And I verify the dashboard metrics cards are visible:
      | Metric               |
      | Defect Density       |
      | Automation Coverage  |
      | Requirement Coverage |
      | Total Test Coverage  |

  @high_ai1
  Scenario: Verify login with invalid credentials
    When I open the High AI login page
    And I login with invalid credentials
    Then I should see an error message "Invalid credentials"

  @high_ai
  Scenario: Verify login with empty fields
    When I open the High AI login page
    And I click Login without entering credentials
    Then I should see validation message "Email is required!"
    And I should see validation message "Password is required!"
