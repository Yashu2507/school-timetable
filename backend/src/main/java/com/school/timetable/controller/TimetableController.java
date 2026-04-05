package com.school.timetable.controller;

import com.school.timetable.dto.Dto.*;
import com.school.timetable.model.Teacher;
import com.school.timetable.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetable")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TimetableController {

    private final TimetableService timetableService;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<List<TimetableEntryResponse>>> generate(
            @RequestBody GenerateRequest request) {
        try {
            List<TimetableEntryResponse> entries = timetableService.generateTimetable(request);
            return ResponseEntity.ok(ApiResponse.success(entries,
                "Generated " + entries.size() + " timetable entries"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/class/{className}")
    public ResponseEntity<ApiResponse<ClassTimetable>> getClassTimetable(
            @PathVariable String className) {
        try {
            return ResponseEntity.ok(ApiResponse.success(
                timetableService.getClassTimetable(className), "Class timetable fetched"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<ApiResponse<TeacherTimetable>> getTeacherTimetable(
            @PathVariable Long teacherId) {
        try {
            return ResponseEntity.ok(ApiResponse.success(
                timetableService.getTeacherTimetable(teacherId), "Teacher timetable fetched"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ClassTimetable>>> getAllTimetables() {
        return ResponseEntity.ok(ApiResponse.success(
            timetableService.getAllClassTimetables(), "All timetables fetched"));
    }

    @GetMapping("/division/{division}")
    public ResponseEntity<ApiResponse<List<ClassTimetable>>> getByDivision(
            @PathVariable Teacher.Division division) {
        return ResponseEntity.ok(ApiResponse.success(
            timetableService.getTimetableByDivision(division), "Division timetables fetched"));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clear(
            @RequestParam(required = false) Teacher.Division division) {
        try {
            timetableService.clearTimetable(division);
            return ResponseEntity.ok(ApiResponse.success(null, "Timetable cleared"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
