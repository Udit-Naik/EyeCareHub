package com.EyeCareHub.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;
import java.time.Instant;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType; 

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;

    @NotBlank(message = "Username is required")
    @Size(max = 20)
    private String username;

    @NotBlank(message = "Email is required")
    @Size(max = 50)
    @Email(message = "Invalid email format")
    @Indexed(unique = true) // 🔥 important
    private String email;

    @NotBlank(message = "Password is required")
    @Size(max = 120)
    private String password;

    private String mobile;
    @Field(targetType = FieldType.STRING)
    private Set<Role> roles;

    private boolean enabled = true; // ✅ optional

    private Instant createdAt = Instant.now();

    // Custom constructor
    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}