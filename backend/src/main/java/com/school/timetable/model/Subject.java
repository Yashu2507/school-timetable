package com.school.timetable.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "subjects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(name = "periods_per_week")
    private int periodsPerWeek = 5;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Teacher.Division division;

    private String code;
}