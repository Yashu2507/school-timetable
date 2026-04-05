package com.school.timetable.algorithm;

import com.school.timetable.model.SchoolClass;
import com.school.timetable.model.Teacher;
import com.school.timetable.model.TimetableEntry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Constraint-based timetable generation algorithm.
 * Constraints enforced:
 * 1. A teacher cannot be scheduled in two places at the same time.
 * 2. A class cannot have two subjects at the same time.
 * 3. Max periods per day per teacher is respected.
 */
@Slf4j
@Component
public class TimetableGenerator {

    private static final int DAYS = 5;
    private static final String[] PERIOD_TIMES = {
            "", "08:00", "08:50", "09:40", "10:40",
            "11:30", "13:00", "13:50", "14:40"
    };
    private static final String[] PERIOD_END_TIMES = {
            "", "08:45", "09:35", "10:25", "11:25",
            "12:15", "13:45", "14:35", "15:25"
    };

    public List<TimetableEntry> generate(
            List<Teacher> teachers,
            List<SchoolClass> classes,
            int periodsPerDay) {

        log.info("Generating timetable for {} teachers, {} classes, {} periods/day",
                teachers.size(), classes.size(), periodsPerDay);

        List<TimetableEntry> result = new ArrayList<>();

        // Track used slots: "teacherId_day_period" and "className_day_period"
        Set<String> teacherSlots = new HashSet<>();
        Set<String> classSlots   = new HashSet<>();

        // Track daily period count per teacher: "teacherId_day" -> count
        Map<String, Integer> teacherDailyCount = new HashMap<>();

        // Map className -> list of teachers assigned to it
        Map<String, List<Teacher>> classTeachers = new HashMap<>();
        for (SchoolClass sc : classes) {
            classTeachers.put(sc.getName(), new ArrayList<>());
        }
        for (Teacher teacher : teachers) {
            String cls = teacher.getAssignedClass();
            if (cls != null && !cls.isBlank() && classTeachers.containsKey(cls)) {
                classTeachers.get(cls).add(teacher);
            }
        }

        int targetPeriodsPerWeek = 5;

        for (SchoolClass sc : classes) {
            String className = sc.getName();
            List<Teacher> assigned = classTeachers.getOrDefault(className, Collections.emptyList());

            if (assigned.isEmpty()) {
                log.warn("No teachers assigned to class {}", className);
                continue;
            }

            for (Teacher teacher : assigned) {
                int allocated = 0;

                // Try all day/period combinations in a shuffled order
                List<int[]> slots = new ArrayList<>();
                for (int d = 1; d <= DAYS; d++) {
                    for (int p = 1; p <= periodsPerDay; p++) {
                        slots.add(new int[]{d, p});
                    }
                }
                // Shuffle deterministically per teacher+class for variety
                Collections.shuffle(slots, new Random((long) teacher.getId() * 31 + className.hashCode()));

                for (int[] slot : slots) {
                    if (allocated >= targetPeriodsPerWeek) break;

                    int day    = slot[0];
                    int period = slot[1];

                    String teacherKey = teacher.getId() + "_" + day + "_" + period;
                    String classKey   = className + "_" + day + "_" + period;
                    String dailyKey   = teacher.getId() + "_" + day;

                    int dailyUsed = teacherDailyCount.getOrDefault(dailyKey, 0);

                    if (!teacherSlots.contains(teacherKey)
                            && !classSlots.contains(classKey)
                            && dailyUsed < teacher.getMaxPeriodsPerDay()) {

                        // Reserve slot
                        teacherSlots.add(teacherKey);
                        classSlots.add(classKey);
                        teacherDailyCount.put(dailyKey, dailyUsed + 1);

                        TimetableEntry entry = new TimetableEntry();
                        entry.setClassName(className);
                        entry.setTeacher(teacher);
                        entry.setSubjectName(teacher.getSubject());
                        entry.setDayOfWeek(day);
                        entry.setPeriodNumber(period);
                        entry.setStartTime(period < PERIOD_TIMES.length ? PERIOD_TIMES[period] : "");
                        entry.setEndTime(period < PERIOD_END_TIMES.length ? PERIOD_END_TIMES[period] : "");
                        entry.setDivision(teacher.getDivision());

                        result.add(entry);
                        allocated++;
                    }
                }

                if (allocated < targetPeriodsPerWeek) {
                    log.warn("Only allocated {}/{} periods for teacher '{}' in class '{}'",
                            allocated, targetPeriodsPerWeek, teacher.getName(), className);
                }
            }
        }

        log.info("Generated {} timetable entries total", result.size());
        return result;
    }
}