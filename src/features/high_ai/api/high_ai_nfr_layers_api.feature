@high_ai_api @nfr_layers_api
Feature: High AI NFR and Layers API

  Background:
    Given I have a valid High AI API session
  # ─── Project ID Extraction ────────────────────────────────────────────────

  @high_ai_api @T-HAI-NFR-001
  Scenario: Extract and store NFR project ID for West Solutions Ltd
    When I send a GET request to the High AI projects endpoint
    Then the project named "West Solutions Ltd" should exist in the response
    And I save the ID of project "West Solutions Ltd" as the NFR project ID

  @high_ai_api @T-HAI-NFR-002
  Scenario: Extract and store functional project ID for WJT Solutions Ltd
    When I send a GET request to the High AI projects endpoint
    Then the project named "WJT Solutions Ltd" should exist in the response
    And I save the ID of project "WJT Solutions Ltd" as the functional project ID

  @high_ai_api @T-HAI-NFR-003
  Scenario: Validate stored NFR project ID is a valid UUID
    When I send a GET request to the High AI projects endpoint
    And I save the ID of project "West Solutions Ltd" as the NFR project ID
    Then the stored NFR project ID should be a valid UUID

  @high_ai_api @T-HAI-NFR-004
  Scenario: Validate stored functional project ID is a valid UUID
    When I send a GET request to the High AI projects endpoint
    And I save the ID of project "WJT Solutions Ltd" as the functional project ID
    Then the stored functional project ID should be a valid UUID
  # ─── NFR Layers API ───────────────────────────────────────────────────────

  @high_ai_api @T-HAI-NFR-005
  Scenario: NFR layers API returns 200
    When I send a GET request to the NFR layers endpoint
    Then the High AI API response status should be 200

  @high_ai_api @T-HAI-NFR-006
  Scenario: NFR layers response contains a layers array and count
    When I send a GET request to the NFR layers endpoint
    Then the layers response should contain a "layers" array
    And the layers response should contain a "count" field

  @high_ai_api @T-HAI-NFR-007
  Scenario: NFR layers count matches the layers array length
    When I send a GET request to the NFR layers endpoint
    Then the layers count should match the length of the layers array

  @high_ai_api @T-HAI-NFR-008
  Scenario: Each NFR layer has required fields
    When I send a GET request to the NFR layers endpoint
    Then each layer should have the following fields:
      | Field           |
      | layer_id        |
      | project_id      |
      | organisation_id |
      | layer_name      |
      | source          |
      | is_deleted      |
      | created_at      |
      | updated_at      |
      | children        |
      | executions      |

  @high_ai_api @T-HAI-NFR-009
  Scenario: Each NFR layer source should be "nfr"
    When I send a GET request to the NFR layers endpoint
    Then each layer source should be "nfr"

  @high_ai_api @T-HAI-NFR-010
  Scenario: Each NFR layer IDs should be valid UUIDs
    When I send a GET request to the NFR layers endpoint
    Then each layer layer_id should be a valid UUID
    And each layer project_id should match the NFR project ID

  @high_ai_api @T-HAI-NFR-011
  Scenario: Each NFR layer has executions with required fields
    When I send a GET request to the NFR layers endpoint
    Then each layer executions should have the following fields:
      | Field         |
      | id            |
      | test_type     |
      | executionName |
      | created_at    |

  @high_ai_api @T-HAI-NFR-012
  Scenario: Each NFR execution test_type should be "NFR"
    When I send a GET request to the NFR layers endpoint
    Then each layer execution test_type should be "NFR"

  @high_ai_api @T-HAI-NFR-013
  Scenario: Each NFR execution has a non-empty testingTechniques array
    When I send a GET request to the NFR layers endpoint
    Then each NFR layer execution should have a non-empty testingTechniques array
  # ─── Functional Layers API ────────────────────────────────────────────────

  @high_ai_api @T-HAI-NFR-014
  Scenario: Functional layers API returns 200
    When I send a GET request to the functional layers endpoint
    Then the High AI API response status should be 200

  @high_ai_api @T-HAI-NFR-015
  Scenario: Functional layers response contains a layers array and count
    When I send a GET request to the functional layers endpoint
    Then the layers response should contain a "layers" array
    And the layers response should contain a "count" field

  @high_ai_api @T-HAI-NFR-016
  Scenario: Functional layers count matches the layers array length
    When I send a GET request to the functional layers endpoint
    Then the layers count should match the length of the layers array

  @high_ai_api @T-HAI-NFR-017
  Scenario: Each functional layer has required fields
    When I send a GET request to the functional layers endpoint
    Then each layer should have the following fields:
      | Field           |
      | layer_id        |
      | project_id      |
      | organisation_id |
      | layer_name      |
      | source          |
      | is_deleted      |
      | created_at      |
      | updated_at      |
      | children        |
      | executions      |

  @high_ai_api @T-HAI-NFR-018
  Scenario: Each functional layer source should be "functional"
    When I send a GET request to the functional layers endpoint
    Then each layer source should be "functional"

  @high_ai_api @T-HAI-NFR-019
  Scenario: Each functional layer IDs should be valid UUIDs
    When I send a GET request to the functional layers endpoint
    Then each layer layer_id should be a valid UUID
    And each layer project_id should match the functional project ID

  @high_ai_api @T-HAI-NFR-020
  Scenario: Each functional layer has executions with required fields
    When I send a GET request to the functional layers endpoint
    Then each layer executions should have the following fields:
      | Field         |
      | id            |
      | test_type     |
      | executionName |
      | created_at    |

  @high_ai_api @T-HAI-NFR-021
  Scenario: Each functional execution test_type should be "FUNCTIONAL"
    When I send a GET request to the functional layers endpoint
    Then each layer execution test_type should be "FUNCTIONAL"
  # ─── Functional Execution Metrics API ────────────────────────────────────

  @high_ai_api @T-HAI-NFR-022
  Scenario: Extract and store a functional execution ID from layers response
    When I send a GET request to the functional layers endpoint
    Then I save the first execution ID from the functional layers response

  @high_ai_api @T-HAI-NFR-023
  Scenario: Functional execution metrics API returns 200
    When I send a GET request to the functional execution metrics endpoint
    Then the High AI API response status should be 200

  @high_ai_api @T-HAI-NFR-024
  Scenario: Functional execution metrics response has all required fields
    When I send a GET request to the functional execution metrics endpoint
    Then the functional execution metrics response should have the following fields:
      | Field               |
      | executionId         |
      | executionRate       |
      | requirementCoverage |
      | automationCoverage  |
      | defectDensity       |
      | automationPassRate  |
      | automationFailRate  |
      | totalPlannedTests   |
      | totalExecutedTests  |
      | passedTests         |
      | failedTests         |
      | skippedTests        |
      | blockedTests        |
      | automatedTests      |
      | manualTests         |
      | totalRequirements   |
      | coveredRequirements |
      | totalDefects        |
      | createdAt           |
      | updatedAt           |

  @high_ai_api @T-HAI-NFR-025
  Scenario: Functional execution metrics executionId matches the stored execution ID
    When I send a GET request to the functional execution metrics endpoint
    Then the metrics executionId should match the stored functional execution ID

  @high_ai_api @T-HAI-NFR-026
  Scenario: Functional execution metrics numeric fields are non-negative
    When I send a GET request to the functional execution metrics endpoint
    Then all numeric fields in the functional execution metrics should be non-negative

  @high_ai_api @T-HAI-NFR-027
  Scenario: Functional execution metrics timestamps are valid ISO date strings
    When I send a GET request to the functional execution metrics endpoint
    Then the functional execution metrics createdAt and updatedAt should be valid ISO date strings
  # ─── Functional Quality Summary API ──────────────────────────────────────

  @high_ai_api @T-HAI-NFR-028
  Scenario: Functional quality summary API returns 200
    When I send a GET request to the functional quality summary endpoint
    Then the High AI API response status should be 200

  @high_ai_api @T-HAI-NFR-029
  Scenario: Functional quality summary response contains a functional object
    When I send a GET request to the functional quality summary endpoint
    Then the quality summary response should contain a "functional" object

  @high_ai_api @T-HAI-NFR-030
  Scenario: Functional quality summary contains categoryStatuses array
    When I send a GET request to the functional quality summary endpoint
    Then the quality summary functional object should contain a "categoryStatuses" array

  @high_ai_api @T-HAI-NFR-031
  Scenario: Each categoryStatus has required fields
    When I send a GET request to the functional quality summary endpoint
    Then each categoryStatus should have the following fields:
      | Field       |
      | label       |
      | score       |
      | status      |
      | metrics     |
      | category    |
      | statusLabel |

  @high_ai_api @T-HAI-NFR-032
  Scenario: Each categoryStatus status is a valid value
    When I send a GET request to the functional quality summary endpoint
    Then each categoryStatus status should be one of "GOOD", "WARNING" or "POOR"

  @high_ai_api @T-HAI-NFR-033
  Scenario: Each categoryStatus score is a non-negative number
    When I send a GET request to the functional quality summary endpoint
    Then each categoryStatus score should be a non-negative number

  @high_ai_api @T-HAI-NFR-034
  Scenario: Functional quality summary contains executiveSummary
    When I send a GET request to the functional quality summary endpoint
    Then the quality summary functional object should contain a non-empty "executiveSummary" string

  @high_ai_api @T-HAI-NFR-035
  Scenario: Functional quality summary contains recommendations array
    When I send a GET request to the functional quality summary endpoint
    Then the quality summary functional object should contain a "recommendations" array

  @high_ai_api @T-HAI-NFR-036
  Scenario: Each recommendation has required fields
    When I send a GET request to the functional quality summary endpoint
    Then each recommendation should have the following fields:
      | Field    |
      | title    |
      | category |
      | priority |

  @high_ai_api @T-HAI-NFR-037
  Scenario: Each recommendation priority is a valid value
    When I send a GET request to the functional quality summary endpoint
    Then each recommendation priority should be one of "critical", "medium" or "low"

  @high_ai_api @T-HAI-NFR-038
  Scenario: Functional quality summary generatedAt is a valid ISO date string
    When I send a GET request to the functional quality summary endpoint
    Then the quality summary generatedAt should be a valid ISO date string

  @high_ai_api @T-HAI-NFR-039
  Scenario: Functional quality summary llmStatus is success
    When I send a GET request to the functional quality summary endpoint
    Then the quality summary llmStatus should be "success"
  # ─── Share Report API ────────────────────────────────────────────────────

  @high_ai_api @T-HAI-NFR-040
  Scenario: Share report API returns 201
    When I send a POST request to the share report endpoint
    Then the High AI API response status should be 201

  @high_ai_api @T-HAI-NFR-041
  Scenario: Share report response has all required fields
    When I send a POST request to the share report endpoint
    Then the share report response should have the following fields:
      | Field        |
      | shareUrl     |
      | expiresAt    |
      | expiresAtIso |
      | testType     |
      | hasAiSummary |

  @high_ai_api @T-HAI-NFR-042
  Scenario: Share report shareUrl is a valid URL
    When I send a POST request to the share report endpoint
    Then the share report shareUrl should be a valid URL

  @high_ai_api @T-HAI-NFR-043
  Scenario: Share report testType is functional
    When I send a POST request to the share report endpoint
    Then the share report testType should be "functional"

  @high_ai_api @T-HAI-NFR-044
  Scenario: Share report expiresAtIso is a valid ISO date string
    When I send a POST request to the share report endpoint
    Then the share report expiresAtIso should be a valid ISO date string

  @high_ai_api @T-HAI-NFR-045
  Scenario: Share report expiresAt is a positive number
    When I send a POST request to the share report endpoint
    Then the share report expiresAt should be a positive number

  @high_ai_api @T-HAI-NFR-046
  Scenario: Share report hasAiSummary is a boolean
    When I send a POST request to the share report endpoint
    Then the share report hasAiSummary should be a boolean
  # ─── NFR Quality Summary API ──────────────────────────────────────────────

  @high_ai_api @T-HAI-NFR-047
  Scenario: Extract and store an NFR execution ID from layers response
    When I send a GET request to the NFR layers endpoint
    Then I save the first execution ID from the NFR layers response

  @high_ai_api @T-HAI-NFR-048
  Scenario: NFR quality summary API returns 200
    When I send a GET request to the NFR quality summary endpoint
    Then the High AI API response status should be 200

  @high_ai_api @T-HAI-NFR-049
  Scenario: NFR quality summary response contains an nfr object
    When I send a GET request to the NFR quality summary endpoint
    Then the NFR quality summary response should contain a "nfr" object

  @high_ai_api @T-HAI-NFR-050
  Scenario: NFR quality summary contains categoryStatuses array
    When I send a GET request to the NFR quality summary endpoint
    Then the NFR quality summary object should contain a "categoryStatuses" array

  @high_ai_api @T-HAI-NFR-051
  Scenario: Each NFR categoryStatus has required fields
    When I send a GET request to the NFR quality summary endpoint
    Then each NFR categoryStatus should have the following fields:
      | Field       |
      | label       |
      | score       |
      | status      |
      | metrics     |
      | category    |
      | statusLabel |

  @high_ai_api @T-HAI-NFR-052
  Scenario: Each NFR categoryStatus status is a valid value
    When I send a GET request to the NFR quality summary endpoint
    Then each NFR categoryStatus status should be one of "GOOD", "WARNING" or "POOR"

  @high_ai_api @T-HAI-NFR-053
  Scenario: Each NFR categoryStatus score is a non-negative number
    When I send a GET request to the NFR quality summary endpoint
    Then each NFR categoryStatus score should be a non-negative number

  @high_ai_api @T-HAI-NFR-054
  Scenario: NFR quality summary contains executiveSummary
    When I send a GET request to the NFR quality summary endpoint
    Then the NFR quality summary object should contain a non-empty "executiveSummary" string

  @high_ai_api @T-HAI-NFR-055
  Scenario: NFR quality summary contains recommendations array
    When I send a GET request to the NFR quality summary endpoint
    Then the NFR quality summary object should contain a "recommendations" array

  @high_ai_api @T-HAI-NFR-056
  Scenario: Each NFR recommendation has required fields
    When I send a GET request to the NFR quality summary endpoint
    Then each NFR recommendation should have the following fields:
      | Field    |
      | title    |
      | category |
      | priority |

  @high_ai_api @T-HAI-NFR-057
  Scenario: NFR quality summary generatedAt is a valid ISO date string
    When I send a GET request to the NFR quality summary endpoint
    Then the NFR quality summary generatedAt should be a valid ISO date string

  @high_ai_api @T-HAI-NFR-058
  Scenario: NFR quality summary llmStatus is success
    When I send a GET request to the NFR quality summary endpoint
    Then the NFR quality summary llmStatus should be "success"
  # ─── NFR Execution Detail APIs ────────────────────────────────────────────

  @high_ai_api @T-HAI-NFR-059
  Scenario: NFR performance API returns 200
    When I send a GET request to the NFR performance endpoint
    Then the High AI API response status should be 200

  @high_ai_api @T-HAI-NFR-060
  Scenario: NFR performance response has data_status OK and summary with test_suites
    When I send a GET request to the NFR performance endpoint
    Then the NFR execution detail response should have data_status "OK" with summary and test_suites

  @high_ai_api @T-HAI-NFR-061
  Scenario: NFR link-validation API returns 200
    When I send a GET request to the NFR link-validation endpoint
    Then the High AI API response status should be 200

  @high_ai_api @T-HAI-NFR-062
  Scenario: NFR link-validation response has data_status OK and summary with test_suites
    When I send a GET request to the NFR link-validation endpoint
    Then the NFR execution detail response should have data_status "OK" with summary and test_suites

  @high_ai_api @T-HAI-NFR-063
  Scenario: NFR SEO API returns 200
    When I send a GET request to the NFR SEO endpoint
    Then the High AI API response status should be 200

  @high_ai_api @T-HAI-NFR-064
  Scenario: NFR SEO response has data_status OK and summary with test_suites
    When I send a GET request to the NFR SEO endpoint
    Then the NFR execution detail response should have data_status "OK" with summary and test_suites

  @high_ai_api @T-HAI-NFR-065
  Scenario: NFR visual API returns 200
    When I send a GET request to the NFR visual endpoint
    Then the High AI API response status should be 200

  @high_ai_api @T-HAI-NFR-066
  Scenario: NFR visual response has data_status OK and summary with browsers
    When I send a GET request to the NFR visual endpoint
    Then the NFR visual response should have data_status "OK" with summary and browsers
  # ─── RRI Calculate API ───────────────────────────────────────────────────────

  @high_ai_api @rri_api @T-HAI-NFR-067
  Scenario: RRI calculate API returns 200
    When I send a GET request to the RRI calculate endpoint
    Then the High AI API response status should be 200

  @high_ai_api @rri_api @T-HAI-NFR-068
  Scenario: RRI response has valid release_readiness_index structure
    When I send a GET request to the RRI calculate endpoint
    Then the RRI response should have a valid release_readiness_index with score, decision and narrative

  @high_ai_api @rri_api @T-HAI-NFR-069
  Scenario: RRI decision is a valid value
    When I send a GET request to the RRI calculate endpoint
    Then the RRI decision should be one of "GO", "CONDITIONAL" or "NO_GO"

  @high_ai_api @rri_api @T-HAI-NFR-070
  Scenario: RRI timestamp is a valid ISO date string
    When I send a GET request to the RRI calculate endpoint
    Then the RRI release_readiness_index timestamp should be a valid ISO date string

  @high_ai_api @rri_api @T-HAI-NFR-071
  Scenario: RRI functional_quality pillar has required fields
    When I send a GET request to the RRI calculate endpoint
    Then the RRI functional_quality pillar should have score, weight, contribution and components

  @high_ai_api @rri_api @T-HAI-NFR-072
  Scenario: RRI coverage_completeness pillar has required fields
    When I send a GET request to the RRI calculate endpoint
    Then the RRI coverage_completeness pillar should have score, weight, contribution and components

  @high_ai_api @rri_api @T-HAI-NFR-073
  Scenario: RRI functional_quality components have required fields
    When I send a GET request to the RRI calculate endpoint
    Then the RRI functional_quality components should have test_pass_rate and defect_free_rate

  @high_ai_api @rri_api @T-HAI-NFR-074
  Scenario: RRI coverage_completeness components have required fields
    When I send a GET request to the RRI calculate endpoint
    Then the RRI coverage_completeness components should have execution_rate, automation_coverage and requirement_coverage

  @high_ai_api @rri_api @T-HAI-NFR-075
  Scenario: RRI pillar scores are between 0 and 100
    When I send a GET request to the RRI calculate endpoint
    Then all RRI pillar scores should be between 0 and 100

  @high_ai_api @rri_api @T-HAI-NFR-076
  Scenario: RRI hard_gates has required boolean fields
    When I send a GET request to the RRI calculate endpoint
    Then the RRI hard_gates should have required boolean fields
