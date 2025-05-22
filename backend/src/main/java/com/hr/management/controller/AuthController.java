package com.hr.management.controller;

import com.hr.management.dto.LoginRequestDTO;
import com.hr.management.dto.LoginResponseDTO;
import com.hr.management.entity.Staff;
import com.hr.management.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final StaffService staffService;

    @Autowired
    public AuthController(StaffService staffService) {
        this.staffService = staffService;
    }

    /**
     * 登录接口
     * @param request 包含员工ID和密码的登录请求
     * @return 登录响应，包含员工信息和角色
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        // 特殊处理人事经理的登录
        if (request.getStaffId().equals("hr001") && "hrpassword".equals(request.getPassword())) {
            LoginResponseDTO response = new LoginResponseDTO();
            response.setStaffId("hr001");
            response.setRole("HR_MANAGER"); // 设置角色为人事经理
            response.setFirstName("HR");
            response.setLastName("Manager");
            return ResponseEntity.ok(response);
        }

        try {
            // 将员工ID从字符串转换为Long类型
            Long staffId = Long.parseLong(request.getStaffId());
            // 调用服务层的登录方法验证员工ID和密码
            Optional<Staff> staffOpt = staffService.login(staffId, request.getPassword());

            if (staffOpt.isPresent()) {
                Staff staff = staffOpt.get();
                LoginResponseDTO response = new LoginResponseDTO();
                response.setStaffId(staff.getStaffId().toString());
                response.setFirstName(staff.getFirstName());
                response.setLastName(staff.getLastName());

                // 确定员工角色
                if (staffService.isManager(staff.getStaffId())) {
                    response.setRole("DEPARTMENT_MANAGER"); // 设置角色为部门经理
                    response.setSectionId(staff.getSectionId().toString()); // 设置部门ID
                } else {
                    response.setRole("EMPLOYEE"); // 设置角色为普通员工
                }

                return ResponseEntity.ok(response);
            }
        } catch (NumberFormatException e) {
            // 捕获无效的员工ID格式异常
        }

        // 返回401状态码表示登录失败
        return ResponseEntity.status(401).body(null);
    }
}