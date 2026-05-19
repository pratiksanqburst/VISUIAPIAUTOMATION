@api @org_api
Feature: Super Admin Organizations API

  @api @get_orgs @complete
  Scenario: Validate organizations list API
    Given I have a valid authentication token
    When I send a GET request to "/admin/orgs"
    Then the response status should be 200
    And the response should contain a list of organizations
    And each organization in the list should have valid data
