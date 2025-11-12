// src/main/java/com/sistemi_inf/AgriTech/dto/RegisterRequest.java
package com.sistemi_inf.AgriTech.dto;

public class RegisterRequest {
    private String email;
    private String password;
    private String nome;
    private String cognome;
    private String telefono;
    private String indirizzo;
    private String datiFatturazione; // Codice fiscale o P.IVA

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getCognome() { return cognome; }
    public void setCognome(String cognome) { this.cognome = cognome; }
    
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    
    public String getIndirizzo() { return indirizzo; }
    public void setIndirizzo(String indirizzo) { this.indirizzo = indirizzo; }
    
    public String getDatiFatturazione() { return datiFatturazione; }
    public void setDatiFatturazione(String datiFatturazione) { this.datiFatturazione = datiFatturazione; }
}
