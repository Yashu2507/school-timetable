package com.school.timetable.controller;

import com.school.timetable.dto.Dto.*;
import com.school.timetable.model.Teacher;
import com.school.timetable.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TeacherController {

    private final TeacherService teacherService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TeacherResponse>>> getAll(
            @RequestParam(required = false) Teacher.Division division) {
        List<TeacherResponse> data = division != null
            ? teacherService.getByDivision(division)
            : teacherService.getAllTeachers();
        return ResponseEntity.ok(ApiResponse.success(data, "Teachers fetched"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TeacherResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(teacherService.getById(id), "Teacher fetched"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TeacherResponse>> create(@RequestBody TeacherRequest request) {
        try {
            return ResponseEntity.ok(ApiResponse.success(teacherService.create(request), "Teacher created"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TeacherResponse>> update(
            @PathVariable Long id, @RequestBody TeacherRequest request) {
        try {
            return ResponseEntity.ok(ApiResponse.success(teacherService.update(id, request), "Teacher updated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        try {
            teacherService.delete(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Teacher deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
