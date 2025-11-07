package com.sistemi_inf.AgriTech.security;

import com.sistemi_inf.AgriTech.model.Utente;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "PasswordSuperSegretaPerLEcommerce123!";
    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 ora

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // Genera token da Utente
    public String generateToken(Utente utente) {
        return Jwts.builder()
                .setSubject(utente.getEmail())
                .claim("ruolo", utente.getRuolo().name().toUpperCase())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Estrarre email
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Estrarre ruolo
    public String extractRuolo(String token) {
        return extractAllClaims(token).get("ruolo", String.class);
    }

    // Controllare se valido
    public boolean validateToken(String token, String email) {
        try {
            final String emailEstratta = extractEmail(token);
            return (emailEstratta.equals(email) && !isTokenExpired(token));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
