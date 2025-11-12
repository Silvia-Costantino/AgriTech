package com.sistemi_inf.AgriTech.service;

import com.sistemi_inf.AgriTech.model.Utente;
import com.sistemi_inf.AgriTech.repository.UtenteRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class AccountService {
    private final UtenteRepository utenteRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountService(UtenteRepository utenteRepository, PasswordEncoder passwordEncoder) {
        this.utenteRepository = utenteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private Utente current() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) throw new RuntimeException("Non autenticato");
        String email = auth.getName();
        return utenteRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Utente non trovato"));
    }

    public Utente me() { return current(); }

    @Transactional
    public Utente updateContacts(Map<String, String> body) {
        Utente u = current();
        if (body.get("telefono") != null) u.setTelefono(body.get("telefono"));
        if (body.get("indirizzo") != null) u.setIndirizzo(body.get("indirizzo"));
        if (body.get("nome") != null) u.setNome(body.get("nome"));
        if (body.get("cognome") != null) u.setCognome(body.get("cognome"));
        return utenteRepository.save(u);
    }

    @Transactional
    public void changePassword(String oldPwd, String newPwd) {
        Utente u = current();
        if (oldPwd == null || newPwd == null) throw new IllegalArgumentException("Password non valida");
        if (!passwordEncoder.matches(oldPwd, u.getPassword())) throw new IllegalArgumentException("Password corrente errata");
        u.setPassword(passwordEncoder.encode(newPwd));
        utenteRepository.save(u);
    }

    @Transactional
    public void deleteAccount() {
        Utente u = current();
        // Anonimizzazione per evitare problemi di integrità referenziale
        String suffix = ("" + u.getId());
        u.setEmail("deleted-" + suffix + "@example.com");
        u.setPassword(passwordEncoder.encode("deleted" + suffix));
        u.setNome(null); u.setCognome(null); u.setTelefono(null); u.setIndirizzo(null); u.setDatiFatturazione(null);
        utenteRepository.save(u);
    }
}

