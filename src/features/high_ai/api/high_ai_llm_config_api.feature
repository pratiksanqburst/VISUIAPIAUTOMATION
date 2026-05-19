@high_ai_api @llm_config_api
Feature: High AI LLM Configuration API

  Background:
    Given I have a valid High AI API session

  @high_ai_api @T-HAI-013
  Scenario: Validate LLM config API returns 200
    When I send a GET request to the High AI LLM config endpoint
    Then the High AI API response status should be 200

  @high_ai_api @T-HAI-014
  Scenario: Validate LLM config response has all required fields
    When I send a GET request to the High AI LLM config endpoint
    Then the LLM config response should have the following fields:
      | Field        |
      | id           |
      | provider     |
      | baseUrl      |
      | modelName    |
      | apiKeyMasked |
      | createdAt    |
      | updatedAt    |

  @high_ai_api @T-HAI-015
  Scenario: Validate LLM config ID is a valid UUID
    When I send a GET request to the High AI LLM config endpoint
    Then the LLM config id should be a valid UUID

  @high_ai_api @T-HAI-016
  Scenario: Validate LLM config baseUrl is a valid URL
    When I send a GET request to the High AI LLM config endpoint
    Then the LLM config baseUrl should be a valid URL

  @high_ai_api @T-HAI-017
  Scenario: Validate LLM config API key is masked
    When I send a GET request to the High AI LLM config endpoint
    Then the LLM config apiKeyMasked should follow the masked format

  @high_ai_api @T-HAI-018
  Scenario: Validate LLM config timestamps are valid ISO date strings
    When I send a GET request to the High AI LLM config endpoint
    Then the LLM config createdAt and updatedAt should be valid ISO date strings
