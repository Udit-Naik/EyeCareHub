package com.EyeCareHub.service;

import com.EyeCareHub.model.Settings;
import com.EyeCareHub.repository.SettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    @Autowired
    private SettingsRepository repository;

    // GET SETTINGS (ensure always one record)
    public Settings getSettings() {
        return repository.findAll().stream().findFirst()
                .orElseGet(() -> {
                    Settings s = new Settings();
                    s.setSiteName("EYECAREHUB");
                    s.setSupportEmail("support@eye.com");
                    s.setMaintenanceMode(false);
                    return repository.save(s);
                });
    }

    // SAVE / UPDATE SETTINGS
    public Settings saveSettings(Settings newSettings) {
        Settings existing = getSettings();

        existing.setSiteName(newSettings.getSiteName());
        existing.setSupportEmail(newSettings.getSupportEmail());
        existing.setMaintenanceMode(newSettings.isMaintenanceMode());

        return repository.save(existing);
    }
}