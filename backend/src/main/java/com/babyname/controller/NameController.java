package com.babyname.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;

@RestController
@RequestMapping("/api/names")
@CrossOrigin(origins = "*")
public class NameController {

    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateNames(@RequestBody Map<String, Object> request) {
        String surname = (String) request.get("surname");
        String gender = (String) request.get("gender");
        String birthDate = (String) request.get("birthDate");
        String birthTime = (String) request.get("birthTime");
        @SuppressWarnings("unchecked")
        List<String> preferences = (List<String>) request.get("preferences");
        
        Map<String, Object> response = new HashMap<>();
        
        if (surname != null && gender != null && birthDate != null) {
            // 模拟生成名字
            List<Map<String, Object>> names = generateMockNames(surname, gender, preferences);
            
            Map<String, Object> data = new HashMap<>();
            data.put("names", names);
            data.put("babyInfo", request);
            
            response.put("success", true);
            response.put("message", "起名成功");
            response.put("data", data);
            
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "请填写完整的宝宝信息");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getHistory() {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> history = new ArrayList<>();
        
        // 模拟历史记录
        Map<String, Object> record = new HashMap<>();
        record.put("id", 1);
        record.put("surname", "张");
        record.put("gender", "male");
        record.put("birthDate", "2024-01-01");
        record.put("createTime", "2024-01-01 10:00:00");
        
        List<Map<String, Object>> names = Arrays.asList(
            createNameRecord("张瑞泽", 95, "智慧如水，福泽深厚", "水", "21"),
            createNameRecord("张博文", 92, "博学多才，文采斐然", "水", "19")
        );
        record.put("names", names);
        
        history.add(record);
        
        response.put("success", true);
        response.put("message", "获取历史记录成功");
        response.put("data", history);
        
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/history/{id}")
    public ResponseEntity<Map<String, Object>> deleteHistory(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        response.put("success", true);
        response.put("message", "删除成功");
        
        return ResponseEntity.ok(response);
    }
    
    private List<Map<String, Object>> generateMockNames(String surname, String gender, List<String> preferences) {
        List<Map<String, Object>> names = new ArrayList<>();
        
        if ("male".equals(gender)) {
            names.add(createNameRecord(surname + "瑞泽", 95, "智慧如水，福泽深厚", "水", "21"));
            names.add(createNameRecord(surname + "博文", 92, "博学多才，文采斐然", "水", "19"));
            names.add(createNameRecord(surname + "昊然", 90, "天空广阔，自然超然", "火", "18"));
            names.add(createNameRecord(surname + "子轩", 88, "品德高尚，气宇轩昂", "水", "17"));
            names.add(createNameRecord(surname + "浩宇", 89, "心胸宽广，志向远大", "水", "20"));
        } else {
            names.add(createNameRecord(surname + "雅萱", 94, "优雅高贵，萱草忘忧", "木", "20"));
            names.add(createNameRecord(surname + "诗涵", 93, "诗情画意，内涵丰富", "水", "19"));
            names.add(createNameRecord(surname + "心悦", 91, "心情愉悦，性格开朗", "金", "15"));
            names.add(createNameRecord(surname + "梦琪", 89, "美梦成真，珍贵如玉", "木", "22"));
            names.add(createNameRecord(surname + "思妍", 90, "思维敏捷，美丽动人", "金", "18"));
        }
        
        return names;
    }
    
    private Map<String, Object> createNameRecord(String fullName, int score, String meaning, String wuxing, String strokes) {
        Map<String, Object> name = new HashMap<>();
        name.put("fullName", fullName);
        name.put("score", score);
        name.put("meaning", meaning);
        name.put("wuxing", wuxing);
        name.put("strokes", strokes);
        return name;
    }
}
