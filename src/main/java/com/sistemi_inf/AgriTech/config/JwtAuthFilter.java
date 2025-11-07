package com.sistemi_inf.AgriTech.config;


import com.sistemi_inf.AgriTech.model.Utente;
import com.sistemi_inf.AgriTech.security.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        System.out.println("\n---- JwtAuthFilter ----");
        System.out.println("Richiesta: " + request.getMethod() + " " + request.getRequestURI());

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("❌ Nessun token trovato nell'header Authorization");
            filterChain.doFilter(request, response);
            return;
        }

        String jwtToken = authHeader.substring(7);
        System.out.println("✅ Token trovato: " + jwtToken);

        try {
            String email = jwtUtil.extractEmail(jwtToken);
            String ruolo = jwtUtil.extractRuolo(jwtToken).toUpperCase();
            System.out.println("📧 Username estratto: " + email);
            System.out.println("🎭 Ruolo estratto: " + ruolo);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                Utente userDetails = (Utente) userDetailsService.loadUserByUsername(email);

                if (jwtUtil.validateToken(jwtToken, userDetails.getUsername())) {
                    System.out.println("✅ Token valido per " + email);

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities() // authority corretta
                            );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    System.out.println("🔓 Autenticazione impostata nel SecurityContext con ruoli: " +
                            userDetails.getAuthorities());
                } else {
                    System.out.println("❌ Token NON valido");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }
            }

        } catch (Exception e) {
            System.out.println("⚠️ Errore nella validazione del token: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token non valido o scaduto");
            return;
        }

        System.out.println("---- Fine JwtAuthFilter ----\n");
        filterChain.doFilter(request, response);
    }
}
