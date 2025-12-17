package com.hamza.taskmanager.controller;

import com.hamza.taskmanager.entity.Project;
import com.hamza.taskmanager.entity.Task;
import com.hamza.taskmanager.entity.TaskStatus;
import com.hamza.taskmanager.repository.ProjectRepository;
import com.hamza.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hamza.taskmanager.entity.User;
import com.hamza.taskmanager.repository.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDate;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    private final UserRepository userRepository;


    @GetMapping("/due-soon")
    public List<Task> getTasksDueSoon(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        LocalDate today = LocalDate.now();
        LocalDate nextWeek = today.plusDays(7);

        return taskRepository.findTasksDueSoon(user.getId(), today, nextWeek);
    }


    // 1. Get Tasks for a Project
    @GetMapping("/project/{projectId}")
    public List<Task> getTasksByProject(@PathVariable Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    // 2. Create Task
    @PostMapping("/project/{projectId}")
    public Task createTask(@PathVariable Long projectId, @RequestBody Task task) {
        Project project = projectRepository.findById(projectId).orElseThrow();
        task.setProject(project);
        task.setStatus(TaskStatus.PENDING); // Default status
        return taskRepository.save(task);
    }

    // 3. Toggle Complete
    @PatchMapping("/{taskId}/complete")
    public Task toggleTaskStatus(@PathVariable Long taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        task.setStatus(task.getStatus() == TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED);
        return taskRepository.save(task);
    }

    // 4. Delete Task
    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
        taskRepository.deleteById(taskId);
        return ResponseEntity.ok().build();
    }
}



