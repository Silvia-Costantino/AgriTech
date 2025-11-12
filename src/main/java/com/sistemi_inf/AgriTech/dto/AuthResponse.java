// src/main/java/com/sistemi_inf/AgriTech/dto/AuthResponse.java
package com.sistemi_inf.AgriTech.dto;

public class AuthResponse {
    private String token;
    private String ruolo;
    private String email;

    public AuthResponse(String token) {
        this.token = token;
    }

    public AuthResponse(String token, String ruolo, String email) {
        this.token = token;
        this.ruolo = ruolo;
        this.email = email;
    }

    // Getters e Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRuolo() { return ruolo; }
    public void setRuolo(String ruolo) { this.ruolo = ruolo; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
