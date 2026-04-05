package com.school.timetable.repository;

import com.school.timetable.model.Teacher;
import com.school.timetable.model.TimetableEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableEntryRepository extends JpaRepository<TimetableEntry, Long> {
    List<TimetableEntry> findByClassName(String className);
    List<TimetableEntry> findByTeacherId(Long teacherId);
    List<TimetableEntry> findByDivision(Teacher.Division division);
    List<TimetableEntry> findByClassNameAndDayOfWeek(String className, int dayOfWeek);
    List<TimetableEntry> findByTeacherIdAndDayOfWeek(Long teacherId, int dayOfWeek);

    boolean existsByClassNameAndDayOfWeekAndPeriodNumber(
        String className, int dayOfWeek, int periodNumber);
    boolean existsByTeacherIdAndDayOfWeekAndPeriodNumber(
        Long teacherId, int dayOfWeek, int periodNumber);

    void deleteByClassName(String className);
    void deleteByDivision(Teacher.Division division);

    @Query("SELECT DISTINCT t.className FROM TimetableEntry t ORDER BY t.className")
    List<String> findAllClassNames();
}
