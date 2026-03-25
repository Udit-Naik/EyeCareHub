package com.EyeCareHub.repository;

import com.EyeCareHub.model.Settings;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SettingsRepository extends MongoRepository<Settings, String> {
}