package com.babyname.controller;

import com.babyname.entity.User;
import com.babyname.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/wechat-login")
    public ResponseEntity<Map<String, Object>> wechatLogin(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        
        Map<String, Object> response = new HashMap<>();
        
        if (code == null || code.isEmpty()) {
            response.put("success", false);
            response.put("message", "授权码不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            // 使用真实的微信登录服务
            UserService.LoginResult loginResult = userService.wechatLogin(code);
            
            if (loginResult.isSuccess()) {
                Map<String, Object> data = new HashMap<>();
                Map<String, Object> userInfo = new HashMap<>();
                
                User user = loginResult.getUser();
                userInfo.put("openid", user.getOpenid());
                userInfo.put("nickname", user.getNickname());
                userInfo.put("avatar", user.getAvatar());
                userInfo.put("loginType", user.getLoginType().toString().toLowerCase());
                userInfo.put("id", user.getId());
                
                data.put("token", loginResult.getToken());
                data.put("userInfo", userInfo);
                
                response.put("success", true);
                response.put("message", loginResult.getMessage());
                response.put("data", data);
                
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", loginResult.getMessage());
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "登录失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @PostMapping("/update-info")
    public ResponseEntity<Map<String, Object>> updateUserInfo(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 提取token（去除Bearer前缀）
            String token = authHeader.replace("Bearer ", "");
            
            // 验证token并获取用户
            var userOpt = userService.validateTokenAndGetUser(token);
            
            if (userOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "无效的token");
                return ResponseEntity.status(401).body(response);
            }
            
            User user = userOpt.get();
            String nickname = request.get("nickname");
            String avatar = request.get("avatar");
            
            // 更新用户信息
            User updatedUser = userService.updateUserInfo(user.getOpenid(), nickname, avatar);
            
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("openid", updatedUser.getOpenid());
            userInfo.put("nickname", updatedUser.getNickname());
            userInfo.put("avatar", updatedUser.getAvatar());
            userInfo.put("loginType", updatedUser.getLoginType().toString().toLowerCase());
            userInfo.put("id", updatedUser.getId());
            
            response.put("success", true);
            response.put("message", "更新成功");
            response.put("data", userInfo);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "更新失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getUserInfo(
            @RequestHeader("Authorization") String authHeader) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 提取token（去除Bearer前缀）
            String token = authHeader.replace("Bearer ", "");
            
            // 验证token并获取用户
            var userOpt = userService.validateTokenAndGetUser(token);
            
            if (userOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "无效的token");
                return ResponseEntity.status(401).body(response);
            }
            
            User user = userOpt.get();
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("openid", user.getOpenid());
            userInfo.put("nickname", user.getNickname());
            userInfo.put("avatar", user.getAvatar());
            userInfo.put("loginType", user.getLoginType().toString().toLowerCase());
            userInfo.put("id", user.getId());
            
            response.put("success", true);
            response.put("message", "获取用户信息成功");
            response.put("data", userInfo);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取用户信息失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // 保留原有的登录和注册接口，用于测试或其他用途
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        Map<String, Object> userInfo = new HashMap<>();
        
        if (username != null && password != null) {
            userInfo.put("username", username);
            userInfo.put("nickname", username);
            userInfo.put("loginType", "normal");
            
            data.put("token", "mock_jwt_token_" + System.currentTimeMillis());
            data.put("userInfo", userInfo);
            
            response.put("success", true);
            response.put("message", "登录成功");
            response.put("data", data);
            
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "用户名或密码不能为空");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        Map<String, Object> userInfo = new HashMap<>();
        
        if (username != null && password != null) {
            userInfo.put("username", username);
            userInfo.put("nickname", username);
            userInfo.put("loginType", "normal");
            
            data.put("token", "mock_jwt_token_" + System.currentTimeMillis());
            data.put("userInfo", userInfo);
            
            response.put("success", true);
            response.put("message", "注册成功");
            response.put("data", data);
            
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "用户名或密码不能为空");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
}