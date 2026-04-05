package com.school.timetable.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "school_classes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SchoolClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String name;  // e.g. "1A", "6B", "11Science"

    @Column(nullable = false)
    private int grade;    // 1-12

    private String section; // A, B, C...

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Teacher.Division division;

    @Column(name = "student_count")
    private int studentCount;
}
