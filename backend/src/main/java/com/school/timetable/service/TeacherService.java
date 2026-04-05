package com.school.timetable.service;

import com.school.timetable.dto.Dto.*;
import com.school.timetable.model.Teacher;
import com.school.timetable.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;

    public List<TeacherResponse> getAllTeachers() {
        return teacherRepository.findAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public List<TeacherResponse> getByDivision(Teacher.Division division) {
        return teacherRepository.findByDivision(division).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public TeacherResponse getById(Long id) {
        return teacherRepository.findById(id)
            .map(this::toResponse)
            .orElseThrow(() -> new RuntimeException("Teacher not found: " + id));
    }

    @Transactional
    public TeacherResponse create(TeacherRequest request) {
        if (teacherRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Teacher with email already exists: " + request.getEmail());
        }
        Teacher teacher = new Teacher();
        mapToEntity(request, teacher);
        return toResponse(teacherRepository.save(teacher));
    }

    @Transactional
    public TeacherResponse update(Long id, TeacherRequest request) {
        Teacher teacher = teacherRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Teacher not found: " + id));
        mapToEntity(request, teacher);
        return toResponse(teacherRepository.save(teacher));
    }

    @Transactional
    public void delete(Long id) {
        if (!teacherRepository.existsById(id)) {
            throw new RuntimeException("Teacher not found: " + id);
        }
        teacherRepository.deleteById(id);
    }

    private void mapToEntity(TeacherRequest req, Teacher teacher) {
        teacher.setName(req.getName());
        teacher.setEmail(req.getEmail());
        teacher.setDivision(req.getDivision());
        teacher.setSubject(req.getSubject());
        teacher.setAssignedClass(req.getAssignedClass());
        teacher.setMaxPeriodsPerDay(req.getMaxPeriodsPerDay() > 0 ? req.getMaxPeriodsPerDay() : 6);
    }

    public TeacherResponse toResponse(Teacher teacher) {
        return new TeacherResponse(
            teacher.getId(),
            teacher.getName(),
            teacher.getEmail(),
            teacher.getDivision(),
            teacher.getSubject(),
            teacher.getAssignedClass(),
            teacher.getMaxPeriodsPerDay()
        );
    }
}
