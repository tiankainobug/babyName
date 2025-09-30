package com.babyname.service;

import com.babyname.entity.User;
import com.babyname.repository.UserRepository;
import com.babyname.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private WechatService wechatService;
    
    /**
     * 微信登录
     */
    @Transactional
    public LoginResult wechatLogin(String code) {
        try {
            // 1. 通过code获取微信用户信息
            WechatService.WechatLoginResponse wechatResponse = wechatService.getWechatUserInfo(code);
            String openid = wechatResponse.getOpenid();
            
            // 2. 查找或创建用户
            User user = findOrCreateWechatUser(openid);
            
            // 3. 生成JWT token
            String token = jwtUtil.generateToken(user.getOpenid(), user.getNickname());
            
            return new LoginResult(true, "登录成功", token, user);
            
        } catch (Exception e) {
            return new LoginResult(false, e.getMessage(), null, null);
        }
    }
    
    /**
     * 查找或创建微信用户
     */
    private User findOrCreateWechatUser(String openid) {
        Optional<User> existingUser = userRepository.findByOpenid(openid);
        
        if (existingUser.isPresent()) {
            // 用户已存在，直接返回
            return existingUser.get();
        } else {
            // 用户不存在，创建新用户
            User newUser = new User();
            newUser.setOpenid(openid);
            newUser.setNickname("微信用户"); // 默认昵称，可以后续通过用户信息更新
            newUser.setAvatar(""); // 默认头像
            newUser.setLoginType(User.LoginType.WECHAT);
            
            return userRepository.save(newUser);
        }
    }
    
    /**
     * 根据openid查找用户
     */
    public Optional<User> findByOpenid(String openid) {
        return userRepository.findByOpenid(openid);
    }
    
    /**
     * 更新用户信息
     */
    @Transactional
    public User updateUserInfo(String openid, String nickname, String avatar) {
        Optional<User> userOpt = userRepository.findByOpenid(openid);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (nickname != null && !nickname.isEmpty()) {
                user.setNickname(nickname);
            }
            if (avatar != null && !avatar.isEmpty()) {
                user.setAvatar(avatar);
            }
            return userRepository.save(user);
        }
        
        throw new RuntimeException("用户不存在");
    }
    
    /**
     * 验证token并获取用户信息
     */
    public Optional<User> validateTokenAndGetUser(String token) {
        try {
            String openid = jwtUtil.getOpenidFromToken(token);
            
            if (jwtUtil.validateToken(token, openid)) {
                return findByOpenid(openid);
            }
            
            return Optional.empty();
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    /**
     * 登录结果类
     */
    public static class LoginResult {
        private boolean success;
        private String message;
        private String token;
        private User user;
        
        public LoginResult(boolean success, String message, String token, User user) {
            this.success = success;
            this.message = message;
            this.token = token;
            this.user = user;
        }
        
        // Getters
        public boolean isSuccess() {
            return success;
        }
        
        public String getMessage() {
            return message;
        }
        
        public String getToken() {
            return token;
        }
        
        public User getUser() {
            return user;
        }
    }
}






