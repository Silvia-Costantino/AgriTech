package com.sistemi_inf.AgriTech.config;

import com.sistemi_inf.AgriTech.model.*;
import com.sistemi_inf.AgriTech.repository.PreventivoRepository;
import com.sistemi_inf.AgriTech.repository.UtenteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Configuration
public class CrmDataLoader {

    @Bean
    CommandLineRunner seedCrm(UtenteRepository utenteRepository,
                              PreventivoRepository preventivoRepository,
                              PasswordEncoder passwordEncoder) {
        return args -> {
            // Clienti di default (se non esistono già per email)
            Utente c1 = ensureCliente(utenteRepository, passwordEncoder,
                    "marco.gialli@example.com", "Marco", "Gialli", "+39 3331112233", "Via Roma 10, Torino");
            Utente c2 = ensureCliente(utenteRepository, passwordEncoder,
                    "laura.neri@example.com", "Laura", "Neri", "+39 3334445566", "Via Milano 22, Milano");
            Utente c3 = ensureCliente(utenteRepository, passwordEncoder,
                    "paolo.blu@example.com", "Paolo", "Blu", "+39 3337778899", "Via Napoli 5, Napoli");

            // Preventivi di default se tabella vuota
            if (preventivoRepository.count() == 0) {
                preventivoRepository.save(mkPreventivo(c1, "Trattore Serie X - Base", new BigDecimal("18500"), new BigDecimal("500"), LocalDate.now().plusDays(30)));
                preventivoRepository.save(mkPreventivo(c1, "Pala frontale + Montaggio", new BigDecimal("2900"), BigDecimal.ZERO, LocalDate.now().plusDays(20)));

                preventivoRepository.save(mkPreventivo(c2, "Trattrice compatta - Modello C", new BigDecimal("12990"), new BigDecimal("990"), LocalDate.now().plusDays(25)));

                preventivoRepository.save(mkPreventivo(c3, "Kit manutenzione annuale", new BigDecimal("850"), new BigDecimal("50"), LocalDate.now().plusDays(15)));
            }
        };
    }

    private Utente ensureCliente(UtenteRepository repo, PasswordEncoder encoder,
                                 String email, String nome, String cognome, String tel, String indirizzo) {
        return repo.findByEmail(email).orElseGet(() -> {
            Utente u = new Utente();
            u.setEmail(email);
            u.setPassword(encoder.encode("password"));
            u.setNome(nome);
            u.setCognome(cognome);
            u.setTelefono(tel);
            u.setIndirizzo(indirizzo);
            u.setRuolo(Ruolo.CLIENTE);
            return repo.save(u);
        });
    }

    private Preventivo mkPreventivo(Utente cli, String modello, BigDecimal prezzo, BigDecimal sconto, LocalDate validita) {
        Preventivo p = new Preventivo();
        p.setCliente(cli);
        p.setModello(modello);
        p.setPrezzo(prezzo);
        p.setSconto(sconto);
        p.setValidita(validita);
        p.setStato(StatoPreventivo.APERTO);
        return p;
    }
}

