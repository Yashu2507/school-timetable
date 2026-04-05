package com.school.timetable.service;

import com.school.timetable.dto.Dto.*;
import com.school.timetable.model.SchoolClass;
import com.school.timetable.model.Teacher;
import com.school.timetable.repository.SchoolClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SchoolClassService {

    private final SchoolClassRepository schoolClassRepository;

    public List<SchoolClassResponse> getAll() {
        return schoolClassRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<SchoolClassResponse> getByDivision(Teacher.Division division) {
        return schoolClassRepository.findByDivision(division).stream()
            .map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public SchoolClassResponse create(SchoolClassRequest request) {
        if (schoolClassRepository.existsByName(request.getName())) {
            throw new RuntimeException("Class already exists: " + request.getName());
        }
        SchoolClass sc = new SchoolClass();
        mapToEntity(request, sc);
        return toResponse(schoolClassRepository.save(sc));
    }

    @Transactional
    public SchoolClassResponse update(Long id, SchoolClassRequest request) {
        SchoolClass sc = schoolClassRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Class not found: " + id));
        mapToEntity(request, sc);
        return toResponse(schoolClassRepository.save(sc));
    }

    @Transactional
    public void delete(Long id) {
        schoolClassRepository.deleteById(id);
    }

    private void mapToEntity(SchoolClassRequest req, SchoolClass sc) {
        sc.setName(req.getName());
        sc.setGrade(req.getGrade());
        sc.setSection(req.getSection());
        sc.setDivision(req.getDivision());
        sc.setStudentCount(req.getStudentCount());
    }

    public SchoolClassResponse toResponse(SchoolClass sc) {
        return new SchoolClassResponse(sc.getId(), sc.getName(), sc.getGrade(),
            sc.getSection(), sc.getDivision(), sc.getStudentCount());
    }
}
