package com.hamza.taskmanager.repository;

import com.hamza.taskmanager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);

    @Query("SELECT t FROM Task t JOIN FETCH t.project p WHERE p.user.id = :userId AND t.status != 'COMPLETED' AND t.dueDate BETWEEN :startDate AND :endDate")
    List<Task> findTasksDueSoon(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}