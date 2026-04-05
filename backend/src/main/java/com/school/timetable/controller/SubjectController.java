package com.school.timetable.controller;

import com.school.timetable.dto.Dto.*;
import com.school.timetable.model.Teacher;
import com.school.timetable.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SubjectResponse>>> getAll(
            @RequestParam(required = false) Teacher.Division division) {
        List<SubjectResponse> data = division != null
            ? subjectService.getByDivision(division)
            : subjectService.getAll();
        return ResponseEntity.ok(ApiResponse.success(data, "Subjects fetched"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SubjectResponse>> create(@RequestBody SubjectRequest request) {
        try {
            return ResponseEntity.ok(ApiResponse.success(subjectService.create(request), "Subject created"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SubjectResponse>> update(
            @PathVariable Long id, @RequestBody SubjectRequest request) {
        try {
            return ResponseEntity.ok(ApiResponse.success(subjectService.update(id, request), "Subject updated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        try {
            subjectService.delete(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Subject deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
