package com.EyeCareHub.controller;

import com.EyeCareHub.model.Settings;
import com.EyeCareHub.service.SettingsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    @Autowired
    private SettingsService service;

    // GET SETTINGS
    @GetMapping
    public ResponseEntity<Settings> getSettings() {
        return ResponseEntity.ok(service.getSettings());
    }

    // SAVE SETTINGS
    @PostMapping
    public ResponseEntity<Settings> saveSettings(@RequestBody Settings settings) {
        return ResponseEntity.ok(service.saveSettings(settings));
    }
}