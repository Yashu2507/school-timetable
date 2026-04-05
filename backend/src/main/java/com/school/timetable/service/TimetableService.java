package com.school.timetable.service;

import com.school.timetable.algorithm.TimetableGenerator;
import com.school.timetable.dto.Dto.*;
import com.school.timetable.model.SchoolClass;
import com.school.timetable.model.Teacher;
import com.school.timetable.model.TimetableEntry;
import com.school.timetable.repository.SchoolClassRepository;
import com.school.timetable.repository.TeacherRepository;
import com.school.timetable.repository.TimetableEntryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TimetableService {

    private final TimetableEntryRepository timetableEntryRepository;
    private final TeacherRepository teacherRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final TimetableGenerator generator;
    private final TeacherService teacherService;

    @Transactional
    public List<TimetableEntryResponse> generateTimetable(GenerateRequest request) {
        Teacher.Division division = request.getDivision();

        if (request.isClearExisting()) {
            if (division != null) {
                timetableEntryRepository.deleteByDivision(division);
            } else {
                timetableEntryRepository.deleteAll();
            }
        }

        List<Teacher> teachers = division != null
            ? teacherRepository.findByDivision(division)
            : teacherRepository.findAll();

        List<SchoolClass> classes = division != null
            ? schoolClassRepository.findByDivision(division)
            : schoolClassRepository.findAll();

        List<TimetableEntry> generated = generator.generate(teachers, classes, request.getPeriodsPerDay());
        List<TimetableEntry> saved = timetableEntryRepository.saveAll(generated);

        return saved.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ClassTimetable getClassTimetable(String className) {
        List<TimetableEntry> entries = timetableEntryRepository.findByClassName(className);
        Map<Integer, Map<Integer, TimetableEntryResponse>> schedule = new TreeMap<>();

        for (TimetableEntry entry : entries) {
            schedule
                .computeIfAbsent(entry.getDayOfWeek(), d -> new TreeMap<>())
                .put(entry.getPeriodNumber(), toResponse(entry));
        }

        Teacher.Division division = entries.isEmpty() ? null : entries.get(0).getDivision();
        return new ClassTimetable(className, division, schedule);
    }

    public TeacherTimetable getTeacherTimetable(Long teacherId) {
        List<TimetableEntry> entries = timetableEntryRepository.findByTeacherId(teacherId);
        Map<Integer, Map<Integer, TimetableEntryResponse>> schedule = new TreeMap<>();

        for (TimetableEntry entry : entries) {
            schedule
                .computeIfAbsent(entry.getDayOfWeek(), d -> new TreeMap<>())
                .put(entry.getPeriodNumber(), toResponse(entry));
        }

        Teacher teacher = teacherRepository.findById(teacherId)
            .orElseThrow(() -> new RuntimeException("Teacher not found: " + teacherId));
        return new TeacherTimetable(teacherService.toResponse(teacher), schedule);
    }

    public List<ClassTimetable> getAllClassTimetables() {
        List<String> classNames = timetableEntryRepository.findAllClassNames();
        return classNames.stream()
            .map(this::getClassTimetable)
            .collect(Collectors.toList());
    }

    public List<ClassTimetable> getTimetableByDivision(Teacher.Division division) {
        List<TimetableEntry> entries = timetableEntryRepository.findByDivision(division);
        Set<String> classNames = entries.stream()
            .map(TimetableEntry::getClassName)
            .collect(Collectors.toCollection(TreeSet::new));
        return classNames.stream()
            .map(this::getClassTimetable)
            .collect(Collectors.toList());
    }

    @Transactional
    public void clearTimetable(Teacher.Division division) {
        if (division != null) {
            timetableEntryRepository.deleteByDivision(division);
        } else {
            timetableEntryRepository.deleteAll();
        }
    }

    private TimetableEntryResponse toResponse(TimetableEntry entry) {
        return new TimetableEntryResponse(
            entry.getId(),
            entry.getClassName(),
            teacherService.toResponse(entry.getTeacher()),
            entry.getSubjectName(),
            entry.getDayOfWeek(),
            entry.getPeriodNumber(),
            entry.getStartTime(),
            entry.getEndTime(),
            entry.getDivision()
        );
    }
}
