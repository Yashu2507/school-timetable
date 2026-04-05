package com.school.timetable.repository;

import com.school.timetable.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    List<Teacher> findByDivision(Teacher.Division division);
    Optional<Teacher> findByAssignedClass(String assignedClass);
    Optional<Teacher> findByEmail(String email);
    List<Teacher> findBySubject(String subject);
    boolean existsByEmail(String email);
    boolean existsByAssignedClass(String assignedClass);
}
