package com.school.timetable.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "teachers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Division division;

    // Subject this teacher teaches (one-to-one mapping)
    @Column(nullable = false)
    private String subject;

    // Class this teacher is assigned to (one-to-one mapping)
    @Column(name = "assigned_class")
    private String assignedClass;

    @Column(name = "max_periods_per_day")
    private int maxPeriodsPerDay = 6;

    public enum Division {
        PRIMARY,    // Classes 1-5
        SECONDARY,  // Classes 6-10
        HIGHER      // Classes 11-12 (optional)
    }
}
