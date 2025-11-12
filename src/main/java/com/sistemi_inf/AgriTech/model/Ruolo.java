package com.sistemi_inf.AgriTech.model;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.GrantedAuthority;

public enum Ruolo {
    CLIENTE,
    DIPENDENTE,
    SOCIO;

    public GrantedAuthority getGrantedAuthority() {
        return new SimpleGrantedAuthority("ROLE_" + this.name());
    }
}