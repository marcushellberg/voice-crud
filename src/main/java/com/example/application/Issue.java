package com.example.application;

public record Issue(
    Long id,
    String title,
    String description,
    IssueStatus status,
    String assignee
) {
}
