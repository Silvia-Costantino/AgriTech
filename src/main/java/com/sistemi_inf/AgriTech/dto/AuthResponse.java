// src/main/java/com/sistemi_inf/AgriTech/dto/AuthResponse.java
package com.sistemi_inf.AgriTech.dto;

import com.sistemi_inf.AgriTech.model.Utente;

public class AuthResponse {
    private String token;
    private String ruolo;
    private String email;
    private UserInfo user; // ✅ Aggiunto oggetto user completo

    public AuthResponse(String token) {
        this.token = token;
    }

    public AuthResponse(String token, String ruolo, String email) {
        this.token = token;
        this.ruolo = ruolo;
        this.email = email;
    }

    // ✅ Nuovo costruttore con oggetto user completo
    public AuthResponse(String token, Utente utente) {
        this.token = token;
        this.ruolo = utente.getRuolo().name();
        this.email = utente.getEmail();
        this.user = new UserInfo(
            utente.getId(),
            utente.getEmail(),
            utente.getNome(),
            utente.getCognome(),
            utente.getRuolo().name()
        );
    }

    // Getters e Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRuolo() { return ruolo; }
    public void setRuolo(String ruolo) { this.ruolo = ruolo; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public UserInfo getUser() { return user; }
    public void setUser(UserInfo user) { this.user = user; }

    // ✅ Classe interna per le informazioni utente
    public static class UserInfo {
        private Long id;
        private String email;
        private String nome;
        private String cognome;
        private String ruolo;

        public UserInfo() {}

        public UserInfo(Long id, String email, String nome, String cognome, String ruolo) {
            this.id = id;
            this.email = email;
            this.nome = nome;
            this.cognome = cognome;
            this.ruolo = ruolo;
        }

        // Getters e Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }

        public String getCognome() { return cognome; }
        public void setCognome(String cognome) { this.cognome = cognome; }

        public String getRuolo() { return ruolo; }
        public void setRuolo(String ruolo) { this.ruolo = ruolo; }
    }
}
