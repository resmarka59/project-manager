package com.hamza.taskmanager.controller;

import com.hamza.taskmanager.entity.Project;
import com.hamza.taskmanager.entity.TaskStatus;
import com.hamza.taskmanager.entity.User;
import com.hamza.taskmanager.repository.ProjectRepository;
import com.hamza.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.hamza.taskmanager.dto.ProjectDTO;
import java.util.stream.Collectors;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;


    @GetMapping
    public List<ProjectDTO> getAllProjects(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        List<Project> projects = projectRepository.findByUserId(user.getId());

        return projects.stream().map(project -> {
            ProjectDTO dto = new ProjectDTO();
            dto.setId(project.getId());
            dto.setTitle(project.getTitle());
            dto.setDescription(project.getDescription());
            dto.setCreatedAt(project.getCreatedAt());


            int total = project.getTasks().size();
            int completed = (int) project.getTasks().stream()
                    .filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();

            dto.setTotalTasks(total);
            dto.setCompletedTasks(completed);
            dto.setProgressPercentage(total == 0 ? 0 : ((double) completed / total) * 100);

            return dto;
        }).collect(Collectors.toList());
    }


    // HERE I  Create a New Project
    @PostMapping
    public Project createProject(@RequestBody Project project, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        project.setUser(user); // Link project to the logged-in user
        return projectRepository.save(project);
    }

    //  THIS IS TO GET A SINGLE PROJECT
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProject(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());

    }



    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project updatedProject) {
        return projectRepository.findById(id).map(project -> {
            project.setTitle(updatedProject.getTitle());
            project.setDescription(updatedProject.getDescription());
            return projectRepository.save(project);
        }).orElseThrow(() -> new RuntimeException("Project not found"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}

