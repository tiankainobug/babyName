package com.babyname.repository;

import com.babyname.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * 根据openid查找用户
     */
    Optional<User> findByOpenid(String openid);
    
    /**
     * 检查openid是否存在
     */
    boolean existsByOpenid(String openid);
}






