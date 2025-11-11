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

    // REGISTRAZIONE CLIENTE
    public AuthResponse register(RegisterRequest request) {
        Optional<Utente> existingUser = utenteRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email già registrata");
        }

        Utente u = new Utente();
        u.setEmail(request.getEmail());
        u.setPassword(passwordEncoder.encode(request.getPassword()));
        u.setNome(request.getNome());
        u.setCognome(request.getCognome());
        u.setRuolo(Ruolo.ROLE_CLIENTE); // sempre CLIENTE per registrazione front-end
        utenteRepository.save(u);

        String token = jwtUtil.generateToken(u.getEmail()); // genera token con username
        return new AuthResponse(token);
    }

    // LOGIN CLIENTE / ADMIN
    public AuthResponse login(AuthRequest request) {
        Utente u = utenteRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        if (!passwordEncoder.matches(request.getPassword(), u.getPassword())) {
            throw new RuntimeException("Credenziali non valide");
        }

        String token = jwtUtil.generateToken(u.getEmail()); // genera token con username
        return new AuthResponse(token);
    }
}
