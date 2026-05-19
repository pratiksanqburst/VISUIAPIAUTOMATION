Feature: Super Admin - Create and Edit User

  @high_ai1 @superadmin
  Scenario: Super Admin can create a user and edit their display name
    Given I am authenticated as a Super Admin
    And I navigate to the Users page
    When I create a new user with prefix "randomusr" and role "ORG_MANAGER" in org "ACM"
    Then I should see the new user in the list
    When I edit that user's name to "RandomUserEdited"
    Then I should see the user's name updated to "RandomUserEdited"
