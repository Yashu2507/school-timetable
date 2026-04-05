package com.school.timetable.repository;

import com.school.timetable.model.SchoolClass;
import com.school.timetable.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolClassRepository extends JpaRepository<SchoolClass, Long> {
    List<SchoolClass> findByDivision(Teacher.Division division);
    List<SchoolClass> findByGrade(int grade);
    Optional<SchoolClass> findByName(String name);
    boolean existsByName(String name);
}
