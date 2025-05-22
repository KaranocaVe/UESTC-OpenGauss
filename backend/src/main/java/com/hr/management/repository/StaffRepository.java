package com.hr.management.repository;

import com.hr.management.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByStaffIdAndPassword(Long staffId, String password);

    List<Staff> findBySectionIdOrderByStaffIdAsc(Long sectionId);

    List<Staff> findBySectionIdOrderBySalaryDesc(Long sectionId);

    Optional<Staff> findByStaffId(Long staffId);

    List<Staff> findBySectionIdAndFirstNameContainingOrSectionIdAndLastNameContaining(
            Long sectionId1, String firstName, Long sectionId2, String lastName);

    List<Staff> findByFirstNameContainingOrLastNameContaining(String firstName, String lastName);

    @Query("SELECT MAX(s.salary) as maxSalary, MIN(s.salary) as minSalary, AVG(s.salary) as avgSalary FROM Staff s WHERE s.sectionId = ?1")
    Object[][] getSalaryStatsBySection(Long sectionId);

    @Query("SELECT s.sectionId, MAX(s.salary) as maxSalary, MIN(s.salary) as minSalary, AVG(s.salary) as avgSalary FROM Staff s GROUP BY s.sectionId")
    List<Object[]> getSalaryStatsByAllSections();
}