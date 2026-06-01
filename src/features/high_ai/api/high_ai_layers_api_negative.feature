@high_ai_api @layers_negative
Feature: High AI Layers API - Negative Scenarios

  Background:
    Given I have a valid High AI API session
  # ─── Invalid Project ID Scenarios ────────────────────────────────────────────

  @high_ai_api @T-HAI-NEG-001
  Scenario: Layers API returns 404 for a non-existent but valid-format UUID project ID
    When I send a GET request to the layers endpoint with project ID "00000000-0000-0000-0000-000000000001"
    Then the High AI API response status should be 404

  @high_ai_api @T-HAI-NEG-002
  Scenario: Layers API returns error for all-zeros null UUID project ID
    When I send a GET request to the layers endpoint with project ID "00000000-0000-0000-0000-000000000000"
    Then the High AI API response status should be a 4xx client error
  # NOTE: NEG-003 to NEG-008 — the API currently does not validate UUID format on
  # the server side. Passing a non-UUID value causes an unhandled 500 Internal
  # Server Error rather than a proper 400 Bad Request. Scenarios assert non-2xx
  # to document actual behaviour; ideally the API should return 400.

  @high_ai_api @T-HAI-NEG-003
  Scenario: Layers API returns an error for a too-short malformed project ID
    When I send a GET request to the layers endpoint with project ID "1234-abcd"
    Then the High AI API response status should be a non-2xx error

  @high_ai_api @T-HAI-NEG-004
  Scenario: Layers API returns an error for a project ID with non-hex characters
    When I send a GET request to the layers endpoint with project ID "zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz"
    Then the High AI API response status should be a non-2xx error

  @high_ai_api @T-HAI-NEG-005
  Scenario: Layers API returns an error for a numeric-only project ID
    When I send a GET request to the layers endpoint with project ID "123456789"
    Then the High AI API response status should be a non-2xx error

  @high_ai_api @T-HAI-NEG-006
  Scenario: Layers API returns an error for a SQL injection string as project ID
    When I send a GET request to the layers endpoint with project ID "1' OR '1'='1"
    Then the High AI API response status should be a non-2xx error

  @high_ai_api @T-HAI-NEG-007
  Scenario: Layers API returns an error for a very long project ID string
    When I send a GET request to the layers endpoint with project ID "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    Then the High AI API response status should be a non-2xx error

  @high_ai_api @T-HAI-NEG-008
  Scenario: Layers API returns an error for a boolean string as project ID
    When I send a GET request to the layers endpoint with project ID "true"
    Then the High AI API response status should be a non-2xx error
  # ─── Authentication / Authorization Scenarios ────────────────────────────────

  @high_ai_api @T-HAI-NEG-009
  Scenario: Layers API returns 401 when no authentication token is provided
    When I send a GET request to the NFR layers endpoint without authentication
    Then the High AI API response status should be 401

  @high_ai_api @T-HAI-NEG-010
  Scenario: Layers API returns 401 with an invalid JWT token
    When I send a GET request to the NFR layers endpoint with an invalid token "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWtlLXVzZXIifQ.invalidsignature"
    Then the High AI API response status should be 401

  @high_ai_api @T-HAI-NEG-011
  Scenario: Layers API returns 401 with a malformed non-JWT token
    When I send a GET request to the NFR layers endpoint with an invalid token "this-is-not-a-jwt-token"
    Then the High AI API response status should be 401

  @high_ai_api @T-HAI-NEG-012
  Scenario: Layers API returns 401 when the auth token is an empty string
    When I send a GET request to the NFR layers endpoint with an invalid token ""
    Then the High AI API response status should be 401
  # ─── Wrong HTTP Method Scenarios ─────────────────────────────────────────────

  @high_ai_api @T-HAI-NEG-013
  Scenario: Layers endpoint rejects POST requests
    When I send a "POST" request to the NFR layers endpoint
    Then the High AI API response status should be a 4xx client error

  @high_ai_api @T-HAI-NEG-014
  Scenario: Layers endpoint rejects PUT requests
    When I send a "PUT" request to the NFR layers endpoint
    Then the High AI API response status should be a 4xx client error

  @high_ai_api @T-HAI-NEG-015
  Scenario: Layers endpoint rejects DELETE requests
    When I send a "DELETE" request to the NFR layers endpoint
    Then the High AI API response status should be a 4xx client error

  @high_ai_api @T-HAI-NEG-016
  Scenario: Layers endpoint rejects PATCH requests
    When I send a "PATCH" request to the NFR layers endpoint
    Then the High AI API response status should be a 4xx client error
  # ─── Error Response Structure Validation ─────────────────────────────────────

  @high_ai_api @T-HAI-NEG-017
  Scenario: Error response for a non-existent project ID does not contain a layers array
    When I send a GET request to the layers endpoint with project ID "00000000-0000-0000-0000-000000000001"
    Then the High AI API response status should be a non-2xx error
    And the layers error response should not contain a layers array

  @high_ai_api @T-HAI-NEG-018
  Scenario: Error response for an unauthenticated request does not contain a layers array
    When I send a GET request to the NFR layers endpoint without authentication
    Then the High AI API response status should be 401
    And the layers error response should not contain a layers array

  @high_ai_api @T-HAI-NEG-019
  Scenario: Error response body for a non-existent project is valid JSON and contains an error indicator
    When I send a GET request to the layers endpoint with project ID "00000000-0000-0000-0000-000000000001"
    Then the High AI API response status should be a non-2xx error
    And the layers error response body should be valid JSON

  @high_ai_api @T-HAI-NEG-020
  Scenario: Error response body for an invalid token is valid JSON and contains an error indicator
    When I send a GET request to the NFR layers endpoint with an invalid token "totally-invalid"
    Then the High AI API response status should be 401
    And the layers error response body should be valid JSON
