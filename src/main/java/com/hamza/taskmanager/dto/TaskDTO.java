package com.hamza.taskmanager.dto;
import com.hamza.taskmanager.entity.TaskStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private TaskStatus status;
    private Long projectId;
}