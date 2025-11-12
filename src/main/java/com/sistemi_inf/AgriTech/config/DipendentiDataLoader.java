package com.sistemi_inf.AgriTech.config;

import com.sistemi_inf.AgriTech.model.*;
import com.sistemi_inf.AgriTech.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DipendentiDataLoader {

    @Bean
    CommandLineRunner seedDipendenti(DipendenteRepository dipRepo,
                                     TurnoDipendenteRepository turnoRepo,
                                     FeriePermessoRepository ferieRepo) {
        return args -> {
            if (dipRepo.count() == 0) {
                Dipendente d1 = mkDip("RSSMRA80A01H501Z","Mario","Rossi","Meccanico");
                Dipendente d2 = mkDip("BNCLRA85C11F205X","Laura","Bianchi","Magazziniere");
                Dipendente d3 = mkDip("VRDGPP90D22L219Y","Giovanni","Verdi","Tecnico Officina");
                Dipendente d4 = mkDip("NRIFRN75B15C351J","Francesca","Neri","Amministrazione");
                Dipendente d5 = mkDip("CNTLGI82E05M082K","Luigi","Conti","Socio");
                dipRepo.saveAll(List.of(d1,d2,d3,d4,d5));
            }

            if (turnoRepo.count() == 0) {
                turnoRepo.save(mkTurno("RSSMRA80A01H501Z", List.of("Lun","Mar","Mer"), "08:00-16:00"));
                turnoRepo.save(mkTurno("BNCLRA85C11F205X", List.of("Gio","Ven","Sab"), "09:00-17:00"));
                turnoRepo.save(mkTurno("VRDGPP90D22L219Y", List.of("Lun","Mer","Ven"), "10:00-18:00"));
                turnoRepo.save(mkTurno("NRIFRN75B15C351J", List.of("Mar","Gio"), "08:00-14:00"));
                turnoRepo.save(mkTurno("CNTLGI82E05M082K", List.of("Lun","Mar","Gio"), "09:00-13:00"));
            }

            if (ferieRepo.count() == 0) {
                ferieRepo.save(mkFerie("BNCLRA85C11F205X", 3, Arrays.asList("2025-08-02","2025-08-03","2025-08-04")));
                ferieRepo.save(mkFerie("VRDGPP90D22L219Y", 1, List.of("2025-08-10")));
                ferieRepo.save(mkFerie("NRIFRN75B15C351J", 2, Arrays.asList("2025-08-15","2025-08-16")));
            }
        };
    }

    private Dipendente mkDip(String cf, String nome, String cognome, String mansione) {
        Dipendente d = new Dipendente();
        d.setCf(cf); d.setNome(nome); d.setCognome(cognome); d.setMansione(mansione);
        return d;
    }

    private TurnoDipendente mkTurno(String cf, List<String> giorni, String orario) {
        TurnoDipendente t = new TurnoDipendente();
        t.setDipendenteCf(cf); t.setGiorni(giorni); t.setOrario(orario);
        return t;
    }

    private FeriePermesso mkFerie(String cf, int durata, List<String> giorni) {
        FeriePermesso f = new FeriePermesso();
        f.setDipendenteCf(cf); f.setDurata(durata); f.setGiorniLavorativi(giorni);
        f.setStato(StatoRichiesta.IN_ATTESA);
        return f;
    }
}

