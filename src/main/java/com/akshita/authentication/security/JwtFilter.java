package com.akshita.authentication.security;

import com.akshita.authentication.config.SecurityConfig;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    // Skip filter for public URLs
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        return Arrays.stream(SecurityConfig.PUBLIC_URLS)
                .anyMatch(pattern -> pathMatcher.match(pattern, path));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        String path = request.getServletPath();
        String header = request.getHeader("Authorization");

        try {
            if (header == null || !header.startsWith("Bearer ")) {
                // Check if it's a page request (HTML page)
                if (isPageRequest(path)) {
                    // Redirect to login page for HTML requests
                    response.sendRedirect("/login-page");
                    return;
                } else {
                    // Return JSON error for API requests
                    sendJsonResponse(response, 401, false, "Token missing");
                    return;
                }
            }

            String token = header.substring(7);
            String username = jwtUtil.extractUsername(token);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                if (jwtUtil.validateToken(token)) {

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);

                } else {
                    if (isPageRequest(path)) {
                        response.sendRedirect("/login-page");
                        return;
                    } else {
                        sendJsonResponse(response, 401, false, "Token expired");
                        return;
                    }
                }
            }

        } catch (Exception e) {
            if (isPageRequest(path)) {
                response.sendRedirect("/login-page");
                return;
            } else {
                sendJsonResponse(response, 401, false, "Invalid token");
                return;
            }
        }

        chain.doFilter(request, response);
    }

    // Helper method to check if request is for an HTML page
    private boolean isPageRequest(String path) {
        // These paths are HTML pages that should redirect to login
        String[] pagePaths = {
                "/home",
                "/dashboard",
                "/profile",
                "/settings"
        };

        // Check if path matches any page path
        for (String pagePath : pagePaths) {
            if (pathMatcher.match(pagePath, path)) {
                return true;
            }
        }

        // If path has no extension (not .css, .js, .json, etc.), treat as page request
        return !path.contains(".") && !path.startsWith("/api/");
    }

    // JSON response helper for API requests
    private void sendJsonResponse(HttpServletResponse response, int status,
                                  boolean success, String message) throws IOException {

        response.setStatus(status);
        response.setContentType("application/json");

        String json = String.format(
                "{\"success\": %s, \"message\": \"%s\", \"data\": null}",
                success, message
        );

        response.getWriter().write(json);
    }
}