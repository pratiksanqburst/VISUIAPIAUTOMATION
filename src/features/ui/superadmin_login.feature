Feature: Super Admin Login

  @complete
  Scenario: Successful access to Super Admin Dashboard
    Given I am authenticated as a Super Admin
    When I navigate to the Super Admin Dashboard
    Then I should see the "Welcome, Super Admin" message

  @superadmin @complete
  Scenario: Verify Super Admin Dashboard elements
    Given I am authenticated as a Super Admin
    When I navigate to the Super Admin Dashboard
    Then I should see the following sidebar options:
      | Dashboard     |
      | Organizations |
      | Users         |
    And I should see the "Organizations" and "Users" stat cards
    And I should see the Logout button
