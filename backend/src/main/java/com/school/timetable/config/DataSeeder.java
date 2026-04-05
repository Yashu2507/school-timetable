package com.school.timetable.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class DataSeeder implements CommandLineRunner {

    @Override
    public void run(String... args) {
        log.info("DataSeeder disabled - no demo data loaded.");
    }
}