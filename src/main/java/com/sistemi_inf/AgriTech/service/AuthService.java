// src/main/java/com/sistemi_inf/AgriTech/service/AuthService.java
package com.sistemi_inf.AgriTech.service;

import com.sistemi_inf.AgriTech.dto.AuthRequest;
import com.sistemi_inf.AgriTech.dto.AuthResponse;
import com.sistemi_inf.AgriTech.dto.RegisterRequest;
import com.sistemi_inf.AgriTech.model.Ruolo;
import com.sistemi_inf.AgriTech.model.Utente;
import com.sistemi_inf.AgriTech.repository.UtenteRepository;
import com.sistemi_inf.AgriTech.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UtenteRepository utenteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UtenteRepository utenteRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.utenteRepository = utenteRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ─────────────────────────────────────────────
    // 🧩 REGISTRAZIONE CLIENTE
    // ─────────────────────────────────────────────
    public AuthResponse register(RegisterRequest request) {
        Optional<Utente> existingUser = utenteRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Email già registrata");
        }

        Utente u = new Utente();
        u.setEmail(request.getEmail());
        u.setPassword(passwordEncoder.encode(request.getPassword()));
        u.setNome(request.getNome());
        u.setCognome(request.getCognome());
        u.setTelefono(request.getTelefono());
        u.setIndirizzo(request.getIndirizzo());
        u.setDatiFatturazione(request.getDatiFatturazione());
        u.setRuolo(Ruolo.CLIENTE); // ✅ coerente con nuovo enum
        utenteRepository.save(u);

        // ✅ Genera token JWT includendo email e ruolo
        String token = jwtUtil.generateToken(u.getEmail());

        // ✅ Restituisce AuthResponse con oggetto user completo
        return new AuthResponse(token, u);
    }

    // ─────────────────────────────────────────────
    // 🔐 LOGIN CLIENTE / DIPENDENTE / SOCIO
    // ─────────────────────────────────────────────
    public AuthResponse login(AuthRequest request) {
        Utente u = utenteRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Utente non trovato"));

        if (!passwordEncoder.matches(request.getPassword(), u.getPassword())) {
            throw new IllegalArgumentException("Credenziali non valide");
        }

        String token = jwtUtil.generateToken(u.getEmail());

        // ✅ Restituisce AuthResponse con oggetto user completo per tutti i ruoli
        return new AuthResponse(token, u);
    }
}
