package com.school.timetable.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "timetable_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimetableEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "class_name", nullable = false)
    private String className;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @Column(name = "subject_name", nullable = false)
    private String subjectName;

    @Column(name = "day_of_week", nullable = false)
    private int dayOfWeek;

    @Column(name = "period_number", nullable = false)
    private int periodNumber;

    @Column(name = "start_time")
    private String startTime;

    @Column(name = "end_time")
    private String endTime;

    @Enumerated(EnumType.STRING)
    private Teacher.Division division;
}