package com.hamza.taskmanager.dto;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProjectDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime createdAt;

    private Integer totalTasks;
    private Integer completedTasks;
    private Double progressPercentage;

}