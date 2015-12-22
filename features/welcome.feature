Feature: Welcome screen

  Scenario: During page load waiting animation is shown
    When user visits bare page
    Then document body has class preload
    And animation is shown