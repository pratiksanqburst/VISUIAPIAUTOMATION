@high_ai_api @rbac_users_api
Feature: High AI RBAC Users API

  Background:
    Given I have a valid High AI API session

  @high_ai_api @T-HAI-019
  Scenario: Validate RBAC users API returns 200
    When I send a GET request to the High AI RBAC users endpoint
    Then the High AI API response status should be 200

  @high_ai_api @T-HAI-020
  Scenario: Validate RBAC users response success flag is true
    When I send a GET request to the High AI RBAC users endpoint
    Then the RBAC users response success flag should be true

  @high_ai_api @T-HAI-021
  Scenario: Validate RBAC users response contains users array and totalCount
    When I send a GET request to the High AI RBAC users endpoint
    Then the RBAC users response should contain a users array
    And the RBAC users response should contain a totalCount field

  @high_ai_api @T-HAI-022
  Scenario: Validate RBAC users totalCount matches the users array length
    When I send a GET request to the High AI RBAC users endpoint
    Then the RBAC users totalCount should match the length of the users array

  @high_ai_api @T-HAI-023
  Scenario: Validate each RBAC user has required fields
    When I send a GET request to the High AI RBAC users endpoint
    Then each RBAC user should have the following fields:
      | Field          |
      | userId         |
      | email          |
      | name           |
      | globalRole     |
      | globalRoleName |
      | status         |
      | platformRoles  |

  @high_ai_api @T-HAI-024
  Scenario: Validate each RBAC user globalRole is a valid value
    When I send a GET request to the High AI RBAC users endpoint
    Then each RBAC user globalRole should be either "ORG_MANAGER" or "USER"

  @high_ai_api @T-HAI-025
  Scenario: Validate each RBAC user ID is a valid UUID
    When I send a GET request to the High AI RBAC users endpoint
    Then each RBAC user userId should be a valid UUID

  @high_ai_api @T-HAI-026
  Scenario: Validate each RBAC user status is ACTIVE
    When I send a GET request to the High AI RBAC users endpoint
    Then each RBAC user status should be "ACTIVE"

  @high_ai_api @T-HAI-027
  Scenario: Validate each RBAC user email is a valid email address
    When I send a GET request to the High AI RBAC users endpoint
    Then each RBAC user email should be a valid email address
