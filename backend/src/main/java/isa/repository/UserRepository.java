package isa.repository;

import isa.model.Role;
import isa.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findAllByRole(Role staff);

    List<User> findFirst5ByRole(Role user);

    Optional<User> findByCompanyId(Long id);
}
