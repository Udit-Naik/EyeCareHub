package com.EyeCareHub.controller;

import com.EyeCareHub.dto.LoginRequest;
import com.EyeCareHub.dto.MessageResponse;
import com.EyeCareHub.dto.SignupRequest;
import com.EyeCareHub.service.AuthService;
import com.EyeCareHub.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.util.Map;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.authenticateUser(loginRequest));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        authService.registerUser(signUpRequest);
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
     @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new MessageResponse("Not authenticated"));
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(Map.of(
            "id", userDetails.getId(),
            "username", userDetails.getUsername(),
            "email", userDetails.getEmail(),
            "roles", userDetails.getAuthorities()
            .stream()
            .map(auth -> auth.getAuthority())
            .toList()   
         ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new MessageResponse("Logged out successfully!"));
    }
}
