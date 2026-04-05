package com.school.timetable.service;

import com.school.timetable.dto.Dto.*;
import com.school.timetable.model.Subject;
import com.school.timetable.model.Teacher;
import com.school.timetable.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public List<SubjectResponse> getAll() {
        return subjectRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<SubjectResponse> getByDivision(Teacher.Division division) {
        return subjectRepository.findByDivision(division).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public SubjectResponse create(SubjectRequest request) {
        if (subjectRepository.existsByNameAndDivision(request.getName(), request.getDivision())) {
            throw new RuntimeException("Subject already exists: " + request.getName());
        }
        Subject subject = new Subject();
        subject.setName(request.getName());
        subject.setCode(request.getCode());
        subject.setPeriodsPerWeek(request.getPeriodsPerWeek() > 0 ? request.getPeriodsPerWeek() : 5);
        subject.setDivision(request.getDivision());
        return toResponse(subjectRepository.save(subject));
    }

    @Transactional
    public SubjectResponse update(Long id, SubjectRequest request) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found: " + id));
        subject.setName(request.getName());
        subject.setCode(request.getCode());
        subject.setPeriodsPerWeek(request.getPeriodsPerWeek());
        subject.setDivision(request.getDivision());
        return toResponse(subjectRepository.save(subject));
    }

    @Transactional
    public void delete(Long id) {
        subjectRepository.deleteById(id);
    }

    public SubjectResponse toResponse(Subject s) {
        return new SubjectResponse(s.getId(), s.getName(), s.getCode(), s.getPeriodsPerWeek(), s.getDivision());
    }
}