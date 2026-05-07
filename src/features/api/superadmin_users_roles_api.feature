@api @users_roles_api
Feature: Super Admin Users and Roles API

  @api @get_users @complete
  Scenario: Validate users list API
    Given I have a valid authentication token
    When I send a GET request to "/admin/users"
    Then the response status should be 200
    And the response should contain a list of users

  @api @get_roles @complete
  Scenario: Validate roles list API
    Given I have a valid authentication token
    When I send a GET request to "/admin/roles"
    Then the response status should be 200
    And the response should contain a list of roles
