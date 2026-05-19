@create_org
Feature: Super Admin Organizations Creation

  Background:
    Given I am authenticated as a Super Admin
    And I navigate to the Super Admin Dashboard

  @complete
  Scenario: Create a new organization with manual provisioning
    Given I navigate to the Organizations page
    When I click on the "Create Organization" button
    And I fill in the organization info:
      | Field             | Value              |
      | Organization Name | [Auto] Random ORG  |
      | Organization Code | [Auto] COMPANY     |
      | Description       | Automated Test ORG |
      | Provisioning Mode | Manual             |
      | Platforms         | VIS, NFT, FT       |
    And I click Next on the organization modal
    And I configure the feature flags:
      | Platform | Threads | Run Option | NLP  |
      | NFT      |       3 | within     | -    |
      | FT       |       2 | -          | true |
    And I click "Create Organization" to finish
    Then the organization "[Auto] Random ORG" should be visible in the list

  @suspension @complete
  Scenario: Create and Suspend an organization
    Given I navigate to the Organizations page
    When I click on the "Create Organization" button
    And I fill in the organization info:
      | Field             | Value               |
      | Organization Name | [Auto] Suspend ORG  |
      | Organization Code | [Auto] SUSP         |
      | Description       | For suspension test |
      | Tenant Type       | Enterprise          |
      | Provisioning Mode | Auto                |
      | Platforms         | VIS, NFT            |
    And I click Next on the organization modal
    And I configure the feature flags:
      | Platform | Threads | Run Option | NLP |
      | NFT      |       1 | within     | -   |
    And I click "Create Organization" to finish
    Then the organization "[Auto] Suspend ORG" should be visible in the list
    When I suspend the organization "[Auto] Suspend ORG"
    And I toggle "Show suspended" organizations to "on"
    Then the organization "[Auto] Suspend ORG" should have status "SUSPENDED"

  @filtering @complete
  Scenario: Filter Organizations by status
    Given I navigate to the Organizations page
    When I toggle "Show suspended" organizations to "on"
    Then I should see suspended organizations in the list

  @high_ai @create_edit
  Scenario: Create and Edit an organization
    Given I navigate to the Organizations page
    When I create a new organization with code "TESTEDIT" and manual provisioning
    Then I should see the created organization in the list
    When I edit that organization name to "Edited Test Org"
    Then I should see the organization name updated to "Edited Test Org"
