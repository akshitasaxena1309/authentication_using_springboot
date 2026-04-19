package com.akshita.authentication.repository;

import com.akshita.authentication.model.User;
import com.mongodb.client.MongoDatabase;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findFirstByUsernameOrderByIdAsc(String username);
    Optional<User> findFirstByEmailOrderByIdAsc(String email);
}
