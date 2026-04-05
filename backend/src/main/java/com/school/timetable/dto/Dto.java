package com.school.timetable.dto;

import com.school.timetable.model.Teacher;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Map;

public class Dto {

    // ---- Teacher DTOs ----
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class TeacherRequest {
        private String name;
        private String email;
        private Teacher.Division division;
        private String subject;
        private String assignedClass;
        private int maxPeriodsPerDay = 6;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class TeacherResponse {
        private Long id;
        private String name;
        private String email;
        private Teacher.Division division;
        private String subject;
        private String assignedClass;
        private int maxPeriodsPerDay;
    }

    // ---- Subject DTOs ----
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class SubjectRequest {
        private String name;
        private String code;
        private int periodsPerWeek;
        private Teacher.Division division;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class SubjectResponse {
        private Long id;
        private String name;
        private String code;
        private int periodsPerWeek;
        private Teacher.Division division;
    }

    // ---- SchoolClass DTOs ----
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class SchoolClassRequest {
        private String name;
        private int grade;
        private String section;
        private Teacher.Division division;
        private int studentCount;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class SchoolClassResponse {
        private Long id;
        private String name;
        private int grade;
        private String section;
        private Teacher.Division division;
        private int studentCount;
    }

    // ---- Timetable DTOs ----
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class TimetableEntryResponse {
        private Long id;
        private String className;
        private TeacherResponse teacher;
        private String subjectName;
        private int dayOfWeek;
        private int periodNumber;
        private String startTime;
        private String endTime;
        private Teacher.Division division;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ClassTimetable {
        private String className;
        private Teacher.Division division;
        // Map<dayOfWeek, Map<periodNumber, entry>>
        private Map<Integer, Map<Integer, TimetableEntryResponse>> schedule;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class TeacherTimetable {
        private TeacherResponse teacher;
        private Map<Integer, Map<Integer, TimetableEntryResponse>> schedule;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class GenerateRequest {
        private Teacher.Division division;
        private int periodsPerDay = 8;
        private boolean clearExisting = true;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;

        public static <T> ApiResponse<T> success(T data, String message) {
            return new ApiResponse<>(true, message, data);
        }
        public static <T> ApiResponse<T> error(String message) {
            return new ApiResponse<>(false, message, null);
        }
    }
}
