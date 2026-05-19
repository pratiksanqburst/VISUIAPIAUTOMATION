@high_ai1 @dashboard
Feature: High AI Visualization Dashboard

  Background:
    Given I am on the visualization login page
    When I sign in as a visualization user
    And I open the Visualization platform dashboard

  @T-048
  Scenario: Verify AI Summary button is visible and clickable
    Then the AI Summary button should be clearly visible on the dashboard
    When I click the AI Summary button
    Then the AI Summary panel should open

  @T-049
  Scenario: Verify Project Health Overview KPI data matches AI Summary
    When I observe the Project Health Overview KPI values
    And I click the AI Summary button
    Then the AI Quality Summary values should match the Project Health Overview KPI values

  @T-050
  Scenario: Verify Functional Testing KPIs are visible
    When I navigate to the Functional Testing dashboard
    Then I should see the following functional KPIs:
      | KPI                   |
      | Total Planned Tests   |
      | Total Executed Tests  |
      | Automation Pass Count |
      | Automation Pass Rate  |
      | Defect Density        |
      | Total Test Coverage   |
      | Requirement Coverage  |
      | Automation Coverage   |

  @T-051
  Scenario: Verify Admin Panel is accessible and displays correct fields
    When I navigate to the Admin Panel via Settings
    Then I should see the heading "Role Based Actions"
    And the Admin Panel table should have the following columns:
      | Column            |
      | Name              |
      | Email ID          |
      | Role Based Access |
    And the Refresh button should be visible

  @T-052
  Scenario: Verify Threshold Settings page displays correct fields
    When I navigate to Threshold Settings via Settings
    Then I should see the heading "Threshold Settings"
    And the Threshold Settings page should contain the following sections:
      | Section        |
      | Functional     |
      | Non-Functional |
    And the Threshold Settings table should contain the following columns:
      | Column       |
      | PROJECT NAME |
      | ACTIONS      |

  @T-053
  Scenario: Verify RRI Analysis page displays correct fields
    When I navigate to RRI Analysis via Settings
    Then I should see the heading "RRI Analysis"
    And the RRI Analysis page should contain the following sections:
      | Section                |
      | FUNCTIONAL TESTING     |
      | NON-FUNCTIONAL TESTING |
    And the search field "Search functional..." should be visible
    And the search field "Search non-functional..." should be visible

  @T-054
  Scenario: Verify Accessibility KPI components on Non-Functional Testing dashboard
    When I navigate to the Non-Functional Testing dashboard
    Then I should see the following non-functional KPIs:
      | KPI                      |
      | WCAG Compliance          |
      | Total Issues             |
      | Critical Violations      |
      | Defect Density Per Page  |
      | Issue Severity Breakdown |

  @T-055
  Scenario: Verify Client Side Performance KPI components on Non-Functional Testing dashboard
    When I navigate to the Non-Functional Testing dashboard
    And I select the non-functional category "Client Side Performance"
    Then I should see the following non-functional KPIs:
      | KPI                           |
      | Performance Score             |
      | Cumulative Layout Shift (CLS) |
      | Page Load Time                |
      | Total Blocking Time           |
      | Speed Index                   |

  @T-056
  Scenario: Verify Link Validation KPI components on Non-Functional Testing dashboard
    When I navigate to the Non-Functional Testing dashboard
    And I select the non-functional category "Link Validation"
    Then I should see the following non-functional KPIs:
      | KPI                      |
      | Link Validation Score    |
      | Broken Links             |
      | Total Tested             |
      | Status Code Distribution |

  @T-057
  Scenario: Verify Search Engine Optimization KPI components on Non-Functional Testing dashboard
    When I navigate to the Non-Functional Testing dashboard
    And I select the non-functional category "Search Engine Optimization"
    Then I should see the following non-functional KPIs:
      | KPI                |
      | SEO Score          |
      | Meta Coverage      |
      | Pages Tested       |
      | Passed Audits      |
      | SEO Issues Summary |

  @T-058
  Scenario: Verify Visual Integrity KPI components on Non-Functional Testing dashboard
    When I navigate to the Non-Functional Testing dashboard
    And I select the non-functional category "Visual Integrity"
    Then I should see the following non-functional KPIs:
      | KPI                     |
      | Visual Drift Percentage |
      | Passed Snapshots        |
      | Snapshot Pass Rate      |
      | Failed Snapshots        |
      | Browser Comparison      |

  @T-059
  Scenario: Verify Download Report button is available on Non-Functional Testing dashboard
    When I navigate to the Non-Functional Testing dashboard
    Then the Download Report button should be visible

  @T-060
  Scenario: Verify Share Link button is available on Non-Functional Testing dashboard
    When I navigate to the Non-Functional Testing dashboard
    Then the Share Link button should be visible

  @T-061
  Scenario: Verify action buttons are available on the Functional Testing dashboard
    When I navigate to the Functional Testing dashboard
    Then the AI Summary button should be clearly visible on the dashboard
    And the Download Report button should be visible
    And the Share Link button should be visible
    And I should see the heading "Functional Testing"

  @T-062
  Scenario: Verify LLM Configuration page displays correct fields
    When I navigate to LLM Configuration via Settings
    Then I should see the heading "LLM Configuration"
    And the LLM Configuration table should have the following columns:
      | Column     |
      | Base URL   |
      | Model Name |
      | API Key    |
      | Actions    |
    And the Edit and Delete action buttons should be visible

  @T-063
  Scenario: Verify Project Management page displays correct configurations
    When I navigate to Project Management via Settings
    Then I should see the heading "Project Management"
    And the Project Management page should contain the following sections:
      | Section                    |
      | Jira Configuration         |
      | Azure DevOps Configuration |

  @T-064
  Scenario: Verify Visualization dashboard overview metrics are visible
    Then I should see the following dashboard overview metrics:
      | Metric                     |
      | Total Projects             |
      | Total Users                |
      | Functional Executions      |
      | NFT Executions             |
      | ACCESSIBILITY              |
      | CLIENT SIDE PERFORMANCE    |
      | SEARCH ENGINE OPTIMIZATION |
      | VISUAL INTEGRITY           |

  @T-065
  Scenario: Verify build filter dropdown options on Functional Testing dashboard
    When I navigate to the Functional Testing dashboard
    Then the build filter dropdowns should be visible
    And the builds filter should contain the following options:
      | Option         |
      | All builds     |
      | Last 5 builds  |
      | Last 10 builds |
      | Last 20 builds |

  @T-066
  Scenario: Verify AI Summary panel content on Non-Functional Testing dashboard
    When I navigate to the Non-Functional Testing dashboard
    And I click the AI Summary button
    Then the Non-Functional AI Summary panel should display the following sections:
      | Section             |
      | EXECUTIVE SUMMARY   |
      | TOP RECOMMENDATIONS |
      | CATEGORY STATUS     |
      | AI Quality          |

  @T-067
  Scenario: Verify filter fields are visible on Non-Functional Testing dashboard
    When I navigate to the Non-Functional Testing dashboard
    Then the Non-Functional Testing filter labels should be visible:
      | Label      |
      | TEST SUITE |
      | TEST CASE  |
      | PAGE URL   |
    And the test suite dropdown filter should be visible
    And the filter placeholder "Please select filter to apply" should be visible

  @T-068
  Scenario: Verify KPI project info tooltip descriptions on the dashboard
    When I click the functional testing project info icon
    Then the project info tooltip should contain "This is the default project for functional testing. It can be changed under the Functional Testing Suite."
    And the non-functional testing project info icon should be visible
