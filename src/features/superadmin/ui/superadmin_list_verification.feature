@list_verification
Feature: Super Admin List Verification

  Background:
    Given I am authenticated as a Super Admin
    And I navigate to the Super Admin Dashboard

  @complete
  Scenario: Verify organization "Finetech" or "Bridge Tech Solution" is visible in the list
    Given I navigate to the Organizations page
    Then the organization "Finetech" or "Bridge Tech Solution" should be visible in the list

  @complete
  Scenario: Verify a user is visible in the list
    Given I navigate to the Users page
    Then the user "pratik.santhosh@qburst.com" should be visible in the list
