package com.babyname.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Map;

@Service
public class WechatService {
    
    @Value("${wechat.mini-program.app-id}")
    private String appId;
    
    @Value("${wechat.mini-program.app-secret}")
    private String appSecret;
    
    private final WebClient webClient;
    
    public WechatService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }
    
    /**
     * 通过微信登录授权码获取用户信息
     */
    public WechatLoginResponse getWechatUserInfo(String code) {
        try {
            // 1. 使用code换取session_key和openid
            String url = String.format(
                "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
                appId, appSecret, code
            );

            // 先获取原始 JSON 字符串，便于调试
            String rawResponse = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            System.out.println("微信原始返回: " + rawResponse);

            // 再把字符串解析为 Map
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> response = mapper.readValue(rawResponse, Map.class);

            if (response == null) {
                throw new RuntimeException("微信API响应为空");
            }

            if (response.containsKey("errcode")) {
                Integer errcode = (Integer) response.get("errcode");
                String errmsg = (String) response.get("errmsg");
                throw new RuntimeException("微信登录失败: " + errcode + " - " + errmsg);
            }

            String openid = (String) response.get("openid");
            String sessionKey = (String) response.get("session_key");
            String unionid = (String) response.get("unionid");

            if (openid == null || openid.isEmpty()) {
                throw new RuntimeException("未获取到有效的openid");
            }

            return new WechatLoginResponse(openid, sessionKey, unionid);

        } catch (WebClientResponseException e) {
            System.out.println("调用微信API失败: " + e.getStatusCode() + " - " + e.getStatusText());
            throw new RuntimeException("调用微信API失败: " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            throw new RuntimeException("微信登录处理失败: " + e.getMessage(), e);
        }
    }
    
    /**
     * 微信登录响应类
     */
    public static class WechatLoginResponse {
        private String openid;
        private String sessionKey;
        private String unionid;
        
        public WechatLoginResponse(String openid, String sessionKey, String unionid) {
            this.openid = openid;
            this.sessionKey = sessionKey;
            this.unionid = unionid;
        }
        
        // Getters
        public String getOpenid() {
            return openid;
        }
        
        public String getSessionKey() {
            return sessionKey;
        }
        
        public String getUnionid() {
            return unionid;
        }
    }
}
