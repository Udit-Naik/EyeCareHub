package com.EyeCareHub.controller;

import com.EyeCareHub.dto.MessageResponse;
import com.EyeCareHub.model.User;
import com.EyeCareHub.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    UserRepository userRepository;

    // ─── GET ALL USERS ─────────────────────────────
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // ─── ADD USER ────────────────────────────────
    @PostMapping("/users")
    public ResponseEntity<?> addUser(@RequestBody User user) {

        // Check if email already exists
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email already in use"));
        }

        // Save user
        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(savedUser);
    }

    // ─── UPDATE USER ─────────────────────────────
    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId,
                                        @RequestBody User updatedUser) {

        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();

        // Update fields
        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        user.setRoles(updatedUser.getRoles());

        userRepository.save(user);

        return ResponseEntity.ok(user);
    }

    // ─── DELETE USER ─────────────────────────────
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {

        if (!userRepository.existsById(userId)) {
            return ResponseEntity.notFound().build();
        }

        userRepository.deleteById(userId);

        return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
    }
}