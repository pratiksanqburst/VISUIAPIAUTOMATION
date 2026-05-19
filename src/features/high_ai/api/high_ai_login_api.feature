@high_ai_api @login_api
Feature: High AI Login API

  Background:
    Given I have a valid High AI API session

  @high_ai_api @T-HAI-028
  Scenario: Validate High AI login API returns 201
    When I send a POST request to the High AI login endpoint
    Then the High AI login response status should be 201

  @high_ai_api @T-HAI-029
  Scenario: Validate High AI login response success flag is true
    When I send a POST request to the High AI login endpoint
    Then the High AI login response success flag should be true

  @high_ai_api @T-HAI-030
  Scenario: Validate High AI login response contains a JWT token
    When I send a POST request to the High AI login endpoint
    Then the High AI login response should contain a valid JWT token

  @high_ai_api @T-HAI-031
  Scenario: Validate High AI login user object has required fields
    When I send a POST request to the High AI login endpoint
    Then the High AI login user object should have the following fields:
      | Field            |
      | userId           |
      | email            |
      | name             |
      | status           |
      | pw_change_status |

  @high_ai_api @T-HAI-032
  Scenario: Validate High AI login user ID is a valid UUID
    When I send a POST request to the High AI login endpoint
    Then the High AI login user userId should be a valid UUID

  @high_ai_api @T-HAI-033
  Scenario: Validate High AI login user email is a valid email address
    When I send a POST request to the High AI login endpoint
    Then the High AI login user email should be a valid email address

  @high_ai_api @T-HAI-034
  Scenario: Validate High AI login user status is ACTIVE
    When I send a POST request to the High AI login endpoint
    Then the High AI login user status should be "ACTIVE"

  @high_ai_api @T-HAI-035
  Scenario: Validate High AI login response contains a non-empty organizations array
    When I send a POST request to the High AI login endpoint
    Then the High AI login response should contain a non-empty organizations array

  @high_ai_api @T-HAI-036
  Scenario: Validate each organization has required fields
    When I send a POST request to the High AI login endpoint
    Then each High AI login organization should have the following fields:
      | Field     |
      | orgId     |
      | orgName   |
      | orgCode   |
      | orgRole   |
      | orgStatus |
      | platforms |

  @high_ai_api @T-HAI-037
  Scenario: Validate each organization ID is a valid UUID
    When I send a POST request to the High AI login endpoint
    Then each High AI login organization orgId should be a valid UUID
