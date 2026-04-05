package com.school.timetable.controller;

import com.school.timetable.dto.Dto.*;
import com.school.timetable.model.Teacher;
import com.school.timetable.service.SchoolClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SchoolClassController {

    private final SchoolClassService schoolClassService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SchoolClassResponse>>> getAll(
            @RequestParam(required = false) Teacher.Division division) {
        List<SchoolClassResponse> data = division != null
            ? schoolClassService.getByDivision(division)
            : schoolClassService.getAll();
        return ResponseEntity.ok(ApiResponse.success(data, "Classes fetched"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SchoolClassResponse>> create(@RequestBody SchoolClassRequest request) {
        try {
            return ResponseEntity.ok(ApiResponse.success(schoolClassService.create(request), "Class created"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SchoolClassResponse>> update(
            @PathVariable Long id, @RequestBody SchoolClassRequest request) {
        try {
            return ResponseEntity.ok(ApiResponse.success(schoolClassService.update(id, request), "Class updated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        try {
            schoolClassService.delete(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Class deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
