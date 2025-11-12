package com.sistemi_inf.AgriTech.config;

import com.sistemi_inf.AgriTech.model.*;
import com.sistemi_inf.AgriTech.repository.RicambioRepository;
import com.sistemi_inf.AgriTech.repository.RiparazioneRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class OfficinaDataLoader {

    @Bean
    CommandLineRunner seedOfficina(RiparazioneRepository ripRepo, RicambioRepository ricRepo) {
        return args -> {
            if (ricRepo.count() == 0) {
                Ricambio f = new Ricambio();
                f.setDescrizione("Filtro olio");
                f.setCodice("R-OLIO-001");
                f.setPrezzo(new BigDecimal("9.90"));
                f.setQuantita(12);
                f.setScortaMinima(5);
                f.setUltimaApprovvigionamento(java.time.LocalDate.now().minusDays(10));
                ricRepo.save(f);

                Ricambio c = new Ricambio();
                c.setDescrizione("Cinghia alternatore");
                c.setCodice("R-CING-001");
                c.setPrezzo(new BigDecimal("24.50"));
                c.setQuantita(5);
                c.setScortaMinima(3);
                c.setUltimaApprovvigionamento(java.time.LocalDate.now().minusDays(20));
                ricRepo.save(c);

                Ricambio fa = new Ricambio();
                fa.setDescrizione("Filtro aria");
                fa.setCodice("R-ARIA-001");
                fa.setPrezzo(new BigDecimal("14.90"));
                fa.setQuantita(8);
                fa.setScortaMinima(4);
                fa.setUltimaApprovvigionamento(java.time.LocalDate.now().minusDays(5));
                ricRepo.save(fa);

                Ricambio oi = new Ricambio();
                oi.setDescrizione("Olio idraulico 5L");
                oi.setCodice("R-OLIDR-005");
                oi.setPrezzo(new BigDecimal("39.00"));
                oi.setQuantita(15);
                oi.setScortaMinima(6);
                oi.setUltimaApprovvigionamento(java.time.LocalDate.now().minusDays(2));
                ricRepo.save(oi);
            }

            if (ripRepo.count() == 0) {
                Riparazione r1 = new Riparazione();
                r1.setTarga("AB123CD");
                r1.setStato(StatoRiparazione.ATTESA);
                r1.setUrgenza(Urgenza.MEDIA);
                ripRepo.save(r1);

                Riparazione r2 = new Riparazione();
                r2.setTarga("XY987ZT");
                r2.setStato(StatoRiparazione.LAVORAZIONE);
                r2.setUrgenza(Urgenza.ALTA);
                ripRepo.save(r2);
            }
        };
    }
}
