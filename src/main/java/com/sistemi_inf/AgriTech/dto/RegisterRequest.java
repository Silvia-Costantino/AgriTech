// src/main/java/com/sistemi_inf/AgriTech/dto/RegisterRequest.java
package com.sistemi_inf.AgriTech.dto;

public class RegisterRequest {
    private String email;
    private String password;
    private String nome;
    private String cognome;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCognome() { return cognome; }
    public void setCognome(String cognome) { this.cognome = cognome; }
}
