@create_user
Feature: Super Admin Users

  Background:
    Given I am authenticated as a Super Admin
    And I navigate to the Super Admin Dashboard

  @create_user @complete
  Scenario: Create a new normal user for a random organization
    Given I navigate to the Users page
    When I click on the "Create User" button
    And I fill in the user details:
      | Field | Value                             |
      | Email | [Auto] pratik.santhosh@qburst.com |
      | Name  | Automated Test User               |
      | Role  | Normal User                       |
    And I select a random organization for the user
    And I click "Create" to finish user creation
    Then the user "[Auto] pratik.santhosh@qburst.com" should be visible in the list

  @suspension @complete
  Scenario: Create and Deactivate a user
    Given I navigate to the Users page
    When I click on the "Create User" button
    And I fill in the user details:
      | Field | Value                           |
      | Email | [Auto] suspend.user@example.com |
      | Name  | Suspend Test User               |
      | Role  | Normal User                     |
    And I select a random organization for the user
    And I click "Create" to finish user creation
    Then the user "[Auto] suspend.user@example.com" should be visible in the list
    When I deactivate the user "[Auto] suspend.user@example.com"
    And I toggle "Show disabled users" to "on"
    Then the user "[Auto] suspend.user@example.com" should have status "DISABLED"
