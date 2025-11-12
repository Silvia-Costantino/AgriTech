package com.sistemi_inf.AgriTech.security;

import com.sistemi_inf.AgriTech.model.Utente;
import com.sistemi_inf.AgriTech.repository.UtenteRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UtenteRepository utenteRepository;

    public CustomUserDetailsService(UtenteRepository utenteRepository) {
        this.utenteRepository = utenteRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Utente utente = utenteRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato con email: " + username));

        // 🔐 Costruisce l'oggetto UserDetails usato da Spring Security
        return new User(
                utente.getEmail(),
                utente.getPassword(),
                Collections.singletonList(utente.getRuolo().getGrantedAuthority())
        );
    }
}
