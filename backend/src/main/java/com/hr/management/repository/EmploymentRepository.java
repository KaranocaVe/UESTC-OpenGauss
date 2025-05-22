package com.hr.management.repository;

import com.hr.management.entity.Employment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmploymentRepository extends JpaRepository<Employment, String> {
    Employment findByEmploymentId(String employmentId);
}