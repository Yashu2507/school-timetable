package com.school.timetable.repository;

import com.school.timetable.model.Subject;
import com.school.timetable.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByDivision(Teacher.Division division);
    Optional<Subject> findByName(String name);
    boolean existsByNameAndDivision(String name, Teacher.Division division);
}