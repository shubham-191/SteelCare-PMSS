package com.steelcare.pmms.repository;

import com.steelcare.pmms.entity.Employee;
import com.steelcare.pmms.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
    List<Employee> findByRole(Role role);
    boolean existsByEmail(String email);
}
