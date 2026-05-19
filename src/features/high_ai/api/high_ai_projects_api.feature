@high_ai_api @projects_api
Feature: High AI Projects API

  Background:
    Given I have a valid High AI API session

  @high_ai_api @T-HAI-001
  Scenario: Validate projects list API returns 200
    When I send a GET request to the High AI projects endpoint
    Then the High AI API response status should be 200

  @high_ai_api @T-HAI-002
  Scenario: Validate projects list API response structure
    When I send a GET request to the High AI projects endpoint
    Then the response should contain a "projects" array
    And the response should contain a "total" count
    And the "total" count should match the number of projects in the array

  @high_ai_api @T-HAI-003
  Scenario: Validate each project has required fields
    When I send a GET request to the High AI projects endpoint
    Then each project in the response should have the following fields:
      | Field        |
      | id           |
      | projectName  |
      | projectKey   |
      | source       |
      | isDeleted    |
      | createdAt    |
      | updatedAt    |
      | isConfigured |

  @high_ai_api @T-HAI-004
  Scenario: Validate project source values are valid
    When I send a GET request to the High AI projects endpoint
    Then each project source should be either "nfr" or "functional"

  @high_ai_api @T-HAI-005
  Scenario: Validate project ID format is a valid UUID
    When I send a GET request to the High AI projects endpoint
    Then each project id should be a valid UUID

  @high_ai_api @T-HAI-006
  Scenario: Validate project timestamps are valid ISO date strings
    When I send a GET request to the High AI projects endpoint
    Then each project createdAt and updatedAt should be valid ISO date strings
