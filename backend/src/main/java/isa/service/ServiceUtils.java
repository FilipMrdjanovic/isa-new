package isa.service;

import org.springframework.util.StringUtils;

public class ServiceUtils {
    public static boolean allParametersEmpty(Object... parameters) {
        for (Object parameter : parameters) {
            if (parameter != null && !StringUtils.isEmpty(parameter.toString())) {
                return false;
            }
        }
        return true;
    }
}