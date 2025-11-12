package com.sistemi_inf.AgriTech.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration-ms}")
    private long jwtExpirationMs;

    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        try {
            return getAllClaims(token).getSubject();
        } catch (JwtException e) {
            System.out.println("Errore estrazione username: " + e.getMessage());
            return null;
        }
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return username != null &&
                    username.equals(userDetails.getUsername()) &&
                    !isTokenExpired(token);
        } catch (JwtException e) {
            System.out.println("Token non valido: " + e.getMessage());
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        try {
            return getAllClaims(token).getExpiration().before(new Date());
        } catch (JwtException e) {
            System.out.println("Errore scadenza token: " + e.getMessage());
            return true;
        }
    }

    private Claims getAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private SecretKey getSignKey() {
        try {
            return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
        } catch (IllegalArgumentException e) {
            return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        }
    }
}
