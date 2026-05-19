@high_ai_api @profile_api
Feature: High AI Profile API

  Background:
    Given I have a valid High AI API session

  @high_ai_api @T-HAI-007
  Scenario: Validate profile API returns 200
    When I send a GET request to the High AI profile endpoint
    Then the High AI API response status should be 200

  @high_ai_api @T-HAI-008
  Scenario: Validate profile API response message
    When I send a GET request to the High AI profile endpoint
    Then the profile response message should be "You are accessing a protected route!"

  @high_ai_api @T-HAI-009
  Scenario: Validate profile API user object has required fields
    When I send a GET request to the High AI profile endpoint
    Then the profile user object should have the following fields:
      | Field   |
      | userId  |
      | email   |
      | orgId   |
      | name    |
      | role    |

  @high_ai_api @T-HAI-010
  Scenario: Validate profile user ID and org ID are valid UUIDs
    When I send a GET request to the High AI profile endpoint
    Then the profile user userId should be a valid UUID
    And the profile user orgId should be a valid UUID

  @high_ai_api @T-HAI-011
  Scenario: Validate profile user role is a non-empty array
    When I send a GET request to the High AI profile endpoint
    Then the profile user role should be a non-empty array

  @high_ai_api @T-HAI-012
  Scenario: Validate profile user email format
    When I send a GET request to the High AI profile endpoint
    Then the profile user email should be a valid email address
