package com.correos.masivos.email.domain.model;

public class EmailProvider {
    private final String name;
    private final String displayName;
    private final int priority;

    public EmailProvider(String name, String displayName, int priority) {
        this.name = name;
        this.displayName = displayName;
        this.priority = priority;
    }

    public String getName() {
        return name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getPriority() {
        return priority;
    }
}